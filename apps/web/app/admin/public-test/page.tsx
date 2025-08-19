export default function PublicTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">
        🎯 TEST PÚBLICO - LAYOUT ADMIN
      </h1>
      
      <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded">
        <p className="text-yellow-800 text-lg">
          Esta página NO requiere autenticación y debería mostrar el layout de admin.
        </p>
        
        <p className="text-yellow-700 mt-2">
          Si ves esta página SIN header y footer públicos, el layout funciona.
        </p>
      </div>
      
      <div className="mt-4 bg-purple-100 border-2 border-purple-500 p-4 rounded">
        <h2 className="text-xl font-bold text-purple-800 mb-2">✅ LO QUE DEBERÍAS VER:</h2>
        <ul className="text-purple-700 list-disc list-inside">
          <li>Fondo gris claro (layout admin)</li>
          <li>NO hay header de navegación</li>
          <li>NO hay footer</li>
          <li>Solo este contenido centrado</li>
        </ul>
      </div>
    </div>
  );
}
