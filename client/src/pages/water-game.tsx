import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { Droplets, RotateCcw, Trophy } from "lucide-react";
import { useCoins } from "@/hooks/use-coins";

type Drop = {
  id: number;
  x: number;
};

export default function WaterGame() {
  const [gameState, setGameState] =
    useState<"menu" | "playing" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [water, setWater] = useState(100);
  const [drops, setDrops] = useState<Drop[]>([]);
  const idRef = useRef(0);
  const { addCoins } = useCoins();

  /* ---------------- START GAME ---------------- */
  const startGame = () => {
    setScore(0);
    setWater(100);
    setDrops([]);
    setGameState("playing");
  };

  /* ---------------- SPAWN DROPS ---------------- */
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setDrops(prev => {
        if (prev.length >= 6) return prev;

        return [
          ...prev,
          {
            id: idRef.current++,
            x: Math.random() * 85,
          },
        ];
      });
    }, 600);

    return () => clearInterval(interval);
  }, [gameState]);

  /* ---------------- COLLECT DROP ---------------- */
  const collectWater = (x: number, id: number) => {
    if (navigator.vibrate) navigator.vibrate(60);

    setDrops(prev => prev.filter(d => d.id !== id));
    setScore(s => s + 10);
    setWater(w => Math.max(0, w - 3));

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: x / 100, y: 0.7 },
    });
  };

  /* ---------------- DROP MISSED ---------------- */
  const dropMissed = () => {
    setGameState("gameOver");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-secondary flex items-center gap-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          Water Collection Game
        </h2>

        <AnimatePresence mode="wait">
          {/* ---------------- MENU ---------------- */}
          {gameState === "menu" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">💧</div>
                  <h3 className="text-2xl font-bold">Save Every Drop</h3>
                  <p className="text-muted-foreground">
                    Tap water drops before they touch the ground.
                    <br />
                    Miss one → Game Over!
                  </p>
                  <p className="font-bold">🎯 Score 50+ to win</p>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full mt-4" onClick={startGame}>
                Start Game
              </Button>
            </motion.div>
          )}

          {/* ---------------- PLAYING ---------------- */}
          {gameState === "playing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between font-bold">
                <span>Score: {score}</span>
                <span
                  className={
                    water > 30
                      ? "text-blue-600"
                      : water > 10
                      ? "text-orange-500"
                      : "text-red-600"
                  }
                >
                  Water: {water}%
                </span>
              </div>

              {/* Water Bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  animate={{ width: `${water}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Game Area */}
              <Card className="h-96 relative overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50 border-2 border-blue-300">
                <CardContent className="absolute inset-0">
                  {drops.map(drop => (
                    <motion.div
                      key={drop.id}
                      initial={{ y: -40 }}
                      animate={{ y: 360 }} // ✅ FORCE bottom
                      transition={{ duration: 4, ease: "linear" }}
                      className="absolute text-4xl cursor-pointer select-none"
                      style={{ left: `${drop.x}%` }}
                      onClick={() => collectWater(drop.x, drop.id)}
                      onAnimationComplete={() => {
                        // If still exists, it means user missed it
                        if (drops.find(d => d.id === drop.id)) {
                          dropMissed();
                        }
                      }}
                    >
                      💧
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ---------------- GAME OVER ---------------- */}
          {gameState === "gameOver" && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center space-y-6"
            >
              {score >= 50 ? (
                <Trophy className="mx-auto h-20 w-20 text-yellow-500" />
              ) : (
                <Droplets className="mx-auto h-20 w-20 text-blue-500" />
              )}

              <h3 className="text-3xl font-bold">
                {score >= 50 ? "🎉 You Won!" : "💥 Water Missed!"}
              </h3>

              <p className="text-5xl font-bold">{score}</p>

              {score >= 50 && (
                <p className="text-lg font-bold text-primary">+100 Coins Earned! 🎉</p>
              )}

              <Card className="bg-amber-50 border-2 border-amber-200">
                <CardContent className="p-5 text-sm">
                  In farming, every drop matters. Missing water means loss 🌱💧
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => { if (score >= 50) addCoins(100); setTimeout(() => startGame(), 100); }}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Link href="/learn">
                  <Button variant="outline" className="flex-1" onClick={() => { if (score >= 50) addCoins(100); }}>
                    Back
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
