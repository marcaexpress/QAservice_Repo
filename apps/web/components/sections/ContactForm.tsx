'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envío
    setTimeout(() => {
      setIsLoading(false);
      console.log('Contact form submitted:', formData);
      alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Envíanos un Mensaje
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Servicio de Interés
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Selecciona un servicio</option>
            <option value="manual">Testing Manual</option>
            <option value="automatizado">Testing Automatizado</option>
            <option value="performance">Testing de Performance</option>
            <option value="seguridad">Testing de Seguridad</option>
            <option value="consultoria">Consultoría QA</option>
            <option value="cursos">Cursos y Capacitación</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="input-field resize-none"
            placeholder="Cuéntanos sobre tu proyecto y cómo podemos ayudarte..."
          />
        </div>

        <div className="flex items-center">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="privacy" className="ml-2 block text-sm text-gray-900">
            Acepto la{' '}
            <a href="/privacidad" className="text-primary-600 hover:text-primary-500">
              política de privacidad
            </a>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Enviar Mensaje
        </Button>
      </form>
    </div>
  );
}
