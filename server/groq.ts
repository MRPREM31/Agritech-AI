import dotenv from "dotenv";
import path from "path";
import Groq from "groq-sdk";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/* ===================== SAFETY LISTS ===================== */

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

/* ===================== HELPERS ===================== */

function inferPlantPart(symptoms: string): "leaf" | "fruit" | "stem" | "root" | "unknown" {
  const s = symptoms.toLowerCase();
  if (s.includes("leaf")) return "leaf";
  if (s.includes("fruit") || s.includes("pod")) return "fruit";
  if (s.includes("stem") || s.includes("shoot")) return "stem";
  if (s.includes("root") || s.includes("wilting")) return "root";
  return "unknown";
}

function inferIssueType(text: string): "insect" | "disease" | "nutrient" | "environmental" | "unknown" {
  const t = text.toLowerCase();
  if (t.includes("hole") || t.includes("tunnel") || t.includes("chew")) return "insect";
  if (t.includes("rot") || t.includes("fungal") || t.includes("spot")) return "disease";
  if (t.includes("yellow") || t.includes("deficiency") || t.includes("stunted")) return "nutrient";
  if (t.includes("heat") || t.includes("drought") || t.includes("waterlogging")) return "environmental";
  return "unknown";
}

/* ===================== SAFETY ENFORCER ===================== */

function enforceSafety(aiText: string, symptoms: string): string {
  const lower = aiText.toLowerCase();

  // 🚫 Hard ban chemicals
  for (const banned of BANNED) {
    if (lower.includes(banned)) {
      return smartFallback(inferPlantPart(symptoms));
    }
  }

  // 🚫 Species & pest group labels
  if (
    lower.includes("helicoverpa") ||
    lower.includes("leucinodes") ||
    lower.includes("eldana") ||
    lower.includes("stem borer") ||
    lower.includes("fruit borer") ||
    lower.includes("leaf miner")
  ) {
    return smartFallback(inferPlantPart(symptoms));
  }

  // 🚫 Fertilizer spray misuse
  if (
    lower.includes("dap") ||
    lower.includes("urea") ||
    lower.includes("npk") ||
    lower.includes("g/l")
  ) {
    return smartFallback(inferPlantPart(symptoms));
  }

  // ✅ Sanitize wording
  return aiText
    .replace(/pesticides?/gi, "control measures")
    .replace(/Neem oil/gi, "neem oil")
    .replace(/Spinosad/gi, "spinosad");
}

/* ===================== SMART FALLBACK ===================== */

function smartFallback(part: "leaf" | "fruit" | "stem" | "root" | "unknown"): string {
  const base = {
    severity: "Moderate",
    cause:
      "The issue may be related to pest attack, disease infection, nutrient imbalance, or environmental stress. Exact diagnosis requires crop and stage details.",
    treatment: [
      "Cultural control: Remove affected plant parts and maintain good field sanitation",
      "Organic support: Use neem oil 3–5 ml per liter of water or biological agents as per recommendation",
      "Soil and crop management: Maintain balanced nutrition and proper irrigation",
      "Safety precautions: Wear gloves and mask while spraying and follow label instructions"
    ],
  };

  const map = {
    leaf: {
      disease: "Leaf-related stress or damage",
      description: "Leaves show discoloration, spots, holes, or drying symptoms.",
    },
    fruit: {
      disease: "Fruit-related damage or rot",
      description: "Fruits show rotting, holes, or premature drop.",
    },
    stem: {
      disease: "Stem-related insect or disease damage",
      description: "Stems show holes, tunneling, or sudden wilting.",
    },
    root: {
      disease: "Root-related rot or stress",
      description: "Roots show decay leading to poor water and nutrient uptake.",
    },
    unknown: {
      disease: "General crop stress",
      description: "Crop shows abnormal growth or stress symptoms.",
    },
  };

  return JSON.stringify({ ...map[part], ...base });
}

/* ===================== MAIN API ===================== */

export async function getCropDiagnosis(symptoms: string, language: "en" | "hi") {
  const prompt = `
You are a senior Indian agriculture scientist.

Task:
1. Identify plant part affected.
2. Classify issue type (insect / disease / nutrient / environmental).
3. If unsure, stay generic.
4. Follow IPM strictly.
5. NEVER suggest fertilizer sprays or banned chemicals.

Respond ONLY in JSON:
{
  "disease": "Generic and safe name",
  "severity": "Low / Medium / High",
  "description": "Symptoms explanation",
  "cause": "Likely scientific cause",
  "treatment": [
    "Cultural control",
    "Organic or biological control",
    "Chemical control ONLY if necessary (safe only)",
    "Safety precautions"
  ]
}

Rules:
- Avoid pest species & group names
- Neem oil: 3–5 ml/L
- Spinosad: ~0.3 ml/L
- Bt is biological
- Avoid the word pesticides
- No text outside JSON

Output language: ${language === "hi" ? "Hindi" : "English"}

Farmer symptoms:
"${symptoms}"
`;

  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const aiText = res.choices[0]?.message?.content;
    if (!aiText) throw new Error("Empty response");

    return enforceSafety(aiText, symptoms);
  } catch (err) {
    console.error(err);
    return smartFallback(inferPlantPart(symptoms));
  }
}
