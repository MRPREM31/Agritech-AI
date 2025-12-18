import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { RotateCcw, Trophy } from "lucide-react";

export default function TractorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tractorXRef = useRef(300);

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const TRACTOR_SPEED = 18;
  const CROP_SPEED = 2;

  const startGame = () => {
    setScore(0);
    setGameTime(30);
    setGameActive(true);
    setGameState("playing");
  };

  /* ---------------- TIMER ---------------- */
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

  /* ---------------- GAME OVER ---------------- */
  useEffect(() => {
    if (gameTime === 0 && gameState === "playing") {
      setGameState("gameOver");
      if (score >= 40) {
        confetti({ particleCount: 200, spread: 120 });
      }
    }
  }, [gameTime, gameState, score]);

  /* ---------------- MOVEMENT ---------------- */
  const moveLeft = () => {
    if (!canvasRef.current) return;
    tractorXRef.current = Math.max(30, tractorXRef.current - TRACTOR_SPEED);
  };

  const moveRight = () => {
    if (!canvasRef.current) return;
    tractorXRef.current = Math.min(
      canvasRef.current.width - 30,
      tractorXRef.current + TRACTOR_SPEED
    );
  };

  /* ---------------- GAME LOOP ---------------- */
  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    tractorXRef.current = canvas.width / 2;

    let crops: Array<{ x: number; y: number; collected: boolean }> = [];
    let animationId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault(); // 🚫 stop navbar / cursor movement
    }

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
};

    window.addEventListener("keydown", handleKeyDown);

    const spawnInterval = setInterval(() => {
      if (gameActive && crops.length < 4 && Math.random() > 0.5) {
        crops.push({
          x: 40 + Math.random() * (canvas.width - 80),
          y: -30,
          collected: false,
        });
      }
    }, 800);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#dcfce7");
      bg.addColorStop(1, "#fef9c3");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* Road */
      ctx.fillStyle = "#9ca3af";
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

      ctx.strokeStyle = "#fde047";
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      /* Tractor */
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🚜", tractorXRef.current, canvas.height - 30);

      /* Update crops */
      crops = crops
        .map(crop => ({ ...crop, y: crop.y + CROP_SPEED }))
        .filter(crop => crop.y < canvas.height);

      /* Collision */
      crops.forEach(crop => {
        if (
          !crop.collected &&
          Math.abs(crop.x - tractorXRef.current) < 40 &&
          crop.y > canvas.height - 110
        ) {
          crop.collected = true;
          setScore(s => s + 5);
          confetti({
            particleCount: 20,
            spread: 40,
            origin: { x: crop.x / canvas.width, y: 0.7 },
          });
        }
      });

      /* Draw crops */
      ctx.font = "32px Arial";
      crops.forEach(crop => {
        if (!crop.collected) {
          ctx.fillText("🌾", crop.x, crop.y);
        }
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationId);
    };
  }, [gameState, gameActive]);

  /* ---------------- UI ---------------- */
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-secondary">🚜 Tractor Harvest Game</h2>

        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-6xl">🚜</div>
                  <p>
                    Drive your tractor and collect crops! <br />
                    ⬅️ ➡️ keys or mobile buttons
                  </p>
                  <p className="font-bold">Score 40+ to win 🎯</p>
                </CardContent>
              </Card>
              <Button className="w-full mt-4" size="lg" onClick={startGame}>
                Start Game
              </Button>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between font-bold">
                <span>Score: {score}</span>
                <span>⏱️ {gameTime}s</span>
              </div>

              <Card className="border-2 border-green-300">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  tabIndex={0}   // 👈 VERY IMPORTANT
                  className="w-full outline-none"
                />
              </Card>

              {/* Mobile Controls */}
              <div className="flex justify-center gap-6 lg:hidden">
                <Button size="lg" className="w-24" onClick={moveLeft} onTouchStart={moveLeft}>
                  ⬅️
                </Button>
                <Button size="lg" className="w-24" onClick={moveRight} onTouchStart={moveRight}>
                  ➡️
                </Button>
              </div>
            </motion.div>
          )}

          {gameState === "gameOver" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-4">
              {score >= 40 ? (
                <Trophy className="mx-auto h-20 w-20 text-yellow-500" />
              ) : (
                <div className="text-6xl">🚜</div>
              )}
              <h3 className="text-3xl font-bold">{score >= 40 ? "Excellent Harvest!" : "Good Try!"}</h3>
              <p className="text-5xl font-bold">{score}</p>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={startGame}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Play Again
                </Button>
                <Link href="/learn">
                  <Button variant="outline" className="flex-1">
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
