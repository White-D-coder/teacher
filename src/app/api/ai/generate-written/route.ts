import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SYSTEM_PROMPT = `You are an expert NCERT Indian School Teacher. 
Your task is to generate 5 high-quality written practice questions for a specific chapter.
The questions MUST follow this exact difficulty distribution:
- 2 Easy questions (Direct definitions or simple concepts)
- 2 Medium questions (Application or comparison)
- 1 Hard question (Analysis or complex problem solving)

Format the output exactly like this (plain text):
1. [Easy] Question text here...
2. [Easy] Question text here...
3. [Medium] Question text here...
4. [Medium] Question text here...
5. [Hard] Question text here...

Keep questions age-appropriate, professional, and directly related to the NCERT curriculum topics.`;

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { chapterId, chapterTitle, subject, className } = await request.json();

    if (!chapterTitle || !subject || !className) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    const prompt = `Generate 5 written assessment questions for:
Chapter: ${chapterTitle}
Subject: ${subject}
Class: ${className}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsText = response.text().trim();

    if (!questionsText) {
      throw new Error("AI failed to generate questions");
    }

    // Optional: Save to DB so they persist until refreshed manually
    if (chapterId) {
      await prisma.chapter.update({
        where: { id: chapterId },
        data: { writtenQuestion: questionsText }
      });
    }

    return NextResponse.json({ questions: questionsText });

  } catch (error: any) {
    console.error("❌ AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate questions", details: error.message }, { status: 500 });
  }
}
