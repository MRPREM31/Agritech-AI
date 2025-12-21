import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Upload,
  CheckCircle,
  ScanLine,
  Volume2,
  ArrowLeft,
  Download,
  AlertCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function Diagnosis() {
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [activeTab, setActiveTab] = useState<"camera" | "text">("camera");
  const [image, setImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [translated, setTranslated] = useState<any>(null);
  const [translating, setTranslating] = useState(false);

  /* ================= DIAGNOSIS - ONLY TEXT DESCRIPTION ================= */
  const handleDiagnose = async () => {
    if (!textInput.trim()) {
      setErrorModal("Please describe the crop issue in detail.");
      return;
    }

    setStep("analyzing");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: textInput }),
      });

      const data = await res.json();
      setDiagnosis(data);
      setTranslated(null);
      setLanguage("en");
      setStep("result");
    } catch {
      setErrorModal("AI diagnosis is currently unavailable. Please try again.");
      setStep("input");
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrorModal("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorModal("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.onerror = () => {
      setErrorModal("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  /* ================= TRANSLATION ================= */
  const translateToHindi = async (text: string) => {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|hi`
    );
    const data = await res.json();
    return data.responseData.translatedText;
  };

  const translateDiagnosis = async () => {
    if (!diagnosis) return;

    setTranslating(true);

    const translatedData = {
      disease: await translateToHindi(diagnosis.disease),
      severity: await translateToHindi(diagnosis.severity),
      description: await translateToHindi(diagnosis.description),
      cause: await translateToHindi(diagnosis.cause),
      treatment: await Promise.all(
        diagnosis.treatment.map((t: string) => translateToHindi(t))
      ),
    };

    setTranslated(translatedData);
    setTranslating(false);
  };

  /* ================= VOICE ================= */
  const speakDiagnosis = () => {
    const d = language === "hi" && translated ? translated : diagnosis;
    if (!d || isSpeaking) return;

    const text =
      language === "hi"
        ? `बीमारी: ${d.disease}। कारण: ${d.cause}। उपचार: ${d.treatment.join(
            "। "
          )}`
        : `Disease: ${d.disease}. Cause: ${d.cause}. Treatment: ${d.treatment.join(
            ". "
          )}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  /* ================= STOP VOICE (NEW) ================= */
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  /* ================= PDF ================= */
  const downloadPDF = () => {
    const d = language === "hi" && translated ? translated : diagnosis;
    if (!d) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("EduFarma AI – Crop Diagnosis Report", pageWidth / 2, y, {
      align: "center",
    });

    y += 8;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 12;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");

    const symptomsText = pdf.splitTextToSize(
      d.description,
      pageWidth - 50
    );

    const boxHeight = 30 + symptomsText.length * 6;
    pdf.rect(15, y, pageWidth - 30, boxHeight);

    let boxY = y + 8;
    pdf.text("Disease:", 20, boxY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.disease, 50, boxY);

    boxY += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Severity:", 20, boxY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.severity, 50, boxY);

    boxY += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Symptoms:", 20, boxY);
    pdf.setFont("helvetica", "normal");
    pdf.text(symptomsText, 50, boxY);

    y += boxHeight + 12;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Cause", 15, y);

    y += 7;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      pdf.splitTextToSize(d.cause, pageWidth - 30),
      15,
      y
    );

    y += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Treatment Steps", 15, y);

    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    d.treatment.forEach((step: string, index: number) => {
      const wrapped = pdf.splitTextToSize(
        `${index + 1}. ${step}`,
        pageWidth - 35
      );
      pdf.text(wrapped, 18, y);
      y += wrapped.length * 6 + 2;
    });

    pdf.setFontSize(10);
    pdf.setTextColor(120);
    pdf.text(
      "This report is auto-generated using AI-based analysis.\nMade by QuantumCoders – NIST University",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );

    const safeName = d.disease.replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`${safeName}_Diagnosis_Report.pdf`);
  };

  const d = language === "hi" && translated ? translated : diagnosis;

  /* ================= UI ================= */
  return (
    <Layout>
      <h2 className="mb-8 text-2xl lg:text-3xl font-bold text-center text-green-700">
        🌾 Smart Crop Diagnosis
      </h2>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as any)}
                >
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="camera">📷 Upload Photo</TabsTrigger>
                    <TabsTrigger value="text">📝 Describe Issue</TabsTrigger>
                  </TabsList>

                  {/* ============= CAMERA TAB: Upload Image Only ============= */}
                  <TabsContent value="camera">
                    <div className="text-center space-y-4">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt="Uploaded crop"
                            className="w-full max-h-[300px] rounded-lg object-cover mx-auto shadow-md"
                          />
                          <p className="text-sm text-green-600 font-semibold">✅ Image Added Successfully</p>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setImage(null)}
                          >
                            ✕ Remove Image
                          </Button>
                        </>
                      ) : (
                        <>
                          <Camera className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Take a photo or upload an image of the affected crop
                          </p>
                          <Button variant="outline" className="relative w-full">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                            />
                            <Upload className="mr-2 h-4 w-4" />
                            Take/Upload Photo
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* ============= TEXT TAB: Describe Crop Issue ============= */}
                  <TabsContent value="text">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Describe the crop issue in detail. What do you see?
                      </p>
                      <Textarea
                        className="min-h-[180px]"
                        placeholder="Example: White powder on leaves, yellow spots appearing on stems, leaves are wilting, brown patches on fruit, pest holes on leaves..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    onClick={handleDiagnose}
                  >
                    🔍 Start Diagnosis
                  </Button>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div className="text-center py-24">
            <ScanLine className="mx-auto animate-pulse mb-4 text-green-600" />
            <p className="text-lg font-medium">
              Analyzing crop health using AI…
            </p>
          </motion.div>
        )}

        {step === "result" && d && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <select
                value={language}
                onChange={async (e) => {
                  const lang = e.target.value as "en" | "hi";
                  setLanguage(lang);
                  if (lang === "hi") await translateDiagnosis();
                }}
                className="border rounded-md px-3 py-2"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>

              {/* 🔊 SPEAK / STOP BUTTON */}
              <Button
                variant="outline"
                onClick={isSpeaking ? stopSpeaking : speakDiagnosis}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                {isSpeaking ? "Stop" : "Speak"}
              </Button>
            </div>

            {translating && (
              <p className="text-sm text-muted-foreground mb-3">
                🔄 Translating to Hindi…
              </p>
            )}

            <Card className="mb-4 border-l-4 border-green-600 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-xl font-bold text-green-700">
                  🦠 {d.disease}
                </h3>
                <p className="font-semibold text-orange-600 mt-1">
                  Severity: {d.severity}
                </p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-1">📝 Symptoms</h4>
                <p>{d.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-1">❓ Cause</h4>
                <p>{d.cause}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">💊 Treatment Steps</h4>
                <ul className="space-y-2">
                  {d.treatment.map((t: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle className="text-green-600 mt-1" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setStep("input")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> New Diagnosis
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={downloadPDF}
              >
                <Download className="mr-2 h-4 w-4" /> Download Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ERROR MODAL ================= */}
      <AnimatePresence>
        {errorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setErrorModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    ⚠️ Please Check
                  </h3>
                  <p className="text-sm text-muted-foreground">{errorModal}</p>
                </div>
                <button
                  onClick={() => setErrorModal(null)}
                  className="flex-shrink-0 text-muted-foreground hover:text-secondary transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setErrorModal(null)}
                >
                  Got it, thanks!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
