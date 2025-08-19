import { LearningHero } from '@/components/sections/LearningHero';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { ResourcesSection } from '@/components/sections/ResourcesSection';

export default function AprendizajePage() {
  return (
    <div className="space-y-20">
      <LearningHero />
      <CoursesSection />
      <ResourcesSection />
    </div>
  );
}
