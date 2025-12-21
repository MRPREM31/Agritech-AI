import type { Express } from "express";
import type { Server } from "http";
import { getCropDiagnosis } from "./groq";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /**
   * 🌾 AI Crop Diagnosis API
   * POST /api/diagnose
   * Body:
   * {
   *   "symptoms": "text description by farmer",
   *   "language": "en" | "hi"
   * }
   */
  app.post("/api/diagnose", async (req, res) => {
    try {
      const { symptoms, language } = req.body;

      // validation
      if (!symptoms || typeof symptoms !== "string") {
        return res.status(400).json({
          message: "Symptoms text is required",
        });
      }

      // call Groq AI
      const aiResult = await getCropDiagnosis(
        symptoms,
        language === "hi" ? "hi" : "en"
      );

      // Groq returns text → convert to JSON
      const diagnosis = JSON.parse(aiResult!);

      res.json(diagnosis);
    } catch (error) {
      console.error("Diagnosis error:", error);
      res.status(500).json({
        message: "AI diagnosis failed",
      });
    }
  });

  return httpServer;
}
