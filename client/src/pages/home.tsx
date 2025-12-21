import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ScanLine,
  CloudSun,
  Gamepad2,
  ArrowRight,
  Sun,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/indian_farmer_with_smartphone_in_field.png";

export default function Home() {
  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-secondary shadow-lg lg:rounded-3xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Indian farmer using smartphone in field"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[65vh] lg:min-h-[80vh] flex-col justify-end p-6 lg:p-14 text-white">
          <h2 className="mb-3 font-heading text-2xl lg:text-4xl font-bold leading-tight">
            Namaste, Kisan Bhaiya! 🌾
          </h2>
          <p className="mb-6 max-w-xl text-sm lg:text-lg text-white/90">
            Smart farming made easy — diagnose crops, get weather alerts, and
            learn through games.
          </p>

          <Link href="/diagnosis">
            <Button
              size="lg"
              className="w-full sm:w-fit bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md"
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Check Crop Health
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= QUICK INFO CARDS ================= */}
      <div className="mb-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/weather">
          <Card className="cursor-pointer border-none bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
              <Sun className="h-8 w-8 text-orange-400 mb-2" />
              <span className="text-2xl font-bold text-secondary">28°C</span>
              <span className="text-xs text-muted-foreground">Sunny Today</span>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-none bg-gradient-to-br from-red-50 to-white shadow-sm">
          <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <span className="text-sm font-bold text-secondary">High Heat</span>
            <span className="text-xs text-muted-foreground">Alert</span>
          </CardContent>
        </Card>

        <Link href="/learn">
          <Card className="cursor-pointer border-none bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
              <Gamepad2 className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-bold text-secondary">Learn</span>
              <span className="text-xs text-muted-foreground">Play Games</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ================= SERVICES ================= */}
      <h3 className="mb-4 font-heading text-lg lg:text-xl font-bold text-secondary">
        Services
      </h3>

      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        {/* Diagnosis */}
        <Link href="/diagnosis">
          <Card className="group h-full cursor-pointer border-l-4 border-l-primary shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full items-center p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition">
                <ScanLine className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-secondary">Crop Diagnosis</h4>
                <p className="text-sm text-muted-foreground">
                  Identify crop diseases by photo
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        {/* Weather */}
        <Link href="/weather">
          <Card className="group h-full cursor-pointer border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full items-center p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition">
                <CloudSun className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-secondary">Weather Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Smart planning for farming
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        {/* Learn & Play */}
        <Link href="/learn">
          <Card className="group h-full cursor-pointer border-l-4 border-l-accent shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full items-center p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-yellow-700 group-hover:scale-110 transition">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-secondary">Learn & Play</h4>
                <p className="text-sm text-muted-foreground">
                  Farming quizzes & games
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        {/* Read */}
        <Link href="/read">
          <Card className="group h-full cursor-pointer border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition">
            <CardContent className="flex h-full items-center p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 group-hover:scale-110 transition">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-secondary">Read & Learn</h4>
                <p className="text-sm text-muted-foreground">
                  Farming education & guides
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </Layout>
  );
}
