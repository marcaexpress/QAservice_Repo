import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // ⬅️ Import obligatorio
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QA Services - Consultoría en Testing de Software',
  description: 'Plataforma integral de servicios de QA testing y hub de conocimientos para profesionales',
  keywords: 'QA testing, software testing, consultoría, aprendizaje, CMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* 🚨 CSS CRÍTICO EXTERNO - GARANTIZA ESTILOS */}
        <link rel="stylesheet" href="/critical-styles.css" />
        
        {/* Tailwind se importa automáticamente desde globals.css */}
      </head>
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
