import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  let body: any;
  try {
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    const { className, subjectName, weekNumber } = body;
    console.log(`[DEBUG] Payload:`, body);

    if (!className || !subjectName || !weekNumber) {
      return NextResponse.json({ error: "Missing required fields", payload: body }, { status: 400 });
    }

    // 1. Check if challenge already exists
    console.log(`[DEBUG] Checking for existing challenge...`);
    let challenge = await (prisma as any).challenge.findFirst({
      where: { 
        class: className, 
        subject: subjectName, 
        weekNumber: parseInt(weekNumber) 
      },
      include: { questions: true }
    });

    if (challenge) {
      console.log("[DEBUG] Found existing challenge");
      return NextResponse.json(challenge);
    }

    console.log(`[DEBUG] Fetching subject: ${subjectName} for ${className}`);
    const subject = await (prisma as any).subject.findFirst({
      where: { name: subjectName, class: className },
      include: { chapters: { orderBy: { orderIndex: 'asc' } } }
    });

    if (!subject) {
      console.log("[DEBUG] Subject not found in DB");
      return NextResponse.json({ 
        error: "Subject not found", 
        hint: `Check if name '${subjectName}' and class '${className}' match DB exactly.` 
      }, { status: 404 });
    }

    const milestoneChapter = subject.chapters.find((ch: any) => ch.title.includes(`Week ${weekNumber}`));
    console.log(`[DEBUG] Milestone chapter:`, milestoneChapter?.title || "Not found");
    
    const relevantChapters = subject.chapters.filter((ch: any) => 
      !ch.title.includes('Challenge') && 
      (milestoneChapter ? ch.orderIndex < milestoneChapter.orderIndex : true)
    );

    const chapterTitles = relevantChapters.map((ch: any) => ch.title).join(", ");
    console.log(`[DEBUG] Relevant chapters count: ${relevantChapters.length}`);

    const prompt = `
      You are an elite NCERT Teacher. Generate a "Weekly Challenge" (Written Assessment) for:
      Class: ${className}
      Subject: ${subjectName}
      Chapters Covered: ${chapterTitles}
      Week Number: ${weekNumber}

      REQUIREMENTS:
      1. Generate exactly 5 unique WRITTEN questions (not MCQs).
      2. Difficulty Distribution: 20% Easy, 40% Medium, 40% Hard.
      3. Content Source (Simulate): Mix of DPP, Previous Year Papers, and Competitive Exams.

      OUTPUT FORMAT (JSON ARRAY ONLY, no other text):
      [
        {
          "text": "The question content here...",
          "difficulty": "Easy",
          "sourceType": "DPP",
          "answer": "Brief hint..."
        }
      ]
    `;

    console.log("[DEBUG] Calling Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log("[DEBUG] AI Response length:", text.length);
    
    // Cleanup JSON
    text = text.replace(/```json|```/g, "").trim();
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']') + 1;
    if (startIdx !== -1 && endIdx !== -1) {
      text = text.substring(startIdx, endIdx);
    } else {
      const objStart = text.indexOf('{');
      const objEnd = text.lastIndexOf('}') + 1;
      if (objStart !== -1 && objEnd !== -1) {
        text = text.substring(objStart, objEnd);
      }
    }
    
    console.log("[DEBUG] Cleaned JSON start:", text.substring(0, 50));
    
    const parsed = JSON.parse(text);
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    
    if (questions.length === 0) {
      throw new Error("Gemini returned empty or invalid question array");
    }

    // 3. Save to Database
    console.log(`[DEBUG] Saving ${questions.length} questions to DB via Prisma:`, (prisma as any).challenge ? "EXISTS" : "MISSING");
    challenge = await (prisma as any).challenge.create({
      data: {
        title: `Week ${weekNumber} Grand Challenge`,
        class: className,
        subject: subjectName,
        weekNumber: parseInt(weekNumber),
        questions: {
          create: questions.map((q: any) => ({
            text: q.text || "Explain the concept.",
            difficulty: q.difficulty || "Medium",
            sourceType: q.sourceType || "Generated",
            answer: q.answer || "Key points."
          }))
        }
      },
      include: { questions: true }
    });

    console.log("[DEBUG] Successfully created and saved challenge.");
    return NextResponse.json(challenge);

  } catch (error: any) {
    console.error("[CRITICAL] Weekly Challenge Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error during Challenge Generation", 
      details: error.message,
      stack: error.stack,
      payload: body || "No body"
    }, { status: 500 });
  }
}
