
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAfBdLU9N0sBk8i_9IF7wlEYUxMTC8c0NU";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log("Starting model validation...");
    const candidates = ["gemini-pro", "gemini-1.5-flash", "models/gemini-pro", "gemini-1.0-pro"];

    for (const modelName of candidates) {
        console.log(`Testing model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName} is working.`);
            break;
        } catch (e) {
            console.log(`❌ FAILED: ${modelName}`);
            // console.log(e.message);
        }
    }
}

listModels();
