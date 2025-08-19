import { ContactHero } from '@/components/sections/ContactHero';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactInfo } from '@/components/sections/ContactInfo';

export default function ContactoPage() {
  return (
    <div className="space-y-20">
      <ContactHero />
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
