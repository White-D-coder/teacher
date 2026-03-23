import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function test() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  console.log("API Key found:", apiKey.substring(0, 10) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = ["gemini-1.5-flash", "gemini-pro-latest", "gemini-pro"];
  
  for (const mName of modelsToTry) {
      try {
        console.log(`Trying model: ${mName}`);
        const model = genAI.getGenerativeModel({ model: mName });
        const result = await model.generateContent("Say hello");
        console.log(`✅ ${mName} Response:`, result.response.text());
        break; // Stop if one works
      } catch (e: any) {
        console.log(`❌ ${mName} Error:`, e.message);
        if (e.status === 429) console.log("Quota issue.");
      }
  }
}
test();
