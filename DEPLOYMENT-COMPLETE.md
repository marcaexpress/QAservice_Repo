# 🚀 DESPLIEGUE COMPLETO - QA Services

## ✅ ESTADO ACTUAL

**✅ APLICACIÓN LOCAL FUNCIONANDO**
- Estilos restaurados y funcionando
- CSS generado: `public/_tw.css` (36KB)
- Servidor corriendo en `http://localhost:3000`

**✅ CONFIGURACIÓN CI/CD LISTA**
- GitHub Actions workflow creado
- Scripts de build configurados
- Verificación de CSS en CI/CD

## 🚀 PASOS PARA DESPLIEGUE

### 1. DESPLEGAR DESIGN SYSTEM EN VERCEL

```bash
# Crear proyecto en vercel.com
# Root Directory: packages/design-system/
# Build Command: npm run build
# Output Directory: dist
# Framework: None (Static)
```

**URL del CSS**: `https://<proyecto-styles>.vercel.app/styles.css`

### 2. CONFIGURAR SECRETS EN GITHUB

En tu repositorio GitHub → Settings → Secrets and variables → Actions:

```bash
VERCEL_TOKEN=tu_token_de_vercel
ORG_ID=tu_org_id_de_vercel
PROJECT_ID=tu_project_id_de_vercel
```

### 3. CONFIGURAR VARIABLE DE ENTORNO EN APPS/WEB

En tu proyecto `apps/web` en Vercel:

```bash
NEXT_PUBLIC_STYLES_CDN=https://<proyecto-styles>.vercel.app/styles.css
```

### 4. DESPLEGAR APLICACIÓN PRINCIPAL

**Opción A: Vía GitHub Actions (Recomendado)**
- Push a `main` o `develop` → Despliegue automático
- El workflow generará CSS y hará build

**Opción B: Vía Vercel Dashboard**
- Importar repositorio
- Root Directory: `apps/web`
- Build Command: `npm run build`

## 🔧 VERIFICACIÓN DEL DESPLIEGUE

### 1. Design System
- ✅ CSS accesible en: `https://<proyecto>.vercel.app/styles.css`
- ✅ Tamaño: > 50KB (CSS completo)

### 2. Aplicación Principal
- ✅ CSS fallback: `https://<tu-web>.vercel.app/_tw.css`
- ✅ Tamaño: > 30KB (CSS purgado)
- ✅ Estilos aplicándose correctamente

### 3. Integración
- ✅ `<link rel="stylesheet">` apunta al CDN
- ✅ Fallback local funciona si CDN falla

## 📋 ARCHIVOS DE CONFIGURACIÓN

### GitHub Actions
- `.github/workflows/deploy.yml` - CI/CD automático

### Vercel
- `apps/web/vercel.json` - Configuración de la app
- `packages/design-system/vercel.json` - Configuración del DS

### Build Scripts
- `apps/web/build.sh` - Script de build local
- `apps/web/package.json` - Scripts npm actualizados

## 🎯 FLUJO DE DESPLIEGUE

```
1. Push a main/develop
   ↓
2. GitHub Actions se ejecuta
   ↓
3. Genera CSS con npm run prebuild
   ↓
4. Verifica que CSS existe
   ↓
5. Genera cliente Prisma
   ↓
6. Build de Next.js
   ↓
7. Deploy a Vercel
   ↓
8. CSS disponible en /_tw.css
```

## 🚨 TROUBLESHOOTING

### CSS no se genera en CI/CD
1. Verificar que `npm run prebuild` esté en el workflow
2. Comprobar que Tailwind esté instalado
3. Verificar permisos de escritura en `public/`

### Build falla en Vercel
1. Verificar que `NODE_ENV=production`
2. Comprobar que Prisma se genere correctamente
3. Verificar variables de entorno

### Estilos no se cargan en producción
1. Verificar que `_tw.css` esté en `public/`
2. Comprobar que el layout incluya el `<link>`
3. Verificar que la variable `NEXT_PUBLIC_STYLES_CDN` esté configurada

## 🎉 RESULTADO FINAL

**✅ CSS centralizado vía CDN (estilo SLDS)**
**✅ Fallback local garantizado en CI/CD**
**✅ Despliegue automático vía GitHub Actions**
**✅ Verificación de CSS en cada build**
**✅ Configuración robusta para producción**

## 📞 PRÓXIMOS PASOS

1. **Desplegar design system** en Vercel
2. **Configurar secrets** en GitHub
3. **Configurar variable de entorno** en apps/web
4. **Hacer push** a main/develop para deploy automático

¡El sistema está completamente configurado para despliegue automático con CSS garantizado! 🚀
