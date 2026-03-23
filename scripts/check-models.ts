import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Just to check connectivity
    console.log("Connected to Gemini API");
    // Unfortunately the standard SDK doesn't have a simple listModels, 
    // but we can try a few common names.
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-flash"
    ];
    for(const name of candidates) {
        try {
            const m = genAI.getGenerativeModel({ model: name });
            await m.generateContent("test");
            console.log(`✅ Model ${name} is WORKING`);
        } catch(e: any) {
            console.log(`❌ Model ${name} failed: ${e.message}`);
        }
    }
  } catch (error) {
    console.error("API Connection Error:", error);
  }
}
listModels();
