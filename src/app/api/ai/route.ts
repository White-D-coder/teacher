import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "");
const MODEL_NAME = "gemini-1.5-flash";

const DEFAULT_INSTRUCTION = "You are 'Teacher AI', a friendly assistant for children. Use simple words, real-life examples from games (Roblox, Minecraft) or surroundings, and be encouraging. You can speak in English, Hindi, and Hinglish. If a child asks a question, explain it like a story. Keep answers concise.";

export async function POST(request: Request) {
  try {
    const { prompt, context, isImage, imageContent } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: isImage 
        ? "You are a visual teacher. Analyze the handwritten answer in the image and provide feedback in simple Hinglish. Point out mistakes gently."
        : DEFAULT_INSTRUCTION,
    });

    let result;
    if (isImage && imageContent) {
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageContent,
            mimeType: "image/jpeg",
          },
        },
      ]);
    } else {
      const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt;
      result = await model.generateContent(fullPrompt);
    }

    const responseText = result.response.text();
    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ 
      error: "AI Service Error", 
      message: error.message 
    }, { status: 500 });
  }
}
