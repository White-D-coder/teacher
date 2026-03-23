import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

async function generateQuestionsWithRetry(subject: string, className: string, chapter: string, retryCount = 0): Promise<any> {
  const prompt = `You are a curriculum expert for ${subject} for ${className} (NCERT/CBSE level).
Generate 10 high-quality multiple-choice questions for the chapter: '${chapter}'.
Return ONLY a valid JSON array of objects with this structure:
[
  {
    "text": "The actual question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Simple explanation."
  }
]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error: any) {
    if (error.status === 429 && retryCount < 5) {
      const waitTime = Math.pow(2, retryCount) * 1000 + 5000;
      console.log(`    ⚠️ Rate limited for ${chapter}. Retrying in ${Math.round(waitTime/1000)}s...`);
      await new Promise(r => setTimeout(r, waitTime));
      return generateQuestionsWithRetry(subject, className, chapter, retryCount + 1);
    }
    console.error(`    ❌ Error for ${chapter}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Real AI Quiz Generation...');

  const subjects = await prisma.subject.findMany({
    include: { chapters: true }
  });

  for (const subject of subjects) {
    console.log(`\n📚 Processing Subject: ${subject.name} (${subject.class})`);
    
    for (const chapter of subject.chapters) {
      console.log(`  - Generating real questions for: ${chapter.title}...`);
      
      const questionsData = await generateQuestionsWithRetry(subject.name, subject.class, chapter.title);
      
      if (!questionsData || !Array.isArray(questionsData)) {
        console.log(`    ⚠️ Failed to generate or parse questions for ${chapter.title}. Skipping.`);
        continue;
      }

      // 1. Delete existing quiz/questions for this chapter
      const existingQuiz = await prisma.quiz.findUnique({ where: { chapterId: chapter.id } });
      if (existingQuiz) {
        await prisma.question.deleteMany({ where: { quizId: existingQuiz.id } });
        await prisma.quiz.delete({ where: { id: existingQuiz.id } });
      }

      // 2. Create New Quiz
      const quiz = await prisma.quiz.create({
        data: { chapterId: chapter.id }
      });

      // 3. Insert Real Questions
      const questionsToCreate = questionsData.map((q: any) => ({
        quizId: quiz.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        imageUrl: null // AI doesn't generate images easily here, but we can add placeholders or use the old logic for 20%
      }));

      await prisma.question.createMany({ data: questionsToCreate });
      console.log(`    ✅ Success! Created ${questionsToCreate.length} real questions.`);
      
      // Wait a bit to avoid rate limiting (Free tier: 15 RPM for Flash)
      await new Promise(r => setTimeout(r, 8000));
    }
  }

  console.log('\n✨ Finished! All chapter quizzes updated with real AI content.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
