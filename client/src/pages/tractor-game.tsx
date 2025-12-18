import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { RotateCcw, Trophy, Volume2 } from "lucide-react";

export default function TractorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setScore(0);
    setGameTime(30);
    setGameActive(true);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameTime === 0 && gameState === "playing") {
      setGameState("gameOver");
      if (score > 40) {
        confetti({ particleCount: 150, spread: 100 });
      }
    }
  }, [gameTime, gameState, score]);

  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tractorX = canvas.width / 2;
    let crops: Array<{ x: number; y: number; collected: boolean }> = [];
    let gameFrameId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") tractorX = Math.max(20, tractorX - 15);
      if (e.key === "ArrowRight") tractorX = Math.min(canvas.width - 20, tractorX + 15);
    };

    window.addEventListener("keydown", handleKeyDown);

    const spawnCrop = () => {
      if (gameActive && crops.length < 5) {
        crops.push({ x: Math.random() * canvas.width, y: -20, collected: false });
      }
    };

    const spawnInterval = setInterval(spawnCrop, 600);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#e0f2fe");
      gradient.addColorStop(1, "#fef3c7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.fillStyle = "#a0a0a0";
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

      // Road markings
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw tractor
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🚜", tractorX, canvas.height - 30);

      // Update crops
      crops = crops
        .map(crop => ({ ...crop, y: crop.y + 4 }))
        .filter(crop => crop.y < canvas.height);

      // Check collision
      crops.forEach(crop => {
        if (!crop.collected && Math.abs(crop.x - tractorX) < 40 && crop.y > canvas.height - 100) {
          crop.collected = true;
          setScore(s => s + 5);
          confetti({ particleCount: 20, spread: 30, origin: { x: crop.x / canvas.width, y: 0.7 } });
        }
      });

      // Draw crops
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      crops.forEach(crop => {
        if (!crop.collected) {
          ctx.fillText("🌾", crop.x, crop.y);
        }
      });

      gameFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(spawnInterval);
      cancelAnimationFrame(gameFrameId);
    };
  }, [gameState, gameActive]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="mb-6 font-heading text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-2">
          🚜 Tractor Harvest Game
        </h2>

        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">🚜</div>
                  <h3 className="font-heading text-2xl font-bold text-secondary mb-3">Drive & Harvest!</h3>
                  <p className="text-muted-foreground mb-6">
                    अपने ट्रैक्टर को चलाओ! / Drive your tractor!<br/>
                    Use arrow keys (left/right) to move and collect crops. 30 seconds to get as many as you can!
                  </p>
                  <div className="text-left bg-white p-4 rounded-lg space-y-2 text-sm mb-6">
                    <p><strong>⭐ Get 40 points or more to win!</strong></p>
                    <p>⬅️ ➡️ Use arrow keys to move tractor</p>
                    <p>🌾 Auto-collect when you touch crops</p>
                    <p>⏱️ 30 seconds to harvest</p>
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
                <div className={`text-lg font-bold ${gameTime > 10 ? "text-green-600" : gameTime > 5 ? "text-orange-600" : "text-red-600"}`}>
                  ⏱️ {gameTime}s
                </div>
              </div>

              <Card className="border-2 border-green-300 shadow-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full bg-gradient-to-b from-green-100 to-yellow-50"
                />
              </Card>

              <div className="text-center text-sm text-muted-foreground font-medium">
                Move with arrow keys ⬅️ ➡️
              </div>
            </motion.div>
          )}

          {gameState === "gameOver" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                {score >= 40 ? (
                  <Trophy className="h-24 w-24 text-yellow-500 animate-bounce" />
                ) : (
                  <div className="text-6xl">🚜</div>
                )}
              </div>

              <div>
                <h3 className="font-heading text-3xl font-bold text-secondary mb-2">
                  {score >= 40 ? "🎉 Excellent Harvest!" : "Good Effort!"}
                </h3>
                <p className="text-5xl font-bold text-primary">{score}</p>
                <p className="text-muted-foreground">Crops Harvested</p>
              </div>

              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-6 text-left space-y-2">
                  <p className="font-bold text-secondary">💡 Farmer's Lesson:</p>
                  <p className="text-sm text-muted-foreground">
                    सही समय पर कटाई महत्वपूर्ण है! / Timely harvesting is crucial! This game teaches you the importance of quick, efficient harvesting to minimize crop loss and maximize productivity.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-3 flex-col lg:flex-row">
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
