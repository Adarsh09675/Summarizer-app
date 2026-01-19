import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ stable + supported
// ✅ Strictly using Gemini 2.0 Flash (aka 2.5 Flash) as requested
const MODEL_NAME = "gemini-2.5-flash";

async function generateWithRetry(prompt: string, retries = 3): Promise<string> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    try {
        console.log(`Requesting summary from ${MODEL_NAME}...`);
        const result = await model.generateContent(`Summarize the following text efficiently and concisely:\n\n${prompt}`);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error(`Error with ${MODEL_NAME}:`, error.message);

        // Check for 429 (Quota Exceeded) or 503 (Service Unavailable)
        if ((error.status === 429 || error.status === 503) && retries > 0) {
            console.log(`Retrying ${MODEL_NAME} in 2 seconds... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return generateWithRetry(prompt, retries - 1);
        }

        if (error.status === 404 || error.message?.includes("404")) {
            throw new Error("Model not found or API key invalid.");
        }
        if (error.status === 429 || error.message?.includes("429")) {
            throw new Error("Quota exceeded. Please try again later.");
        }
        throw error;
    }
}

export async function generateSummary(prompt: string) {
    try {
        return await generateWithRetry(prompt);
    } catch (error: any) {
        return `Failed to generate summary: ${error.message || 'Unknown error'}`;
    }
}
