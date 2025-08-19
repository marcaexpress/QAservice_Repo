import { CMSLayout } from '@/components/cms/CMSLayout';

export default function TestCMSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h1 className="text-xl font-bold text-red-800">TEST CMS - Esta página debería mostrar el CMS completo</h1>
        <p className="text-red-700">Si ves esto, el CMS no se está renderizando correctamente</p>
      </div>
      
      <CMSLayout />
    </div>
  );
}
