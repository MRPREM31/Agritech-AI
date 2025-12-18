import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, CheckCircle, ScanLine, Volume2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function Diagnosis() {
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [image, setImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [diagnosis, setDiagnosis] = useState<{
    disease: string;
    severity: string;
    description: string;
    cause: string;
    treatment: string[];
  } | null>(null);

  // ================= BACKEND CALL =================
  const handleDiagnose = async () => {
    if (!textInput) return;

    setStep("analyzing");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: textInput, language }),
      });

      const data = await res.json();
      setDiagnosis(data);
      setStep("result");
    } catch {
      alert("AI diagnosis is temporarily unavailable.");
      setStep("input");
    }
  };

  // ================= IMAGE PREVIEW =================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ================= VOICE =================
  const speakDiagnosis = () => {
    if (!diagnosis) return;
    setIsSpeaking(true);

    const text =
      language === "hi"
        ? `बीमारी: ${diagnosis.disease}। कारण: ${diagnosis.cause}। उपचार: ${diagnosis.treatment.join("। ")}`
        : `Disease: ${diagnosis.disease}. Cause: ${diagnosis.cause}. Treatment: ${diagnosis.treatment.join(". ")}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ================= REAL PDF DOWNLOAD =================
  const downloadPDF = () => {
    if (!diagnosis) return;

    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(18);
    pdf.text("EduFarma AI – Crop Diagnosis Report", 20, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += 10;

    pdf.setFontSize(14);
    pdf.text(`Disease: ${diagnosis.disease}`, 20, y);
    y += 8;

    pdf.text(`Severity: ${diagnosis.severity}`, 20, y);
    y += 10;

    pdf.setFontSize(13);
    pdf.text("Description:", 20, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.text(diagnosis.description, 20, y, { maxWidth: 170 });
    y += 15;

    pdf.setFontSize(13);
    pdf.text("Cause:", 20, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.text(diagnosis.cause, 20, y, { maxWidth: 170 });
    y += 15;

    pdf.setFontSize(13);
    pdf.text("Treatment Steps:", 20, y);
    y += 7;

    pdf.setFontSize(11);
    diagnosis.treatment.forEach((t, i) => {
      pdf.text(`${i + 1}. ${t}`, 22, y, { maxWidth: 165 });
      y += 7;
    });

    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text(
      "⚠ This is an AI-generated report. Consult an agriculture officer if needed.",
      20,
      y,
      { maxWidth: 170 }
    );

    pdf.save("EduFarma_Diagnosis_Report.pdf");
  };

  // ================= UI =================
  return (
    <Layout>
      <h2 className="mb-6 text-2xl lg:text-3xl font-bold text-center">
        🌾 Diagnose Crop
      </h2>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Tabs defaultValue="text">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="text">Describe Issue</TabsTrigger>
                <TabsTrigger value="camera">Upload Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Card>
                  <CardContent className="p-6">
                    <Textarea
                      placeholder="White powder on leaves, yellow spots..."
                      className="min-h-[180px]"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="camera">
                <Card>
                  <CardContent className="p-6 text-center">
                    {image ? (
                      <img src={image} className="mx-auto max-h-64 rounded-lg" />
                    ) : (
                      <>
                        <Camera className="mx-auto mb-4" />
                        <Button variant="outline">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0"
                            onChange={handleImageUpload}
                          />
                          <Upload className="mr-2" /> Upload Image
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <Button className="w-full mt-6" onClick={handleDiagnose}>
                🔍 Start Diagnosis
              </Button>
            </Tabs>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div className="text-center py-20">
            <ScanLine className="mx-auto animate-pulse mb-4" />
            <p>Analyzing crop health using AI…</p>
          </motion.div>
        )}

        {step === "result" && diagnosis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-3 mb-4 justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="border rounded px-3 py-1"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>

              <Button size="sm" variant="outline" onClick={speakDiagnosis}>
                <Volume2 className="mr-1" /> Speak
              </Button>
            </div>

            <Card className="mb-4 border-l-4 border-red-500">
              <CardContent>
                <h3 className="text-xl font-bold">🦠 {diagnosis.disease}</h3>
                <p className="font-semibold text-orange-600">
                  Severity: {diagnosis.severity}
                </p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <h4 className="font-semibold">📝 Symptoms</h4>
                <p className="text-sm">{diagnosis.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <h4 className="font-semibold">❓ Cause</h4>
                <p className="text-sm">{diagnosis.cause}</p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <h4 className="font-semibold">💊 Treatment Steps</h4>
                <ul className="space-y-2 text-sm">
                  {diagnosis.treatment.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle className="text-green-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <p className="text-xs text-red-600 mb-4">
              ⚠ AI-generated diagnosis. Consult an agriculture officer if symptoms
              persist.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setStep("input")}>
                New Diagnosis
              </Button>
              <Button onClick={downloadPDF}>⬇ Download PDF</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
