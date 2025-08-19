import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
