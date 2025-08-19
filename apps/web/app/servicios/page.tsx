import { ServicesHero } from '@/components/sections/ServicesHero';
import { ServicesList } from '@/components/sections/ServicesList';
import { PricingSection } from '@/components/sections/PricingSection';

export default function ServiciosPage() {
  return (
    <div className="space-y-20">
      <ServicesHero />
      <ServicesList />
      <PricingSection />
    </div>
  );
}
