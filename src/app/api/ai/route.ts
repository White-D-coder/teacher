import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "");
const MODEL_NAME = "gemini-pro-latest";
const FALLBACK_MODEL = "gemini-1.5-pro";

const DEFAULT_INSTRUCTION = "You are 'Teacher AI', a friendly assistant for children. Use simple words, real-life examples from games (Roblox, Minecraft) or surroundings, and be encouraging. You can speak in English, Hindi, and Hinglish. If a child asks a question, explain it like a story. Keep answers concise.";

export async function POST(request: Request) {
  try {
    const { prompt, context, isImage, imageContent } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        systemInstruction: isImage 
          ? "You are a visual teacher. Analyze the handwritten answer in the image and provide feedback in simple Hinglish. Point out mistakes gently."
          : DEFAULT_INSTRUCTION,
      });
    } catch (e) {
      model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: isImage 
          ? "You are a visual teacher. Analyze the handwritten answer in the image and provide feedback in simple Hinglish. Point out mistakes gently."
          : DEFAULT_INSTRUCTION,
      });
    }

    let result;
    try {
      if (isImage && imageContent) {
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageContent.replace(/^data:image\/\w+;base64,/, ""),
              mimeType: "image/jpeg",
            },
          },
        ]);
      } else {
        const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt;
        result = await model.generateContent(fullPrompt);
      }
    } catch (e: any) {
      if (e.message?.includes("429") || e.message?.includes("quota") || e.message?.includes("not found")) {
        // Try fallback model
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-flash-latest", systemInstruction: isImage ? "" : DEFAULT_INSTRUCTION });
        const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt;
        result = await fallbackModel.generateContent(fullPrompt);
      } else {
        throw e;
      }
    }

    const response = await result.response;
    const responseText = response.text();
    
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    console.error("❌ Gemini API Proxy Error:", error);
    
    // Check for specific common errors
    if (error.message?.includes("API key")) {
      return NextResponse.json({ error: "Invalid API Key", message: "Check your .env file" }, { status: 401 });
    }

    return NextResponse.json({ 
      error: "AI Service Error", 
      message: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
