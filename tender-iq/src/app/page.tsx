import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <div id="features">
          <LandingFeatures />
        </div>
        <div id="testimonials">
          <LandingTestimonials />
        </div>
        <div id="pricing">
          <LandingPricing />
        </div>
        <div id="faq">
          <LandingFAQ />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
