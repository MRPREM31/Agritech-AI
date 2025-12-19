import { Link, useLocation } from "wouter";
import {
  Home,
  ScanLine,
  CloudSun,
  Gamepad2,
  Menu,
  X,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ScanLine, label: "Diagnose", path: "/diagnosis" },
    { icon: CloudSun, label: "Weather", path: "/weather" },
    { icon: Gamepad2, label: "Games", path: "/learn" },
    { icon: BookOpen, label: "Read", path: "/read" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6 font-sans relative">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 lg:px-8 py-3 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="EduFarma AI Logo"
            className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg shadow-sm object-cover"
          />
          <h1 className="font-heading text-lg lg:text-2xl font-bold text-secondary">
            EduFarma AI
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  className={`gap-2 ${
                    isActive ? "bg-primary text-white" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-secondary"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex flex-col">
            {/* Back Button */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-heading text-lg font-bold text-secondary">
                Menu
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="justify-start gap-3"
                  onClick={() => {
                    setLocation(item.path);
                    setOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Footer */}
            <div className="pt-4 border-t text-center text-xs text-muted-foreground">
              Made by <span className="font-semibold">Team QuantumCoder</span>{" "}
              from <span className="font-semibold">NIST</span>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-50 border-t border-border bg-white px-2 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex justify-around">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all cursor-pointer ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-secondary"
                  }`}
                >
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full ${
                      isActive ? "bg-primary/10" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 ${
                        isActive ? "scale-110" : ""
                      }`}
                    />
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
