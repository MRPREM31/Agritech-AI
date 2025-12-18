import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Read() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const courses = [
    {
      id: "rotation",
      title: "Crop Rotation 101",
      description: "फसल चक्र कैसे करें / Learn best rotation practices",
      duration: "15 min",
      color: "bg-green-100 text-green-700",
      modules: [
        {
          title: "Why Crop Rotation Matters",
          content: `Crop rotation is a practice of growing different crops in the same field in sequential seasons. This helps:\n\n1. Restore Soil Nutrients: Different crops use different nutrients. Legumes (like pulses) add nitrogen back to soil.\n\n2. Break Pest Cycles: Pests specific to one crop die off when a different crop is planted.\n\n3. Improve Soil Structure: Varied root depths improve soil aeration and water retention.\n\nExample: Wheat → Pulses → Vegetables → Back to Wheat`
        },
        {
          title: "पारंपरिक भारतीय तरीके / Traditional Methods",
          content: `भारतीय किसान सदियों से फसल चक्र करते आए हैं।\n\nपारंपरिक प्रणाली:\n• खरीफ (मई-अक्टूबर): धान, मक्का, ज्वार\n• रबी (नवंबर-मार्च): गेहूं, जौ, मसूर, सरसों\n• ग्रीष्म (अप्रैल-मई): दलहन, सब्जियां\n\nयह प्राकृतिक मौसम चक्र के अनुसार काम करता है और मिट्टी को स्वाभाविक रूप से पुनर्जीवित करता है।`
        },
        {
          title: "Modern Rotation Patterns",
          content: `Scientific crop rotation models:\n\n2-Year Rotation:\nYear 1: Wheat/Maize\nYear 2: Pulses (Chickpea/Lentil)\n\n3-Year Rotation:\nYear 1: Cereal (Rice/Wheat)\nYear 2: Legume (Pea/Pulses)\nYear 3: Cash Crop (Cotton/Sugarcane)\n\nBenefits: 30-40% increase in soil fertility, 25% better yields after 3-5 years`
        },
        {
          title: "Best Crops for Odisha",
          content: `Recommended rotation for Odisha's climate:\n\nRainy Season (Kharif):\n- Rice (Primary)\n- Maize (Alternative)\n- Pulses (Pigeon Pea)\n\nWinter Season (Rabi):\n- Wheat\n- Pulses (Gram, Lentil)\n- Vegetables (Tomato, Onion)\n\nSummer:\n- Groundnut\n- Vegetables\n- Green manure crops\n\nTip: 3-year rotation increases soil organic matter by 15-20%`
        },
      ]
    },
    {
      id: "soil",
      title: "Soil Management",
      description: "मिट्टी की देखभाल / Care for your soil",
      duration: "20 min",
      color: "bg-amber-100 text-amber-700",
      modules: [
        {
          title: "Soil Types & Testing",
          content: `Different soil types require different management:\n\n1. Sandy Soil: Light, drains quickly, low fertility\n   - Add: Organic matter, compost\n   - Crops: Groundnut, millets\n\n2. Loamy Soil: Ideal for most crops\n   - Balanced water retention and drainage\n   - Crops: Wheat, rice, vegetables\n\n3. Clay Soil: Heavy, water retains, prone to waterlogging\n   - Add: Organic matter for structure\n   - Crops: Rice, pulses\n\nSoil Testing: Test soil every 2-3 years for:\n- pH level (6.5-7.5 is ideal)\n- Nitrogen, Phosphorus, Potassium (NPK)\n- Organic matter content`
        },
        {
          title: "पीएच स्तर को समझना / Understanding pH",
          content: `मिट्टी का पीएच स्तर यह दर्शाता है कि मिट्टी कितनी अम्लीय या क्षारीय है।\n\nपीएच स्केल: 0-14 (7 = तटस्थ)\n\n• 6.5-7.5: अधिकांश फसलों के लिए आदर्श\n• < 6.5: अम्लीय (चूना (लाइम) जोड़ें)\n• > 7.5: क्षारीय (सल्फर जोड़ें)\n\nओडिशा में मिट्टी आमतौर पर थोड़ी अम्लीय है (पीएच 5.5-6.5)।\n\nसुधार: वर्षा के बाद चूना जोड़ें, 2-3 साल में सुधार दिखेगा।`
        },
        {
          title: "Organic Matter & Compost",
          content: `Organic matter is dead plant/animal material that improves soil:\n\nBenefits:\n- Increases water retention by 20-30%\n- Improves nutrient availability\n- Promotes beneficial microorganisms\n- Reduces need for chemical fertilizers\n\nSources of Organic Matter:\n1. Farmyard Manure (FYM): 5-10 tons/hectare yearly\n2. Compost: Make from crop residues in 3-4 months\n3. Vermicompost: High nutrient content\n4. Green Manure: Grow legumes, plow them back\n\nTarget: 2-3% organic matter in soil (increase by 0.5% annually)`
        },
        {
          title: "Fertilizer Types",
          content: `Understanding NPK (Nitrogen-Phosphorus-Potassium):\n\nNitrogen (N): Promotes leaf growth, greenness\n- Deficiency: Yellow leaves\n- Sources: Urea, Ammonium Sulfate, Neem cake\n\nPhosphorus (P): Root development, seed formation\n- Deficiency: Poor root growth, delayed flowering\n- Sources: Superphosphate, Bone meal\n\nPotassium (K): Overall plant health, disease resistance\n- Deficiency: Weak stems, poor fruit quality\n- Sources: Potassium Chloride, Wood ash\n\nRecommended NPK ratios:\n- Rice: 80:40:40 kg/hectare\n- Wheat: 100:60:40 kg/hectare\n- Vegetables: 100:100:50 kg/hectare`
        },
      ]
    },
    {
      id: "water",
      title: "Water Management",
      description: "पानी की बचत / Irrigation best practices",
      duration: "18 min",
      color: "bg-blue-100 text-blue-700",
      modules: [
        {
          title: "Drip Irrigation Systems",
          content: `Drip irrigation delivers water directly to plant roots, reducing waste:\n\nAdvantages:\n- Saves 30-50% water vs. flood irrigation\n- Delivers nutrients directly to roots\n- Reduces disease spread\n- Works on uneven terrain\n\nCost in India: ₹50,000-80,000 per hectare (subsidy available)\n\nBest for: Vegetables, fruits, sugarcane, cotton\n\nSetup:\n- Main line from water source\n- Sub-mains and laterals\n- Drippers at 30-60cm intervals\n- Regular maintenance every 2 weeks`
        },
        {
          title: "जल संरक्षण / Water Conservation",
          content: `पानी बचाने के तरीके:\n\n1. Mulching: फसल के चारों ओर पुआल/गाय के गोबर से 5-10 सेमी की परत\n   - लाभ: नमी 20-30% कम खोते हैं, मातम कम आते हैं\n\n2. Raised Beds: क्यारियों में बीज बोएं\n   - जलभराव से बचाव\n   - बेहतर जल निकासी\n\n3. Scheduled Watering: गर्म मौसम में सुबह या शाम को पानी दें\n   - दिन के मध्य में 40% पानी वाष्पीकरण से खो जाता है\n\n4. Soil Moisture Sensors: आधुनिक उपकरण\n   - सही समय पर सही मात्रा में पानी\n   - पानी की बचत 25-35%`
        },
        {
          title: "Rainfall Harvesting",
          content: `Rainwater harvesting to store water for dry seasons:\n\nMethods:\n1. Ponds & Tanks: Store runoff water\n   - Capacity: 100,000+ liters per hectare\n   - Use during dry months\n\n2. Borewell Recharge: Direct rainwater to groundwater\n   - Increases water table\n   - Sustainable long-term solution\n\n3. Check Dams: Build in fields to slow runoff\n   - Increases soil water content\n   - Costs: ₹10,000-15,000 per check dam\n\nBenefits:\n- Reduces irrigation costs by 40%\n- Increases groundwater level\n- Environment-friendly\n- Government subsidies available in Odisha`
        },
        {
          title: "Seasonal Watering Tips",
          content: `Season-wise irrigation guide for Odisha:\n\nKharif (June-Oct): Heavy rainfall\n- Minimal irrigation needed\n- Focus on drainage\n- Avoid waterlogging\n\nRabi (Nov-Feb): Low rainfall\n- 4-5 irrigations for wheat: 21, 45, 60, 75 days\n- 3-4 for pulses: 30, 45, 60 days\n- Early morning watering best\n\nSummer (Mar-May): High evaporation\n- Weekly irrigation\n- Drip irrigation recommended\n- Mulching essential\n\nWater requirement by crop:\n- Rice: 1000-1500 mm/season\n- Wheat: 400-500 mm\n- Vegetables: 300-600 mm`
        },
      ]
    },
  ];

  return (
    <Layout>
      <h2 className="mb-6 font-heading text-2xl lg:text-3xl font-bold text-secondary">Learn & Read</h2>

      {selectedCourse ? (
        <div className="max-w-4xl">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => {
              setSelectedCourse(null);
              setExpandedModule(null);
            }}
          >
            ← Back to Courses
          </Button>

          {(() => {
            const course = courses.find(c => c.id === selectedCourse);
            return course ? (
              <>
                <Card className={`mb-6 border-none shadow-lg ${course.color}`}>
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-2">{course.title}</h2>
                    <div className="flex items-center gap-4 mt-4 text-sm font-medium opacity-80">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} read time</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {course.modules.map((module, i) => (
                    <motion.div key={i}>
                      <Card 
                        className="hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                      >
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-medium text-secondary">{module.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">5-10 min read</p>
                              </div>
                            </div>
                            {expandedModule === i ? (
                              <ChevronUp className="h-5 w-5 text-primary" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedModule === i && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-border"
                              >
                                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                  {module.content}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 lg:p-8 bg-primary/5 rounded-xl border-2 border-primary/20">
                  <h3 className="font-heading font-bold text-secondary mb-3">📌 Key Takeaways:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Essential for Odisha farming conditions</li>
                    <li>Mix of traditional and modern techniques</li>
                    <li>Proven to increase yields by 20-40%</li>
                    <li>Apply these tips immediately to your farm</li>
                  </ul>
                </div>
              </>
            ) : null;
          })()}
        </div>
      ) : (
        <div>
          <div className="mb-8 p-6 lg:p-8 bg-accent/10 rounded-xl border-2 border-accent/20">
            <h3 className="font-heading font-bold text-secondary mb-2">📚 Educational Courses</h3>
            <p className="text-sm text-muted-foreground">
              Learn from experienced farmers & agricultural experts. All content in Hindi & English. Click any course to expand and read detailed modules.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
                <CardContent 
                  className="p-4 lg:p-6"
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${course.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-secondary mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{course.duration}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
