import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

export async function POST(request: Request) {
  try {
    const { subject, className, chapterId, chapterTitle } = await request.json();

    if (!chapterId || !chapterTitle) {
      return NextResponse.json({ error: "Missing chapter data" }, { status: 400 });
    }

    const prompt = `You are a curriculum expert for ${subject} for ${className} (NCERT/CBSE level).
Generate 5 high-quality, unique multiple-choice questions for the chapter: '${chapterTitle}'.
Ensure the questions are fresh and not generic placeholders.
Return ONLY a valid JSON array of objects with this structure (no other text, no markdown code blocks):
[
  {
    "text": "The actual question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Simple explanation."
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean JSON response from AI
    text = text.replace(/```json|```/g, "").trim();
    
    // Find the first '[' and last ']' to extract clean JSON if there's extra text
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']') + 1;
    if (startIdx !== -1 && endIdx !== -1) {
      text = text.substring(startIdx, endIdx);
    }
    
    const questions = JSON.parse(text);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid AI response: Not an array or empty");
    }

    // Database Operation: Update/Create Quiz
    // 1. Delete existing quiz and questions for this chapter
    await prisma.quiz.deleteMany({
      where: { chapterId: chapterId }
    });

    // 2. Create new Quiz with Questions
    const newQuiz = await prisma.quiz.create({
      data: {
        chapterId: chapterId,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || `Correct answer is option ${q.correctAnswer + 1}`
          }))
        }
      },
      include: {
        questions: true
      }
    });

    return NextResponse.json(newQuiz);

  } catch (error: any) {
    console.error("❌ AI Quiz Generation Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate quiz", 
      details: error.message 
    }, { status: 500 });
  }
}
