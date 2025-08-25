import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Página no encontrada | QA Services',
  description: 'La página que buscas no existe.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Página no encontrada
        </h2>
        <p className="mt-2 text-gray-600">
          La página que buscas no existe o ha sido movida.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
