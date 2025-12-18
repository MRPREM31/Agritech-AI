import { Link, useLocation } from "wouter";
import { Home, ScanLine, CloudSun, Gamepad2, Mic, Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const toggleVoice = () => {
    const newState = !isVoiceActive;
    setIsVoiceActive(newState);
    if (newState) {
      toast({
        title: "Voice Assistant Active",
        description: "Listening for commands in Hindi or English...",
      });
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ScanLine, label: "Diagnose", path: "/diagnosis" },
    { icon: CloudSun, label: "Weather", path: "/weather" },
    { icon: Gamepad2, label: "Learn", path: "/learn" },
    { icon: BookOpen, label: "Read", path: "/read" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6 font-sans relative">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 lg:px-8 py-3 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="EduFarma AI Logo"
            className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg shadow-sm object-cover"
          />
          <h1 className="font-heading text-lg lg:text-2xl font-bold text-secondary">EduFarma AI</h1>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button 
                  variant={isActive ? "default" : "outline"} 
                  className={`gap-2 ${isActive ? "bg-primary text-white" : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isVoiceActive ? "default" : "outline"}
            size="icon"
            className={`rounded-full transition-all ${isVoiceActive ? "animate-pulse bg-accent text-accent-foreground border-accent hover:bg-accent/90" : "border-primary/20 text-primary"}`}
            onClick={toggleVoice}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice Assistant</span>
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-secondary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h2 className="font-heading text-lg font-bold text-secondary mb-4">Menu</h2>
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start">Profile</Button>
                  <Button variant="ghost" className="justify-start">Language (Hindi/English)</Button>
                  <Button variant="ghost" className="justify-start">Saved Reports</Button>
                  <Button variant="ghost" className="justify-start">Settings</Button>
                  <Button variant="ghost" className="justify-start text-destructive">Log Out</Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Voice Overlay */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-30 flex justify-center px-4"
          >
            <div className="flex w-full max-w-md items-center justify-between rounded-full bg-accent px-4 py-2 text-accent-foreground shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-1 h-4 items-end">
                  <div className="w-1 bg-accent-foreground animate-[bounce_1s_infinite] h-2"></div>
                  <div className="w-1 bg-accent-foreground animate-[bounce_1.2s_infinite] h-4"></div>
                  <div className="w-1 bg-accent-foreground animate-[bounce_0.8s_infinite] h-3"></div>
                </div>
                <span className="text-sm font-bold">Listening...</span>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 hover:bg-black/10 rounded-full"
                onClick={() => setIsVoiceActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-6 animate-in fade-in duration-500 max-w-7xl">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-50 border-t border-border bg-white px-2 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex justify-around">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground hover:text-secondary"}`}>
                  <div className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${isActive ? "bg-primary/10" : "bg-transparent"}`}>
                    <item.icon className={`h-6 w-6 transition-all ${isActive ? "scale-110" : ""}`} />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
