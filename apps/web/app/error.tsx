'use client'

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900">500</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Error interno del servidor
        </h2>
        <p className="mt-2 text-gray-600">
          Algo salió mal. Por favor, inténtalo de nuevo.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
