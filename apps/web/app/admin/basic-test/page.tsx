'use client';

import { useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';

export default function BasicTestPage() {
  const [showCMS, setShowCMS] = useState(false);

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-4">TEST BÁSICO DEL CMS</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setShowCMS(!showCMS)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCMS ? 'Ocultar CMS' : 'Mostrar CMS'}
        </button>
      </div>

      {showCMS && (
        <div className="border-4 border-red-500 p-4 bg-white">
          <h2 className="text-xl font-bold text-red-800 mb-2">CMS ACTIVADO:</h2>
          <p className="text-red-700 mb-4">Si ves esto, el CMS debería aparecer abajo:</p>
          
          <div className="bg-gray-200 p-4 rounded">
            <p className="text-gray-800">ÁREA DEL CMS:</p>
            <CMSLayout />
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-200 rounded">
        <h3 className="text-lg font-bold text-blue-800">INSTRUCCIONES:</h3>
        <ol className="text-blue-700 list-decimal list-inside">
          <li>Haz clic en "Mostrar CMS"</li>
          <li>Deberías ver un área roja con el CMS</li>
          <li>Si solo ves texto, hay un problema</li>
        </ol>
      </div>
    </div>
  );
}
