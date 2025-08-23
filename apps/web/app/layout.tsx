import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QA Services - Consultoría en Testing de Software',
  description: 'Plataforma integral de servicios de QA testing y hub de conocimientos para profesionales',
  keywords: 'QA testing, software testing, consultoría, aprendizaje, CMS',
};

const stylesHref = process.env.NEXT_PUBLIC_STYLES_CDN || '/_tw.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* CSS del Design System desde CDN (aislado) o fallback local */}
        <link rel="stylesheet" href={stylesHref} />
      </head>
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
