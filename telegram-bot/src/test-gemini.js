import { analyzeSymptoms } from './gemini.js';

async function testGemini() {
  console.log("Testing Gemini API connection...");
  try {
    const text = await analyzeSymptoms("I have a mild headache and fever for 2 days", "en");
    console.log("\n--- Gemini AI Response ---");
    console.log(text);
    console.log("-------------------------\n");
    console.log("✅ Gemini API test successful!");
  } catch (error) {
    console.error("❌ Gemini API test failed:", error);
  }
}

testGemini();
