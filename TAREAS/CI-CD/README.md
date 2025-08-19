# CI/CD Pipeline - QA Services

## Visión General
Este directorio contiene la configuración completa de CI/CD para QA Services, incluyendo workflows de GitHub Actions, configuración de Vercel, y scripts de automatización para los tres entornos: Local, Test y Producción.

**El enfoque principal es asegurar que el CMS visual completo se despliegue de manera confiable y que los editores puedan crear y gestionar contenido sin interrupciones.**

## 🏗️ **Arquitectura de Entornos**

### **Matriz de Entornos**
| Entorno | Hosting | Base de Datos | Propósito | Datos | CMS Visual |
|----------|---------|----------------|-----------|-------|------------|
| **Local** | localhost:3000 | Neon branch/dev | Desarrollo diario | Seed dev sintético | ✅ Funcional |
| **Test** | Vercel qa-services-test | Neon branch/test + branches efímeros por PR | QA, previews, UAT | Datos anonimizados | ✅ Funcional |
| **Producción** | Vercel qa-services | Neon branch/prod | Público | Datos reales | ✅ Funcional |

### **Estrategia de Ramas**
- **main**: Solo código listo para producción (protegida)
- **develop**: Integración previa a test (protegida)
- **feature/***: Nuevas funcionalidades del CMS visual
- **hotfix/***: Correcciones urgentes de producción

### **Flujo de Promoción**
```
Local (dev) → Test (qa) → Producción (prod)
    ↓           ↓           ↓
  Neon dev   Neon test   Neon prod
    ↓           ↓           ↓
  CMS Visual  CMS Visual  CMS Visual
  Básico      Completo     Completo
```

## 🚀 **Workflows de GitHub Actions**

### **1. CI Básico (Pull Request)**
**Trigger**: `pull_request` a `develop` o `main`
**Objetivos**: Validar calidad del código antes de merge

```yaml
name: CI - Pull Request
on:
  pull_request:
    branches: [develop, main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Build
        run: npm run build
      
      - name: E2E tests (smoke)
        run: npm run test:e2e:smoke
```

### **2. Preview Environment (Pull Request)**
**Trigger**: `pull_request` a `develop`
**Objetivos**: Crear entorno de preview con CMS visual funcional

```yaml
name: Preview Environment
on:
  pull_request:
    branches: [develop]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_TEST }}
          vercel-args: '--prod'
      
      - name: Create Neon Branch
        run: |
          curl -X POST "https://console.neon.tech/api/v2/projects/${{ secrets.NEON_PROJECT_ID }}/branches" \
          -H "Authorization: Bearer ${{ secrets.NEON_API_KEY }}" \
          -H "Content-Type: application/json" \
          -d '{"branch":{"name":"pr-${{ github.event.number }}"}}'
      
      - name: Run migrations
        run: npm run db:migrate:preview
      
      - name: Seed preview data
        run: npm run db:seed:preview
      
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 **Preview Environment Ready!**
              
              **CMS Visual**: https://qa-services-test-git-pr-${context.event.number}-${context.repo.owner}.vercel.app
              **Database**: Neon branch \`pr-${context.event.number}\`
              
              **Testing Checklist**:
              - [ ] CMS visual accesible y funcional
              - [ ] Drag & drop de bloques funcionando
              - [ ] Autosave y preview operativo
              - [ ] Creación de contenido básico
              - [ ] Responsive design en móvil
              
              **Para probar el CMS**:
              1. Accede a la preview URL
              2. Haz login con credenciales de test
              3. Activa el modo edición (botón "Editar")
              4. Prueba arrastrar y soltar bloques
              5. Verifica que los cambios se guarden
              
              **Cleanup**: La base de datos se eliminará automáticamente al cerrar el PR`
        )
```

### **3. Deploy to Test (Develop)**
**Trigger**: `push` a `develop`
**Objetivos**: Desplegar a entorno de test con CMS visual completo

```yaml
name: Deploy to Test
on:
  push:
    branches: [develop]

jobs:
  deploy-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run all tests
        run: |
          npm run test:unit
          npm run test:integration
          npm run test:e2e
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel Test
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_TEST }}
          vercel-args: '--prod'
      
      - name: Run migrations
        run: npm run db:migrate:test
      
      - name: Update test data
        run: npm run db:seed:test
      
      - name: Health check
        run: |
          curl -f https://qa-services-test.vercel.app/api/health || exit 1
      
      - name: Notify team
        uses: actions/github-script@v7
        with:
          script: |
            // Notificar al equipo sobre el deploy exitoso
            // Incluir checklist de QA para el CMS visual
```

### **4. Deploy to Production (Main)**
**Trigger**: `push` a `main`
**Objetivos**: Desplegar a producción con CMS visual validado

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Security audit
        run: npm audit --audit-level=moderate
      
      - name: Run production tests
        run: |
          npm run test:unit
          npm run test:integration
          npm run test:e2e:prod
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          vercel-args: '--prod'
      
      - name: Run migrations
        run: npm run db:migrate:prod
      
      - name: Health check
        run: |
          curl -f https://qa-services.vercel.app/api/health || exit 1
      
      - name: Performance check
        run: |
          npm run lighthouse:prod
      
      - name: Notify deployment
        uses: actions/github-script@v7
        with:
          script: |
            // Notificar despliegue exitoso
            // Incluir métricas de performance
```

## 🧪 **Testing Strategy**

### **Pirámide de Testing para CMS Visual**
```
        E2E Tests (10%)
           /\
          /  \
         /    \
Integration (20%)
    /\
   /  \
  /    \
Unit Tests (70%)
```

### **Tests Específicos del CMS Visual**

#### **Unit Tests**:
- Componentes de bloques editables
- Lógica de drag & drop
- Sistema de autosave
- Validación de schemas
- Utilidades del CMS

#### **Integration Tests**:
- API de gestión de bloques
- Flujo de creación de páginas
- Sistema de versionado
- Autenticación y autorización

#### **E2E Tests**:
- Flujo completo de edición de página
- Creación de contenido educativo
- Gestión de plantillas
- Responsive design en diferentes dispositivos

### **Scripts de Testing**
```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=packages --testPathPattern=apps/web",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:e2e": "playwright test",
    "test:e2e:smoke": "playwright test --grep=@smoke",
    "test:e2e:prod": "playwright test --grep=@production",
    "test:cms": "jest --testPathPattern=cms",
    "test:blocks": "jest --testPathPattern=blocks"
  }
}
```

## 🔧 **Configuración de Entornos**

### **Variables de Entorno por Nivel**

#### **Local (.env.local)**:
```bash
# Base de datos
DATABASE_URL="postgresql://user:pass@localhost:5432/qa_services_dev"
SHADOW_DATABASE_URL="postgresql://user:pass@localhost:5432/qa_services_shadow"

# Autenticación
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=5000
CMS_PREVIEW_ENABLED=true
```

#### **Test (.env.test)**:
```bash
# Base de datos
DATABASE_URL="postgresql://user:pass@test.neon.tech/qa_services_test"
SHADOW_DATABASE_URL="postgresql://user:pass@test.neon.tech/qa_services_shadow"

# Autenticación
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="https://qa-services-test.vercel.app"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=3000
CMS_PREVIEW_ENABLED=true
```

#### **Producción (.env.production)**:
```bash
# Base de datos
DATABASE_URL="postgresql://user:pass@prod.neon.tech/qa_services_prod"

# Autenticación
NEXTAUTH_SECRET="prod-secret-key"
NEXTAUTH_URL="https://qa-services.vercel.app"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=2000
CMS_PREVIEW_ENABLED=true
```

## 📊 **Monitoreo y Alertas**

### **Métricas del CMS Visual**
- **Tiempo de carga del editor**: < 2 segundos
- **Tiempo de autosave**: < 1 segundo
- **Tiempo de preview**: < 3 segundos
- **Tasa de errores de guardado**: < 1%
- **Tiempo de respuesta del drag & drop**: < 100ms

### **Health Checks**
```typescript
// /api/health
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    cms: await checkCMS(),
    auth: await checkAuth(),
    storage: await checkStorage()
  };
  
  const healthy = Object.values(checks).every(check => check.status === 'ok');
  
  return Response.json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
}
```

### **Alertas Automáticas**
- **CMS no responde**: Editor no carga en < 5 segundos
- **Autosave fallando**: > 5% de errores en 5 minutos
- **Base de datos lenta**: Queries > 2 segundos
- **Preview fallando**: > 10% de errores en 10 minutos

## 🚨 **Rollback Strategy**

### **Rollback Automático**
```yaml
# En caso de fallo en producción
- name: Auto rollback on failure
  if: failure()
  run: |
    # Revertir a versión anterior
    vercel --prod --force
    # Notificar al equipo
    # Crear incidente automáticamente
```

### **Rollback Manual**
```bash
# Rollback a versión específica
vercel --prod --force --version=VERSION_ID

# Rollback de base de datos
npm run db:rollback:prod
```

## 📋 **Checklist de QA para CMS Visual**

### **Antes de Deploy a Test**:
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando
- [ ] E2E tests básicos pasando
- [ ] Build exitoso
- [ ] Linting sin errores
- [ ] Type checking correcto

### **Antes de Deploy a Producción**:
- [ ] QA en test completado
- [ ] CMS visual validado en test
- [ ] Performance tests pasando
- [ ] Security audit limpio
- [ ] Migraciones validadas
- [ ] Rollback plan listo

### **Post-Deploy**:
- [ ] Health check exitoso
- [ ] CMS visual accesible
- [ ] Autosave funcionando
- [ ] Preview operativo
- [ ] Responsive design validado
- [ ] Métricas de performance OK

## 🔮 **Futuras Mejoras del CI/CD**

### **Automatización Avanzada**:
- **Deploy automático** basado en métricas de performance
- **Rollback inteligente** basado en errores de usuario
- **Testing de regresión visual** automático
- **Análisis de impacto** de cambios en el CMS

### **Observabilidad**:
- **Tracing distribuido** con OpenTelemetry
- **Métricas de negocio** del CMS
- **Alertas predictivas** basadas en ML
- **Dashboard de despliegues** en tiempo real

---

**El pipeline de CI/CD está diseñado para asegurar que el CMS visual de QA Services se despliegue de manera confiable y que los editores puedan crear y gestionar contenido sin interrupciones, manteniendo la calidad y performance en todos los entornos.**
