import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AIEngineSection from "@/components/AIEngineSection";
import CyberAILoopSection from "@/components/CyberAILoopSection";
import CyberAIAnalystSection from "@/components/CyberAIAnalystSection";
import ProductModulesSection from "@/components/ProductModulesSection";
import MetricsSection from "@/components/MetricsSection";
import ComparisonSection from "@/components/ComparisonSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navigation />
      <main>
        <HeroSection />
        <AIEngineSection />
        <CyberAILoopSection />
        <CyberAIAnalystSection />
        <ProductModulesSection />
        <MetricsSection />
        <ComparisonSection />
      </main>
      <Footer />
    </div>
  );
}
