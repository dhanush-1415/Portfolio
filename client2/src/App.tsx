import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import ParticlesBackground from "@/components/ParticlesBackground";

function App() {
  return (
    <>
      {/* Full page particle background */}
      <ParticlesBackground />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
