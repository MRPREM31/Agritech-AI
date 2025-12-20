import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useCoins } from "@/hooks/use-coins";

export default function Game() {
  const [, params] = useRoute("/game/:id");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { addCoins } = useCoins();
  const [isAnswered, setIsAnswered] = useState(false);
  const coinsAddedRef = useRef(false);

  // Mock questions
  const questions = [
    {
      q: "Which of these is a symptom of Wheat Rust?",
      options: ["Yellow powder on leaves", "Purple stem", "White roots", "Black seeds"],
      correct: 0,
    },
    {
      q: "What is the best time to irrigate crops in summer?",
      options: ["Noon (12 PM)", "Early Morning / Evening", "Midnight", "Anytime"],
      correct: 1,
    },
    {
      q: "Urea provides which nutrient to the soil?",
      options: ["Potassium", "Phosphorus", "Nitrogen", "Zinc"],
      correct: 2,
    },
  ];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#16a34a', '#facc15']
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    coinsAddedRef.current = false;
  };

  // Add coins automatically when game ends
  useEffect(() => {
    if (showResult && !coinsAddedRef.current && score > 0) {
      coinsAddedRef.current = true;
      const coinsEarned = score * 10;
      console.log('Quiz Game Won - Awarding', coinsEarned, 'coins for score:', score);
      addCoins(coinsEarned);
    }
  }, [showResult, score, addCoins]);

  if (showResult) {
    return (
      <Layout>
        <div className="flex h-[80vh] flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 rounded-full bg-accent/20 p-8 text-accent-foreground"
          >
            <Trophy className="h-16 w-16" />
          </motion.div>
          
          <h2 className="mb-2 font-heading text-3xl font-bold text-secondary">Great Job!</h2>
          <p className="mb-2 text-muted-foreground">You scored {score} out of {questions.length}</p>
          <p className="mb-8 text-lg font-bold text-primary">+{score * 10} Coins Earned! 🎉</p>
          
          <div className="w-full max-w-xs space-y-3">
            <Button onClick={() => resetGame()} size="lg" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
            <Link href="/learn">
              <Button variant="outline" size="lg" className="w-full">
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-muted-foreground">Question {currentQuestion + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-primary">{score * 10} Pts</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div 
            className="h-full bg-primary" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
        >
          <Card className="mb-6 border-2 border-secondary/10 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-bold leading-relaxed text-secondary">
                {question.q}
              </h3>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let variant = "outline";
              let icon = null;
              
              if (isAnswered) {
                if (idx === question.correct) {
                  variant = "default"; // Green/Primary
                  icon = <CheckCircle className="ml-auto h-5 w-5 text-white" />;
                } else if (idx === selectedAnswer) {
                  variant = "destructive"; // Red
                  icon = <XCircle className="ml-auto h-5 w-5 text-white" />;
                }
              }

              return (
                <Button
                  key={idx}
                  variant={variant as any}
                  className={`w-full justify-start h-auto py-4 px-5 text-left text-base font-medium transition-all ${
                    isAnswered && idx !== question.correct && idx !== selectedAnswer ? "opacity-50" : ""
                  } ${
                    isAnswered && idx === question.correct ? "bg-green-600 hover:bg-green-700 border-green-600 text-white" : ""
                  }`}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                >
                  <span className="mr-2 opacity-70">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                  {icon}
                </Button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8"
            >
              <Button size="lg" className="w-full font-bold" onClick={nextQuestion}>
                Next Question <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
