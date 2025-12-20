import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Star, BookOpen, ChevronRight, Sprout, CloudRain, Droplets, Tractor } from "lucide-react";
import { Link } from "wouter";
import { useCoins } from "@/hooks/use-coins";

export default function Learn() {
  const { coins } = useCoins();
  const games = [
    {
      id: "disease",
      title: "Crop Doctor",
      desc: "Identify diseases correctly",
      icon: Sprout,
      color: "text-green-600",
      bg: "bg-green-100",
      progress: 60,
      link: "/game/daily"
    },
    {
      id: "soil",
      title: "Soil Master",
      desc: "Fertilizer & soil knowledge",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-100",
      progress: 30,
      link: "/game/daily"
    },
    {
      id: "weather",
      title: "Weather Wise",
      desc: "Predict & prepare",
      icon: CloudRain,
      color: "text-blue-600",
      bg: "bg-blue-100",
      progress: 0,
      link: "/game/daily"
    },
    {
      id: "water",
      title: "Water Collection",
      desc: "Water management game",
      icon: Droplets,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      progress: 0,
      link: "/water-game"
    },
    {
      id: "harvest",
      title: "Tractor Harvest",
      desc: "Harvesting simulator",
      icon: Tractor,
      color: "text-green-700",
      bg: "bg-lime-100",
      progress: 0,
      link: "/tractor-game"
    },
  ];

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl lg:text-3xl font-bold text-secondary">Learn & Play</h2>
        <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground shadow-sm">
          <Star className="h-4 w-4 fill-current" />
          <span>{coins} Pts</span>
        </div>
      </div>

      {/* Daily Challenge */}
      <Card className="mb-8 overflow-hidden border-none bg-secondary text-white shadow-md">
        <CardContent className="p-6 lg:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">Daily Challenge</h3>
            <p className="text-white/80 text-sm mb-4">Quiz: Best time to water wheat?</p>
            <Link href="/game/daily">
              <Button size="sm" variant="secondary" className="bg-white text-secondary hover:bg-white/90">
                Play Now
              </Button>
            </Link>
          </div>
          <Trophy className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
        </CardContent>
      </Card>

      {/* Game Modules */}
      <h3 className="mb-4 font-heading text-lg lg:text-xl font-bold text-secondary">Training Modules & Games</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {games.map((game) => (
          <Link key={game.id} href={game.link}>
            <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
              <CardContent className="flex flex-col p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${game.bg} ${game.color} transition-transform group-hover:scale-105`}>
                    <game.icon className="h-7 w-7" />
                  </div>
                  {game.progress > 0 && (
                    <span className="text-xs font-medium text-muted-foreground">{game.progress}%</span>
                  )}
                </div>
                <h4 className="font-bold text-secondary mb-1">{game.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 flex-1">{game.desc}</p>
                {game.progress > 0 && (
                  <Progress value={game.progress} className="h-1.5" />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
