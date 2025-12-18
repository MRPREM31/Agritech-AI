import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Diagnosis from "@/pages/diagnosis";
import Weather from "@/pages/weather";
import Learn from "@/pages/learn";
import Game from "@/pages/game";
import Read from "@/pages/read";
import WaterGame from "@/pages/water-game";
import TractorGame from "@/pages/tractor-game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/diagnosis" component={Diagnosis}/>
      <Route path="/weather" component={Weather}/>
      <Route path="/learn" component={Learn}/>
      <Route path="/game/:id" component={Game}/>
      <Route path="/read" component={Read}/>
      <Route path="/water-game" component={WaterGame}/>
      <Route path="/tractor-game" component={TractorGame}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
