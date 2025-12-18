import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, CloudSun, Gamepad2, ArrowRight, Sun, AlertTriangle, BookOpen, Leaf } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/indian_farmer_with_smartphone_in_field.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-secondary shadow-lg lg:rounded-3xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Farmer in field" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent" />
        </div>
        
        <div className="relative z-10 p-6 lg:p-12 pt-24 lg:pt-32 text-white">
          <h2 className="mb-2 font-heading text-2xl lg:text-4xl font-bold leading-tight">
            Namaste, Farmer Bhai!
          </h2>
          <p className="mb-4 text-sm lg:text-base font-medium text-white/90">
            Keep your crops healthy and your harvest plentiful.
          </p>
          <Link href="/diagnosis">
            <Button size="lg" className="w-full lg:w-auto bg-accent text-accent-foreground hover:bg-accent/90 border-0 font-semibold shadow-md">
              <ScanLine className="mr-2 h-5 w-5" />
              Check Crop Health
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats / Weather Teaser */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/weather">
          <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 lg:p-6 flex flex-col items-center justify-center text-center h-full">
              <Sun className="h-8 w-8 text-orange-400 mb-2" />
              <span className="text-2xl font-bold text-secondary">28°C</span>
              <span className="text-xs text-muted-foreground">Sunny Today</span>
            </CardContent>
          </Card>
        </Link>

        <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-4 lg:p-6 flex flex-col items-center justify-center text-center h-full">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <span className="text-sm font-bold text-secondary">High Heat</span>
            <span className="text-xs text-muted-foreground">Alert</span>
          </CardContent>
        </Card>

        <Link href="/learn">
          <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 lg:p-6 flex flex-col items-center justify-center text-center h-full">
              <Gamepad2 className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-bold text-secondary">Learn</span>
              <span className="text-xs text-muted-foreground">Play Games</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Features Grid */}
      <h3 className="mb-4 font-heading text-lg lg:text-xl font-bold text-secondary">Services</h3>
      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <Link href="/diagnosis">
          <Card className="group overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex items-center p-4 lg:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                <ScanLine className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-heading font-semibold text-secondary">Crop Diagnosis</h4>
                <p className="text-xs lg:text-sm text-muted-foreground">Identify diseases by photo</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/weather">
          <Card className="group overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex items-center p-4 lg:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                <CloudSun className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-heading font-semibold text-secondary">Weather Alerts</h4>
                <p className="text-xs lg:text-sm text-muted-foreground">Plan your farming</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/learn">
          <Card className="group overflow-hidden border-l-4 border-l-accent shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex items-center p-4 lg:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-yellow-700 group-hover:scale-110 transition-transform shrink-0">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-heading font-semibold text-secondary">Learn & Play</h4>
                <p className="text-xs lg:text-sm text-muted-foreground">Quizzes & games</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/read">
          <Card className="group overflow-hidden border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex items-center p-4 lg:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 group-hover:scale-110 transition-transform shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-heading font-semibold text-secondary">Read & Learn</h4>
                <p className="text-xs lg:text-sm text-muted-foreground">Educational courses</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </Layout>
  );
}
