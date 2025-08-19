'use client';

import { CMSidebar } from '@/components/cms/CMSidebar';
import { CMSToolbar } from '@/components/cms/CMSToolbar';
import { CMSCanvas } from '@/components/cms/CMSCanvas';
import { CMSPanel } from '@/components/cms/CMSPanel';

export default function ComponentTestPage() {
  return (
    <div className="min-h-screen bg-yellow-100 p-4">
      <h1 className="text-2xl font-bold text-yellow-800 mb-4">TEST DE COMPONENTES INDIVIDUALES</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Test del Sidebar */}
        <div className="border-2 border-blue-500 p-2">
          <h2 className="text-lg font-bold text-blue-800 mb-2">1. SIDEBAR:</h2>
          <div className="h-64">
            <CMSidebar 
              activeTab="content"
              onTabChange={() => {}}
              onBlockSelect={() => {}}
            />
          </div>
        </div>

        {/* Test del Toolbar */}
        <div className="border-2 border-green-500 p-2">
          <h2 className="text-lg font-bold text-green-800 mb-2">2. TOOLBAR:</h2>
          <CMSToolbar 
            activeTab="content"
            onSave={() => {}}
            onPreview={() => {}}
            onPublish={() => {}}
          />
        </div>

        {/* Test del Canvas */}
        <div className="border-2 border-purple-500 p-2">
          <h2 className="text-lg font-bold text-purple-800 mb-2">3. CANVAS:</h2>
          <div className="h-64">
            <CMSCanvas 
              selectedBlock={null}
              onBlockSelect={() => {}}
            />
          </div>
        </div>

        {/* Test del Panel */}
        <div className="border-2 border-red-500 p-2">
          <h2 className="text-lg font-bold text-red-800 mb-2">4. PANEL:</h2>
          <div className="h-64">
            <CMSPanel 
              blockId="test-block"
              onClose={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
