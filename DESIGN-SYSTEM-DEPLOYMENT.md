# 🚀 Despliegue del Design System

## Objetivo

Desplegar el paquete `packages/design-system` como sitio estático en Vercel para servir CSS vía CDN.

## Pasos de Despliegue

### 1. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea un nuevo proyecto
2. **Import Git Repository**: Selecciona tu repositorio
3. **Framework Preset**: Selecciona **"Other"** o **"No Framework"**
4. **Root Directory**: `packages/design-system`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Install Command**: `npm install`

### 2. Variables de Entorno

No se requieren variables de entorno para el design system.

### 3. Despliegue

1. Haz clic en **"Deploy"**
2. Espera a que se complete el build
3. El CSS estará disponible en: `https://<proyecto>.vercel.app/styles.css`

## Integración en apps/web

### 1. Variable de Entorno

En tu proyecto de `apps/web` en Vercel, añade:

```bash
NEXT_PUBLIC_STYLES_CDN=https://<proyecto>.vercel.app/styles.css
```

### 2. Redeploy

1. Ve a tu proyecto `apps/web` en Vercel
2. **Settings** → **Environment Variables**
3. Añade la variable `NEXT_PUBLIC_STYLES_CDN`
4. **Redeploy** con "Clear build cache"

## Verificación

### 1. CSS del Design System

- URL: `https://<proyecto>.vercel.app/styles.css`
- Debe pesar **decenas de KB** (CSS completo con safelist)
- Debe contener todas las utilidades de Tailwind

### 2. Fallback Local

- URL: `https://<tu-web>.vercel.app/_tw.css`
- Debe pesar **> 5 KB** (CSS purgado de la app)
- Se genera automáticamente en `prebuild`

### 3. Integración

- En el HTML de tu web, verifica el `<link rel="stylesheet">`
- Debe apuntar al CDN si la variable está configurada
- Debe apuntar a `/_tw.css` como fallback

## Estructura de URLs

```
Design System (CDN):
https://<proyecto-styles>.vercel.app/styles.css

Fallback Local:
https://<tu-web>.vercel.app/_tw.css
```

## Troubleshooting

### CSS no se carga

1. Verifica que la variable `NEXT_PUBLIC_STYLES_CDN` esté configurada
2. Comprueba que el proyecto design-system esté desplegado
3. Verifica que el build del design-system sea exitoso

### Build falla

1. Verifica que `packages/design-system/package.json` tenga las dependencias correctas
2. Comprueba que `tailwind.config.js` esté bien configurado
3. Verifica que `src/index.css` exista y tenga las directivas de Tailwind

### CSS incompleto

1. Verifica que el safelist en `tailwind.config.js` incluya las clases necesarias
2. Comprueba que `src/tokens.css` esté bien configurado
3. Verifica que el build genere `dist/styles.css` correctamente

## Monitoreo

### Métricas a revisar

- **Tiempo de carga del CSS**: Debe ser < 100ms desde CDN
- **Tamaño del CSS**: Design system > 50KB, fallback < 20KB
- **Disponibilidad**: 99.9%+ uptime del CDN

### Alertas

- CSS del design system no accesible
- Fallback local no se genera
- Tiempo de carga del CSS > 500ms

## Rollback

Si algo falla:

1. **Elimina** la variable `NEXT_PUBLIC_STYLES_CDN`
2. **Redeploy** de `apps/web`
3. La app usará automáticamente el fallback local `/_tw.css`

## Beneficios

✅ **CSS centralizado** vía CDN (estilo SLDS)  
✅ **Fallback local** garantizado  
✅ **Configuración robusta** para monorepo  
✅ **Next 14 + Vercel** optimizado  
✅ **Safelist completo** para utilidades comunes  
✅ **Tokens de marca** consistentes  
✅ **Despliegue independiente** del design system
