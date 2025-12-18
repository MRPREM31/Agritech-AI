import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Groq from "groq-sdk";

console.log("GROQ_API_KEY loaded:", process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function getCropDiagnosis(
  symptoms: string,
  language: "en" | "hi"
) {
  const prompt = `
You are an agricultural expert.

Symptoms described by farmer:
"${symptoms}"

Respond ONLY in valid JSON format:

{
  "disease": "",
  "severity": "",
  "description": "",
  "cause": "",
  "treatment": []
}

Language: ${language === "hi" ? "Hindi" : "English"}
Use very simple words for farmers.
`;

  const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.3,
});


  return response.choices[0].message.content;
}
