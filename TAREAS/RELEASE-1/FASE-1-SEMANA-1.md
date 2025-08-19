# Fase 1 (Semana 1): Fundaciones Locales y CI/CD

## Objetivos
- Monorepo listo (Turborepo)
- Next.js 14 con App Router
- Prisma y estructura de paquetes
- Conexión a Neon dev branch
- CI básico (lint, typecheck, unit tests, build)

## Tareas Detalladas

### 1. Configurar Monorepo con Turborepo
**Responsable**: Desarrollador Full-Stack
**Tiempo estimado**: 4 horas
**Prioridad**: Crítica

#### Subtareas:
- [ ] Inicializar proyecto con `npx create-turbo@latest qa-services`
- [ ] Configurar estructura de directorios:
  ```
  qa-services/
  ├─ apps/
  │  └─ web/                # Next.js app
  ├─ packages/
  │  ├─ ui/                 # Design system
  │  ├─ cms-core/           # CMS core logic
  │  ├─ api/                # API client/SDK
  │  └─ config/             # Shared config
  ├─ prisma/
  └─ tools/
  ```
- [ ] Configurar `turbo.json` con pipelines:
  ```json
  {
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": [".next/**", "!.next/cache/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "lint": {},
      "test": {
        "dependsOn": ["build"],
        "outputs": ["coverage/**"]
      }
    }
  }
  ```

#### Criterios de aceptación:
- [ ] `npm run build` funciona en todos los paquetes
- [ ] `npm run dev` inicia el monorepo
- [ ] Estructura de directorios correcta

---

### 2. Configurar Next.js 14 con App Router
**Responsable**: Desarrollador Frontend
**Tiempo estimado**: 6 horas
**Prioridad**: Crítica

#### Subtareas:
- [ ] Crear app Next.js en `apps/web/`
- [ ] Configurar App Router con estructura:
  ```
  app/
  ├─ (public)/              # Rutas públicas
  │  ├─ page.tsx            # Home
  │  ├─ servicios/
  │  ├─ blog/
  │  └─ contacto/
  ├─ (admin)/               # Rutas de admin
  │  ├─ dashboard/
  │  ├─ pages/
  │  ├─ users/
  │  └─ settings/
  ├─ api/                   # API routes
  ├─ globals.css
  ├─ layout.tsx
  └─ page.tsx
  ```
- [ ] Configurar Tailwind CSS
- [ ] Instalar y configurar shadcn/ui
- [ ] Crear layout base con Header, Footer, Sidebar

#### Criterios de aceptación:
- [ ] App se ejecuta en localhost:3000
- [ ] Tailwind CSS funcionando
- [ ] shadcn/ui instalado y configurado
- [ ] Layout base renderiza correctamente

---

### 3. Configurar ESLint, Prettier y TypeScript
**Responsable**: Desarrollador Full-Stack
**Tiempo estimado**: 3 horas
**Prioridad**: Alta

#### Subtareas:
- [ ] Instalar dependencias:
  ```bash
  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  npm install -D husky lint-staged
  ```
- [ ] Configurar `.eslintrc.js` con reglas estrictas
- [ ] Configurar `.prettierrc` con formato consistente
- [ ] Configurar `tsconfig.json` compartido
- [ ] Configurar Husky con pre-commit hooks

#### Criterios de aceptación:
- [ ] `npm run lint` sin errores
- [ ] `npm run format` formatea código
- [ ] Pre-commit hooks funcionando
- [ ] TypeScript configurado correctamente

---

### 4. Configurar Paquetes Compartidos
**Responsable**: Desarrollador Full-Stack
**Tiempo estimado**: 4 horas
**Prioridad**: Alta

#### Subtareas:
- [ ] Configurar `packages/ui/`:
  - Instalar shadcn/ui
  - Crear componentes base (Button, Input, Card, etc.)
  - Configurar Storybook
- [ ] Configurar `packages/config/`:
  - Crear schemas Zod para variables de entorno
  - Configurar validación de config
- [ ] Configurar `packages/cms-core/`:
  - Definir tipos base para CMS
  - Crear interfaces para bloques
- [ ] Configurar `packages/api/`:
  - Definir tipos para API client
  - Crear SDK base

#### Criterios de aceptación:
- [ ] Paquetes se construyen correctamente
- [ ] Componentes UI renderizan en Storybook
- [ ] Configuración se valida correctamente
- [ ] Tipos se comparten entre paquetes

---

### 5. Configurar Prisma y Base de Datos
**Responsable**: Desarrollador Backend
**Tiempo estimado**: 5 horas
**Prioridad**: Crítica

#### Subtareas:
- [ ] Instalar Prisma:
  ```bash
  npm install prisma @prisma/client
  npm install -D prisma
  ```
- [ ] Crear proyecto Neon y branch dev
- [ ] Configurar `prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }

  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model Page {
    id          String      @id @default(cuid())
    slug        String      @unique
    title       String
    status      PageStatus  @default(DRAFT)
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }

  enum PageStatus {
    DRAFT
    REVIEW
    PUBLISHED
    ARCHIVED
  }
  ```
- [ ] Configurar `.env` con DATABASE_URL
- [ ] Ejecutar `prisma generate` y `prisma db push`

#### Criterios de aceptación:
- [ ] Prisma se conecta a Neon dev
- [ ] Schema se sincroniza correctamente
- [ ] Prisma Client se genera
- [ ] Variables de entorno configuradas

---

### 6. Crear Seeds y Datos de Prueba
**Responsable**: Desarrollador Backend
**Tiempo estimado**: 3 horas
**Prioridad**: Media

#### Subtareas:
- [ ] Crear `prisma/seed.ts`:
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  async function main() {
    // Crear usuario admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@qaservices.com' },
      update: {},
      create: {
        email: 'admin@qaservices.com',
        name: 'Admin User',
      },
    })

    // Crear páginas de ejemplo
    const homePage = await prisma.page.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        slug: 'home',
        title: 'Inicio',
        status: 'PUBLISHED',
      },
    })

    console.log({ admin, homePage })
  }

  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  ```
- [ ] Configurar script en `package.json`:
  ```json
  {
    "scripts": {
      "db:seed": "tsx prisma/seed.ts"
    }
  }
  ```
- [ ] Ejecutar seed y verificar datos

#### Criterios de aceptación:
- [ ] Seed se ejecuta sin errores
- [ ] Datos de prueba se crean correctamente
- [ ] Script de seed funciona desde npm

---

### 7. Configurar CI Inicial (GitHub Actions)
**Responsable**: DevOps/Desarrollador
**Tiempo estimado**: 4 horas
**Prioridad**: Alta

#### Subtareas:
- [ ] Crear `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    lint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check

    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run test

    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run build
  ```
- [ ] Configurar caches para npm y Turborepo
- [ ] Configurar matrix de Node.js versions
- [ ] Añadir badge de CI en README

#### Criterios de aceptación:
- [ ] CI se ejecuta en push/PR
- [ ] Jobs de lint, test y build pasan
- [ ] Caches funcionan correctamente
- [ ] Badge de CI visible en README

---

### 8. Crear Página Home y Admin Básico
**Responsable**: Desarrollador Frontend
**Tiempo estimado**: 4 horas
**Prioridad**: Media

#### Subtareas:
- [ ] Crear página Home (`app/(public)/page.tsx`):
  - Hero section básico
  - Grid de servicios
  - Footer
- [ ] Crear página Admin básica (`app/(admin)/dashboard/page.tsx`):
  - Header con navegación
  - Sidebar con menú
  - Dashboard con stats básicos
- [ ] Implementar navegación entre rutas
- [ ] Añadir estilos básicos con Tailwind

#### Criterios de aceptación:
- [ ] Home se renderiza correctamente
- [ ] Admin es accesible en `/admin/dashboard`
- [ ] Navegación funciona entre rutas
- [ ] Estilos se aplican correctamente

---

### 9. Configurar Testing Básico
**Responsable**: Desarrollador Full-Stack
**Tiempo estimado**: 3 horas
**Prioridad**: Media

#### Subtareas:
- [ ] Instalar dependencias de testing:
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom
  npm install -D @types/jest jest-environment-jsdom
  ```
- [ ] Configurar `jest.config.js`
- [ ] Crear tests básicos:
  - Test de Home page
  - Test de Admin page
  - Test de componentes UI
- [ ] Configurar script `npm run test`

#### Criterios de aceptación:
- [ ] Jest se ejecuta correctamente
- [ ] Tests básicos pasan
- [ ] Coverage report se genera
- [ ] Script de test funciona

---

### 10. Documentación y README
**Responsable**: Desarrollador Full-Stack
**Tiempo estimado**: 2 horas
**Prioridad**: Baja

#### Subtareas:
- [ ] Actualizar README principal con:
  - Descripción del proyecto
  - Instrucciones de instalación
  - Comandos disponibles
  - Estructura del proyecto
- [ ] Crear `docs/` con:
  - Guía de desarrollo
  - Estándares de código
  - Workflow de desarrollo
- [ ] Documentar variables de entorno
- [ ] Crear diagrama de arquitectura básico

#### Criterios de aceptación:
- [ ] README está actualizado y claro
- [ ] Documentación de desarrollo existe
- [ ] Variables de entorno documentadas
- [ ] Diagrama de arquitectura visible

## Entregables de la Fase 1
- ✅ Monorepo configurado con Turborepo
- ✅ Next.js 14 funcionando con App Router
- ✅ ESLint, Prettier y TypeScript configurados
- ✅ Paquetes compartidos funcionando
- ✅ Prisma conectado a Neon dev
- ✅ Seeds y datos de prueba creados
- ✅ CI básico funcionando en GitHub Actions
- ✅ Página Home y Admin básica funcionando
- ✅ Testing básico configurado
- ✅ Documentación inicial creada

## Criterios de Promoción a Fase 2
- [ ] `npm run dev` estable y funcional
- [ ] Migraciones idempotentes y funcionando
- [ ] CI sin fallos (lint/type/build/tests)
- [ ] App local renderiza Home y Admin
- [ ] Base de datos dev con seed funcionando
- [ ] Monorepo construye correctamente

## Riesgos y Mitigaciones
- **Riesgo**: Problemas de configuración de Turborepo
  - **Mitigación**: Seguir documentación oficial y ejemplos
- **Riesgo**: Problemas de conexión a Neon
  - **Mitigación**: Verificar credenciales y configuración de red
- **Riesgo**: Conflictos de dependencias entre paquetes
  - **Mitigación**: Usar versiones compatibles y peer dependencies

## Próximos Pasos
Una vez completada la Fase 1, proceder con la [Fase 2: Previews y Test en Vercel](../FASE-2-SEMANA-2.md).

## Recursos y Referencias
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
