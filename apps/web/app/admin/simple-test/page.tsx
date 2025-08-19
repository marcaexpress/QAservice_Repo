'use client';

import { CMSLayout } from '@/components/cms/CMSLayout';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-red-100">
      <h1 className="text-2xl font-bold text-red-800 p-4">TEST SIMPLE DEL CMS</h1>
      <p className="text-red-700 px-4">Si ves esto, el CMS debería aparecer abajo:</p>
      
      <div className="mt-4">
        <CMSLayout />
      </div>
    </div>
  );
}
