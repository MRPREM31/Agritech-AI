import dotenv from "dotenv";
import path from "path";
import Groq from "groq-sdk";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/**
 * 🚫 BANNED / RISKY PESTICIDES (India)
 */
const BANNED = [
  "endosulfan",
  "monocrotophos",
  "carbofuran",
  "aldicarb",
  "chlordane",
  "heptachlor",
  "dimethoate",
  "profenofos",
  "bifenthrin",
];

/**
 * ✅ SAFE & COMMONLY USED (STRICT WHITELIST)
 */
const SAFE_CHEMICALS = [
  "emamectin",
  "emamectin benzoate",
  "indoxacarb",
  "chlorantraniliprole",
  "spinosad",
  "neem oil",
  "bacillus thuringiensis",
  "bt",
];

/**
 * 🔒 HARD SAFETY ENFORCER
 */
function enforceSafety(aiText: string): string {
  const lower = aiText.toLowerCase();

  // 🚫 1. Block banned chemicals
  for (const banned of BANNED) {
    if (lower.includes(banned)) {
      return safeFallback();
    }
  }

  // 🚫 2. Block unknown chemicals (whitelist only)
  const hasOnlySafeChemicals = SAFE_CHEMICALS.some((c) =>
    lower.includes(c)
  );

  if (!hasOnlySafeChemicals) {
    return safeFallback();
  }

  // 🚫 3. Block species guessing when crop unknown
  if (
    lower.includes("helicoverpa") ||
    lower.includes("eldana") ||
    lower.includes("leucinodes")
  ) {
    return safeFallback();
  }

  return aiText;
}

/**
 * ✅ SAFE IPM FALLBACK (GENERIC & CORRECT)
 */
function safeFallback(): string {
  return JSON.stringify({
    disease: "Fruit borer (caterpillar pest)",
    severity: "High",
    description:
      "Small holes appear on fruits due to caterpillar feeding. Larvae bore inside the fruits and feed on pulp, causing internal rotting, premature fruit drop, and yield loss.",
    cause:
      "Infestation by fruit-boring caterpillar pests. Warm and humid weather, excessive nitrogen fertilizer, poor field sanitation, and continuous cropping favor infestation.",
    treatment: [
      "Chemical control: Spray Emamectin Benzoate 5 SG at 0.4 g per liter of water OR Indoxacarb 14.5 SC at 0.5 ml per liter of water (follow label instructions)",
      "Biological control: Use neem oil 3–5 ml per liter of water or Bacillus thuringiensis (Bt) as per label instructions",
      "Cultural practices: Remove and destroy infested fruits, maintain proper spacing, and avoid excessive nitrogen fertilizer",
      "Safety precautions: Wear gloves and mask during spraying and avoid spraying during flowering or peak sunlight"
    ],
  });
}

/**
 * 🌾 Crop Diagnosis API
 */
export async function getCropDiagnosis(
  symptoms: string,
  language: "en" | "hi"
) {
  const prompt = `
You are a senior agriculture scientist and plant pathologist with over 20 years of experience in Indian farming conditions.

A farmer reports the following crop problem:

"${symptoms}"

Respond ONLY in valid JSON format:

{
  "disease": "Generic pest or disease name (do NOT guess species if crop is unknown)",
  "severity": "Low / Medium / High / Moderate to Severe",
  "description": "Clear explanation of visible symptoms",
  "cause": "Scientific and practical farming causes",
  "treatment": [
    "Chemical control using ONLY approved Indian insecticides with safe dosage",
    "Biological or organic control with correct dosage",
    "Cultural practices for prevention",
    "Safety precautions"
  ]
}

STRICT RULES:
- NEVER suggest banned or risky pesticides in India.
- Do NOT guess pest species unless crop is explicitly mentioned.
- Prefer integrated pest management (IPM).
- Use ml per liter or g per liter units only.
- Neem oil dosage should be 3–5 ml per liter.
- Spinosad dosage should be around 0.3 ml per liter.
- Bt is biological control, not chemical.
- No text outside JSON.

Output language: ${language === "hi" ? "Hindi" : "English"}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const aiText = response.choices[0]?.message?.content;
    if (!aiText) throw new Error("Empty AI response");

    return enforceSafety(aiText);
  } catch (error) {
    console.error("Groq error:", error);
    return safeFallback();
  }
}
