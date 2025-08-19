export function ContactInfo() {
  const contactMethods = [
    {
      title: 'Información de Contacto',
      items: [
        { label: 'Email', value: 'info@qaservices.com', icon: '📧' },
        { label: 'Teléfono', value: '+1 (555) 123-4567', icon: '📞' },
        { label: 'WhatsApp', value: '+1 (555) 123-4567', icon: '💬' },
        { label: 'Horario', value: 'Lun-Vie: 9:00 AM - 6:00 PM PST', icon: '🕒' }
      ]
    },
    {
      title: 'Oficina Principal',
      items: [
        { label: 'Dirección', value: '123 Tech Street, San Francisco, CA 94105', icon: '📍' },
        { label: 'Ciudad', value: 'San Francisco, California', icon: '🏙️' },
        { label: 'País', value: 'Estados Unidos', icon: '🇺🇸' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: '#', icon: '🔗' },
    { name: 'Twitter', url: '#', icon: '🐦' },
    { name: 'GitHub', url: '#', icon: '💻' },
    { name: 'YouTube', url: '#', icon: '📺' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Información de Contacto
        </h3>
        
        {contactMethods.map((method, methodIndex) => (
          <div key={methodIndex} className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {method.title}
            </h4>
            <div className="space-y-3">
              {method.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Síguenos en Redes Sociales
        </h4>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <span className="text-xl">{social.icon}</span>
              <span className="text-sm font-medium">{social.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          ¿Por qué elegir QA Services?
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Equipo de expertos certificados en testing</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Metodologías probadas y mejores prácticas</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Soporte técnico especializado 24/7</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Resultados medibles y reportes detallados</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Flexibilidad para adaptarnos a tus necesidades</span>
          </li>
        </ul>
      </div>

      <div className="bg-primary-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-primary-900 mb-2">
          Respuesta Rápida
        </h4>
        <p className="text-primary-700 text-sm">
          Nos comprometemos a responder a todas las consultas en menos de 24 horas 
          durante días laborables. Para consultas urgentes, contáctanos por teléfono.
        </p>
      </div>
    </div>
  );
}
