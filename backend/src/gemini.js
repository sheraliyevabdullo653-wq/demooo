import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv files
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') });

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("WARNING: API key for Gemini is not defined in the environment!");
}

/**
 * Analyzes symptoms described by user.
 * @param {string} symptoms 
 * @param {string} lang ('uz', 'ru', 'en')
 */
export async function analyzeSymptoms(symptoms, lang = 'uz') {
  try {
    let systemPrompt = `You are MedicalCore AI, a professional medical assistant. 
    Analyze the user's symptoms and output the response in the language: ${lang}.
    Structure your answer as follows:
    1. 🔍 Possible Conditions (Taxminiy kasalliklar / Вероятные заболевания): List 2-3 potential causes.
    2. 👨‍⚕️ Recommended Doctor (Tavsiya etilgan shifokor / Рекомендуемый врач): Suggest the specialty they should book.
    3. ⚠️ Critical Warnings (Muhim ogohlantirishlar / Важные предупреждения): Warn them when to call an ambulance (SOS) or seek urgent care.
    Use formatting like bolding and bullet points. End with a disclaimer that AI is not a doctor. Keep it concise, helpful, and highly professional.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: symptoms }
        ],
        max_tokens: 1500
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in Gemini analyzeSymptoms:", error);
    throw error;
  }
}

/**
 * Explains medical lab test result images.
 * @param {Buffer} imageBuffer 
 * @param {string} mimeType 
 * @param {string} lang 
 */
export async function explainLabResults(imageBuffer, mimeType, lang = 'uz') {
  try {
    let systemPrompt = `You are MedicalCore AI, a premium medical lab analyzer.
    The user has uploaded a photo of their lab test results (blood test, urine test, ultrasound, etc.).
    Your job is to read and explain the results in the language: ${lang}.
    Structure your answer as follows:
    1. 📊 Key Findings (Asosiy ko'rsatkichlar / Основные показатели): Identify key markers and explain if they are normal, high, or low.
    2. 💡 What this means (Tushuntirish / Что это значит): Explain the findings in simple, easy-to-understand terms.
    3. 🩺 Next steps (Tavsiya / Следующие шаги): What kind of doctor to visit, or if any follow-up tests are needed.
    Always include a clear warning that this analysis does not replace a doctor's diagnosis. Use emojis and professional formatting.`;

    const base64Image = imageBuffer.toString('base64');

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Here are the lab results:' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in Gemini explainLabResults:", error);
    throw error;
  }
}

/**
 * Reads handwritten doctor recipes/prescriptions.
 * @param {Buffer} imageBuffer 
 * @param {string} mimeType 
 * @param {string} lang 
 */
export async function readPrescription(imageBuffer, mimeType, lang = 'uz') {
  try {
    let systemPrompt = `You are MedicalCore AI, a premium prescription-reading pharmacist assistant.
    The user has uploaded an image of a handwritten or printed prescription.
    Your job is to transcribe the medicine names, dosages, and instructions in the language: ${lang}.
    Structure your answer as follows:
    1. 💊 Identified Medicines (Aniqlangan dorilar / Определенные лекарства): List the names, form (pills, syrup), and dosage (e.g., 500mg).
    2. 📝 Usage Instructions (Qabul qilish tartibi / Способ применения): How many times a day, before/after meals, etc.
    3. ⚠️ Safety Warning (Xavfsizlik eslatmasi / Меры предостроительности): Emphasize that they must consult a pharmacist or doctor before taking.
    Make it highly readable with clean lists and bold text.`;

    const base64Image = imageBuffer.toString('base64');

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Here is the prescription photo:' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in Gemini readPrescription:", error);
    throw error;
  }
}

/**
 * Generic chat completions using Gemini
 * @param {string} question
 * @param {Array} history
 * @param {string} lang
 */
export async function askGemini(question, history = [], lang = 'uz') {
  try {
    const systemInstruction = `You are MediCore AI, a highly advanced and versatile medical and wellness assistant. You can answer any health, science, wellness, and general knowledge questions. While you are an expert in medical topics, you are helpfully general. Always provide accurate info and remind users and if it is a medical query, suggest professional consultation. Response should be in the language of the query or ${lang}.`;

    const contents = [{ role: 'system', content: systemInstruction }];
    for (const msg of history) {
      if (msg.role === 'system' || msg.id === 0) continue;
      contents.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.text || msg.content
      });
    }
    contents.push({ role: 'user', content: question });

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: contents,
        max_tokens: 1500
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in Gemini askGemini:", error);
    throw error;
  }
}
