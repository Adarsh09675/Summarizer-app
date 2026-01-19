
import { generateSummary } from './gemini';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
        }
    });
}

async function test() {
    try {
        console.log("Testing Gemini Connection (Strict Mode)...");
        const summary = await generateSummary("Hello, this is a test check.");

        const outFile = path.resolve(process.cwd(), 'utils/verification.txt');
        fs.writeFileSync(outFile, `Output: ${summary}`);
        console.log("Written to verification.txt");
    } catch (e: any) {
        const outFile = path.resolve(process.cwd(), 'utils/verification.txt');
        fs.writeFileSync(outFile, `Error: ${e.message}`);
        console.error("Test failed:", e);
    }
}

test();
