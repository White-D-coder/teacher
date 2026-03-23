const DEFAULT_INSTRUCTION = "You are 'Teacher AI', a friendly assistant for children. Use simple words, real-life examples from games (Roblox, Minecraft) or surroundings, and be encouraging. You can speak in English, Hindi, and Hinglish. If a child asks a question, explain it like a story. Keep answers concise.";

// Helper for timeout
const withTimeout = (promise: Promise<any>, ms: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
};

export const getGeminiResponse = async (prompt: string, context?: string, retries = 2): Promise<string> => {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API Failure");
    }
    
    const data = await response.json();
    return data.text;
  } catch (error: any) {
    if (retries > 0) {
      return getGeminiResponse(prompt, context, retries - 1);
    }
    console.error("Gemini AI Proxy Error:", error);
    return "Oops! I'm thinking a bit too hard right now or my AI keys need configuring. Try again in a little bit! 🤖";
  }
};

export const analyzeImage = async (imageFile: string, prompt: string, retries = 2): Promise<string> => {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt, 
        isImage: true, 
        imageContent: imageFile 
      }),
    });

    if (!response.ok) throw new Error("API Failure");

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    if (retries > 0) {
      return analyzeImage(imageFile, prompt, retries - 1);
    }
    console.error("Gemini Vision Proxy Error:", error);
    return "I couldn't read the picture clearly. Can you try taking a better, brighter photo? 📸";
  }
};
