import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { Droplets, RotateCcw, Trophy } from "lucide-react";

export default function WaterGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [water, setWater] = useState(100);
  const [crops, setCrops] = useState<Array<{id: number, x: number, collected: boolean}>>([]);
  const [nextId, setNextId] = useState(0);

  const startGame = () => {
    setScore(0);
    setWater(100);
    setCrops([]);
    setNextId(0);
    setGameState("playing");
    
    // Generate crops periodically
    const interval = setInterval(() => {
      setCrops(prev => [...prev, {
        id: nextId + prev.length,
        x: Math.random() * 80,
        collected: false
      }]);
    }, 800);

    return () => clearInterval(interval);
  };

  const collectWater = (x: number, id: number) => {
    setCrops(prev => prev.map(c => c.id === id ? {...c, collected: true} : c));
    setScore(score + 10);
    setWater(Math.max(0, water - 3));
    confetti({ particleCount: 30, spread: 60, origin: { x: x / 100, y: 0.7 } });
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    if (water <= 0) {
      setGameState("gameOver");
      if (score > 50) {
        confetti({ particleCount: 150, spread: 100 });
      }
    }
  }, [water, gameState, score]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="mb-6 font-heading text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          Water Collection Game
        </h2>

        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">💧</div>
                  <h3 className="font-heading text-2xl font-bold text-secondary mb-3">Collect Water Drops</h3>
                  <p className="text-muted-foreground mb-6">
                    खेत को बचाओ! / Save the farm! <br/>
                    Click or tap on water drops to collect them. Each drop costs water. Plan wisely!
                  </p>
                  <div className="text-left bg-white p-4 rounded-lg space-y-2 text-sm mb-6">
                    <p><strong>⭐ Collect 50 points or more to win!</strong></p>
                    <p>💧 Each collection uses 3% water</p>
                    <p>⏱️ You have limited water to work with</p>
                  </div>
                </CardContent>
              </Card>
              
              <Button size="lg" onClick={startGame} className="w-full">
                Start Game
              </Button>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-secondary">Score: {score}</div>
                <div className="text-lg font-medium">
                  Water: <span className={water > 30 ? "text-blue-600" : water > 10 ? "text-orange-600" : "text-red-600"}>
                    {water.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600"
                  animate={{ width: `${water}%` }}
                />
              </div>

              <Card className="h-96 relative overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50 border-2 border-blue-200">
                <CardContent className="absolute inset-0 p-4">
                  {crops.map((crop) => (
                    <motion.div
                      key={crop.id}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: "100%", opacity: crop.collected ? 0 : 1 }}
                      transition={{ duration: crop.collected ? 0.3 : 4 }}
                      onAnimationComplete={() => {
                        if (!crop.collected) {
                          setCrops(prev => prev.filter(c => c.id !== crop.id));
                        }
                      }}
                      className={`absolute text-4xl cursor-pointer ${crop.collected ? "hidden" : ""}`}
                      style={{ left: `${crop.x}%` }}
                      onClick={() => collectWater(crop.x, crop.id)}
                    >
                      💧
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {water <= 0 && (
                <Button onClick={() => setGameState("gameOver")} className="w-full">
                  Game Over - Check Results
                </Button>
              )}
            </motion.div>
          )}

          {gameState === "gameOver" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                {score >= 50 ? (
                  <Trophy className="h-24 w-24 text-yellow-500 animate-bounce" />
                ) : (
                  <Droplets className="h-24 w-24 text-blue-500" />
                )}
              </div>

              <div>
                <h3 className="font-heading text-3xl font-bold text-secondary mb-2">
                  {score >= 50 ? "🎉 You Won!" : "Game Over"}
                </h3>
                <p className="text-5xl font-bold text-primary">{score}</p>
                <p className="text-muted-foreground">Points Earned</p>
              </div>

              <Card className="bg-amber-50 border-2 border-amber-200">
                <CardContent className="p-6 text-left space-y-2">
                  <p className="font-bold text-secondary">Real Life Lesson:</p>
                  <p className="text-sm text-muted-foreground">
                    जल संचय महत्वपूर्ण है! / Water conservation is key! This game teaches you to manage limited resources wisely - just like farming during drought season.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Link href="/learn">
                  <Button variant="outline" className="flex-1">
                    Back to Games
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
