# 🚀 QA Services - Plataforma de Servicios QA

> **Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss") - GitHub Actions configurado ✅

## 📋 Descripción del Proyecto

QA Services es una plataforma moderna y escalable para la gestión de servicios de calidad y testing, construida con tecnologías de vanguardia.

## 🚀 Despliegue Rápido

### Opción 1: Vercel (Recomendado)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/qa-services)

### Opción 2: Despliegue Manual
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/qa-services.git
cd qa-services

# Instalar dependencias
npm install

# Configurar variables de entorno
cp config.env .env.local

# Ejecutar base de datos
npx prisma db push
npx prisma db seed

# Iniciar desarrollo
npm run dev
```

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: JWT personalizado
- **CMS**: Editor visual drag & drop con @dnd-kit
- **Monorepo**: Turborepo
- **Testing**: Jest, React Testing Library, Playwright
- **Deploy**: Vercel

## 📁 Estructura del Proyecto

```
qa-services/
├── apps/
│   └── web/                 # Aplicación principal Next.js
│       ├── app/            # App Router (Next.js 14)
│       ├── components/     # Componentes React
│       ├── lib/           # Utilidades y configuraciones
│       └── prisma/        # Esquemas de base de datos
├── packages/               # Paquetes compartidos
│   ├── ui/               # Componentes UI reutilizables
│   ├── cms-core/         # Lógica del CMS
│   └── config/           # Configuraciones compartidas
└── TAREAS/               # Documentación del proyecto
```

## 🔐 Variables de Entorno

```bash
# Base de Datos
DATABASE_URL="postgresql://usuario:password@host/database"
SHADOW_DATABASE_URL="postgresql://usuario:password@host/database"

# Autenticación
JWT_SECRET="tu-super-secret-jwt-key-cambiar-en-produccion"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=5000
CMS_PREVIEW_ENABLED=true

# Entorno
NODE_ENV=development
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo
npm run build           # Construir para producción
npm run start           # Iniciar en modo producción

# Base de Datos
npm run db:push         # Sincronizar esquema con DB
npm run db:seed         # Poblar base de datos
npm run db:generate     # Generar cliente Prisma

# Testing
npm run test            # Ejecutar tests unitarios
npm run test:e2e        # Ejecutar tests end-to-end
npm run test:playwright # Ejecutar tests con Playwright

# Linting y Formateo
npm run lint            # Verificar código
npm run format          # Formatear código
```

## 🌐 URLs de la Aplicación

- **Sitio Público**: `/` - Página principal
- **Login Admin**: `/admin/login` - Acceso administradores
- **Dashboard Admin**: `/admin` - Panel de administración
- **CMS Editor**: `/admin/cms` - Editor visual de contenido
- **Servicios**: `/servicios` - Lista de servicios
- **Contacto**: `/contacto` - Formulario de contacto

## 🔑 Acceso de Prueba

**Administrador:**
- Email: `admin@qaservices.com`
- Password: `admin123`

**Editor CMS:**
- Email: `editor@qaservices.com`
- Password: `editor123`

## 📊 Estado del Sistema

- ✅ **Autenticación**: JWT funcionando
- ✅ **Base de Datos**: PostgreSQL conectado
- ✅ **CMS**: Editor visual operativo
- ✅ **Admin Panel**: Acceso funcional
- 🚧 **Tests**: En desarrollo
- 🚧 **CI/CD**: Configurando

## 🚀 Próximos Pasos

1. **Completar tests** unitarios y E2E
2. **Implementar CMS** funcional completo
3. **Configurar CI/CD** con GitHub Actions
4. **Desplegar a producción** en Vercel
5. **Monitoreo y analytics**

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/qa-services/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/qa-services/wiki)
- **Email**: soporte@qaservices.com

---

**Desarrollado con ❤️ por el equipo de QA Services**
