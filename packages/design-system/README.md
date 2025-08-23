# Design System Package

Paquete centralizado para el sistema de diseño de QA Services.

## Características

- **CSS Universal**: Genera un CSS completo basado en safelist de Tailwind
- **Tokens CSS**: Variables CSS para colores de marca y temas
- **CDN Ready**: Preparado para despliegue en Vercel como sitio estático
- **Fallback Local**: Genera CSS local como respaldo

## Uso

### Desarrollo

```bash
npm run dev    # Watch mode para desarrollo
npm run build  # Build de producción
```

### Despliegue

1. **Vercel**: Crear proyecto apuntando a `packages/design-system/`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Framework**: None (Static)

El CSS estará disponible en: `https://<proyecto>.vercel.app/styles.css`

### Integración

En `apps/web`, configurar la variable de entorno:

```bash
NEXT_PUBLIC_STYLES_CDN=https://<proyecto>.vercel.app/styles.css
```

## Estructura

```
packages/design-system/
├── src/
│   ├── index.css      # Entry point con Tailwind
│   └── tokens.css     # Variables CSS de marca
├── dist/              # CSS compilado (generado)
├── tailwind.config.js # Configuración con safelist
├── postcss.config.js  # PostCSS config
└── vercel.json        # Configuración de Vercel
```

## Safelist

El paquete incluye un safelist extenso que garantiza que las utilidades comunes de Tailwind estén siempre disponibles:

- Colores (slate, gray, zinc, etc.)
- Espaciado (padding, margin)
- Layout (grid, flex, display)
- Tipografía (font, leading, tracking)
- Bordes y sombras
- Y más...

## Tokens de Marca

```css
:root {
  --color-brand: 59 130 246;      /* #3b82f6 */
  --color-brand-50: 239 246 255;
  --color-brand-100: 219 234 254;
  --color-brand-500: 59 130 246;
  --color-brand-700: 29 78 216;
}
```

Uso en Tailwind: `bg-brand`, `text-brand-500`, etc.
