import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // In @google/generative-ai, listModels is not on genAI directly in some versions.
    // Let's call the API directly to see what models exist.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Available models:");
    if (data.models) {
      data.models.forEach(m => {
        console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
