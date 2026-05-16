import React from "react";
import Navbar from "./_components/landing/Navbar";
import HeroSection from "./_components/landing/HeroSection";
import FeaturesSection from "./_components/landing/FeaturesSection";
import HowItWorksSection from "./_components/landing/HowItWorksSection";
import TestimonialSection from "./_components/landing/TestimonialSection";
import CtaSection from "./_components/landing/CtaSection";
import Footer from "./_components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white selection:bg-green-200 selection:text-green-900 scroll-smooth">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
