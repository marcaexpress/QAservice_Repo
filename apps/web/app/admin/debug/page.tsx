'use client';

import { CMSLayout } from '@/components/cms/CMSLayout';

export default function DebugCMSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
        <h1 className="text-xl font-bold text-blue-800">DEBUG CMS</h1>
        <p className="text-blue-700">Esta página debería mostrar el CMS completo abajo</p>
        <p className="text-blue-600">Si ves solo este mensaje azul, el CMS no se está renderizando</p>
      </div>
      
      <div className="border-2 border-red-500 p-2">
        <p className="text-red-600 font-bold">ÁREA DEL CMS (debería estar llena de componentes):</p>
        <CMSLayout />
      </div>
    </div>
  );
}
