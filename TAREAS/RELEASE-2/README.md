# Release 2: CMS Pro - CMS Robusto Tipo WordPress Mejorado

## Objetivo
Implementar un CMS robusto tipo WordPress pero significativamente mejorado, con edición completa desde el front, 120+ plantillas especializadas en learning y contenido, y Elementos Dinámicos para simulacros funcionales (pasarela de pago, formularios avanzados, webhooks, etc.).

## Roadmap Semanal

### 🚀 R2-0 (Semana 1): Habilitadores (Infra + Modelo)
**Objetivos**: Preparar base técnica para edición en front, plantillas y elementos dinámicos.

**Tareas**:
- [ ] UI/Runtime: Barra Admin en front (overlay) con modos: Ver / Editar / Estructura / Historia
- [ ] "Zonas de drop" (slots) y handles para mover/insertar bloques (dnd-kit)
- [ ] Autosave con draft buffer y undo/redo por bloque
- [ ] Modelo de datos (Prisma): BlockDefinition, Template, TemplateSection, Blueprint, ElementDefinition, ContentVersion
- [ ] Seguridad & sandbox: CSP estricta, Elementos Dinámicos en iframe con sandbox y postMessage
- [ ] SRI (Subresource Integrity) para cargar elementos remotos
- [ ] Pipeline "Template Pack": valida JSON Schemas, pesos, accesibilidad y screenshots
- [ ] Visual regression base (Percy/Playwright) para 10 plantillas canarias

**Entregables**:
- Overlay front estable
- Edición inline de texto en un bloque demo
- Plantillas y elementos pasan validadores de schema + seguridad

**Criterios de aceptación**: Overlay front estable, edición inline funcional, validación de seguridad pasando

---

### ✏️ R2-1 (Semana 2): Edición en Front 1.0
**Objetivos**: Edición completa desde el sitio público, con control de versiones.

**Tareas**:
- [ ] Inline editing RTE (TipTap/Slate): títulos, párrafos, listas, enlaces, citas
- [ ] Propiedades de bloque vía formularios generados (jsonSchema → UI)
- [ ] Estructura de página: añadir/duplicar/eliminar/mover bloques
- [ ] Versionado & diff visual por bloque y por página; rollback
- [ ] Workflows: Draft → Review → Published (con comentarios y asignaciones)
- [ ] RBAC/ABAC: Editor edita; Publisher publica; Reviewer aprueba
- [ ] ISR & revalidate: Publicar dispare revalidación por slug (≤10s en Test)

**Entregables**:
- E2E: crear página desde front, editar 3 bloques, enviar a revisión y publicar
- Diff visual resalta cambios de props y texto con granularidad por campo

**Criterios de aceptación**: Flujos de edición-publicación sin errores, diff visual funcional

---

### 🎨 R2-2 (Semana 3): Biblioteca de Plantillas (100+) y Secciones
**Objetivos**: Librería curada, reutilizable y rápida.

**Tareas**:
- [ ] Catálogo mínimo (120 plantillas):
  - Learning (40): Portada de curso, índice, lección, quiz, tareas, rúbrica, certificado, roadmap, FAQ curso, evaluación final
  - Blog/Docs (25): Artículo largo, tutorial, guía paso a paso, changelog, landing blog, autor, categorías
  - Landing/Marketing (20): Hero variantes, precios, features, comparativas, testimonios, CTA, caso de estudio
  - Canvases interactivos (12): Project Canvas, Test Plan Canvas, Bug Triage, Risk Matrix, User Story Mapping
  - Formularios (12): contacto, lead gen, inscripción curso, evaluación satisfacción, multi-paso, con lógicas condicionales
  - E-commerce simulado (11): listado, ficha simulada, carrito, checkout simulado, thank-you, historial "fake"
- [ ] Secciones (≥300): hero, grids, FAQs, métricas, steps, timelines, comparativas, tablas, callouts
- [ ] Tematización: Design tokens (color, tipografía, spacing) y variantes de tema
- [ ] Herramientas: Buscador por categoría/objetivo, previews en tiempo real, prueba de accesibilidad
- [ ] Import/export de plantillas (JSON + assets)

**Entregables**:
- 120 plantillas auditadas WCAG AA, LCP p75 < 2s en Test, SEO básico
- Import/export de plantillas funcionando

**Criterios de aceptación**: 120 plantillas auditadas, import/export funcional

---

### ⚡ R2-3 (Semana 4): Elementos Dinámicos 1.0 (No-Plugins)
**Objetivos**: Reemplazar plugins por componentes aislados, seguros y versionables.

**Tareas**:
- [ ] Runtime: Carga por ElementDefinition firmada, iframe sandbox + postMessage
- [ ] Element SDK: API declarativa (props, eventos, slots)
- [ ] Event Bus: element:event (submit, success, error, route, open-modal)
- [ ] Server Actions bridge: acciones seguras en Route Handlers (Next.js)
- [ ] Catálogo inicial de Elementos:
  - Form Runner (consume esquemas del Forms Builder)
  - Table/Data Viewer (listado dinámico de colecciones)
  - Webhook Inspector (listener + visor de payloads en tiempo real)
  - Email Previewer (render de plantillas de correo para pruebas)
- [ ] Telemetría: Trazas OTel por elemento (latencia, errores, props tamaño)

**Entregables**:
- Elemento falla → no rompe página (fall back UI)
- Auditoría: quién añadió/actualizó elemento, versión e integridad (hash)

**Criterios de aceptación**: Elemento falla → no rompe página, auditoría completa

---

### 📝 R2-4 (Semana 5): Forms Builder Pro
**Objetivos**: Formularios con lógica, validación fuerte, analytics y envíos.

**Tareas**:
- [ ] Builder: Campos avanzados (texto, número, email, teléfono, select, checkbox, radio, fecha, archivo, firma, rating, net promoter score)
- [ ] Lógica condicional (show/hide, enable/disable, branch) y multi-paso
- [ ] Validación con Zod; server-side validate
- [ ] Procesos: Destinos (guardar en DB, enviar email, webhook, export CSV)
- [ ] Anti-spam privacy-friendly (honey-pot, time-trap, rate limit)
- [ ] Analytics: Conversión por paso, tiempo medio, abandonos, mapa de errores

**Entregables**:
- Test: 1k envíos en 5 min sin pérdida, p95 server validate < 250ms
- Export y borrado (GDPR) funcionando

**Criterios de aceptación**: 1k envíos en 5 min sin pérdida, GDPR funcional

---

### 💳 R2-5 (Semana 6): Simulador de Pasarela de Pago (QA)
**Objetivos**: Simular flujos e incidencias para pruebas funcionales.

**Tareas**:
- [ ] Flujos: Tarjeta (números de prueba), 3DS mock, wallets simuladas, transferencia ficticia
- [ ] Inyección de fallos: fondos insuficientes, CVV inválido, 3DS timeout, duplicado, error 5xx
- [ ] Webhooks: Emisor payment_intent.* simulado + reintentos; latencia configurable
- [ ] Visor en tiempo real (Webhook Inspector) con replay
- [ ] Recibos: Generación PDF "fake" con campos reales del intento

**Entregables**:
- 15 escenarios cubiertos (happy/edge/cancel/refund partial)
- Registro completo en AuditLog y trazas OTel por flujo

**Criterios de aceptación**: 15 escenarios cubiertos, registro completo en AuditLog

---

### 🎯 R2-6 (Semana 7): Canvases Interactivos (Proyectos y QA)
**Objetivos**: Herramientas de planificación y colaboración in-page.

**Tareas**:
- [ ] Tipos: Lean/BM Canvas, Test Plan, Bug Triage, Risk Matrix, User Story Mapping, Release Readiness
- [ ] Funciones: Sticky notes, arrastrar, etiquetas, vínculo a evidencias (URLs/archivos)
- [ ] Colaboración en tiempo real (Yjs) con presencia y comentarios
- [ ] Export PDF/PNG; versionado por "snapshot" del canvas

**Entregables**:
- Latencia de sincronización < 300ms p95 (Test)
- Persistencia y diff entre snapshots

**Criterios de aceptación**: Latencia < 300ms p95, persistencia y diff funcionales

---

### 🎓 R2-7 (Semana 8): Learning Templates + Exercise Player 2.0
**Objetivos**: Aprendizaje completo en CMS (sin LMS externo).

**Tareas**:
- [ ] Contenido: Course/Lesson/Module como colecciones editables desde front
- [ ] Exercise Player: opción múltiple, relacionar, completar, código, paso-a-paso, subida de evidencia
- [ ] Bancos de ítems con taxonomía (objetivos del syllabus, dificultad)
- [ ] Seguimiento: Progreso por usuario (local), intentos, feedback, tiempo por tarea
- [ ] Export xAPI (MVP) hacia LRS opcional

**Entregables**:
- 10 plantillas de lección + 10 de evaluación, trazabilidad ejercicio↔objetivo
- Certificado básico (plantilla) + verificación por hash

**Criterios de aceptación**: 20 plantillas de learning, trazabilidad funcional

---

### 🏪 R2-8 (Semana 9): Marketplace Interno, Multi-Tenant y Tematización Avanzada
**Objetivos**: Escalar la reutilización y el "time-to-content".

**Tareas**:
- [ ] Marketplace: Instalar/actualizar plantillas/secciones/elementos desde catálogo interno
- [ ] Versiones, changelogs, verify (firma) y compatibilidad
- [ ] Multi-tenant: Duplicado de sitios (blueprint) por organización; límites y cuotas
- [ ] Brand Kit: Cargar paleta, fuentes y logos pack; aplicar a todas las plantillas

**Entregables**:
- Importar un Blueprint (5 páginas) y publicarlo en < 5 min
- Auditoría de instalación/upgrade de assets con firma válida

**Criterios de aceptación**: Blueprint importado en < 5 min, auditoría con firma válida

---

### 🛡️ R2-9 (Semana 10): Hardening (A11y, SEO, Rendimiento, Seguridad)
**Objetivos**: Cumplir estándares y SLOs.

**Tareas**:
- [ ] Accesibilidad: axe en CI para TODAS las plantillas; foco visible; roles/labels
- [ ] SEO: schema.org (Course, HowTo, Article, FAQ), hreflang, sitemaps por idioma/tipo
- [ ] Perf: Budgets por plantilla (JS ≤ 180KB gzip), LCP p75 < 2.0s, INP p75 < 200ms
- [ ] Seguridad: DAST (ZAP) semanal; dependencia (Trivy/Renovate); secrets rotados

**Entregables**:
- 0 errores críticos de a11y
- LHC ≥ 85 en Performance/SEO/Best Practices
- Informe de seguridad sin High pendientes

**Criterios de aceptación**: 0 errores críticos de a11y, LHC ≥ 85, seguridad sin High

---

### 📚 R2-10 (Semana 11): Documentación, SDK y Runbooks
**Objetivos**: Operabilidad y extensibilidad.

**Tareas**:
- [ ] Docs: Manual de editor front, guía de plantillas, guía de Element SDK (crear un elemento)
- [ ] ADRs (decisiones de arquitectura) y playbooks (rollback, migraciones)
- [ ] Runbooks: Incidentes (ISR no revalida, webhook caído, elemento fallido/sin integridad, hotfix de plantilla)

**Entregables**:
- Equipo puede crear una plantilla nueva desde cero y publicarla en Test sin ayuda
- Documentación operativa completa

**Criterios de aceptación**: Equipo autónomo para crear plantillas, documentación completa

## Entregables Finales Release 2
- ✅ Edición completa en front con workflows, versionado, diff y rollback
- ✅ ≥120 plantillas y ≥300 secciones auditadas (a11y, SEO, perf)
- ✅ Elementos Dinámicos seguros (sandbox + SRI + scopes), con simulador de pagos y formularios pro
- ✅ Canvases interactivos con colaboración y export
- ✅ CI/CD con gates (axe, LHC, budgets, e2e) y rollback practicado
- ✅ Documentación y SDK listos; equipo capaz de crear/extender sin soporte del core

## Matriz de Categorías de Plantillas (≥120)
| Categoría | Cantidad | Ejemplos |
|-----------|----------|----------|
| Learning | 40 | Portada Curso, Índice, Lección, Evaluación, Tareas, Rúbrica, Certificado |
| Blog/Docs | 25 | Artículo long-form, HowTo, Guía API, Autor, Categoría, Changelog |
| Landing/Marketing | 20 | Hero, Pricing, Features, Testimonios, Comparativa, CTA |
| Canvases interactivos | 12 | Lean Canvas, Test Plan, Bug Triage, Risk Matrix, User Story Map |
| Formularios | 12 | Contacto, Lead Gen, Inscripción, Encuesta Satisfacción, Multi-step |
| E-commerce simulado | 11 | Lista, Ficha, Carrito, Checkout, Thank-you, Pedidos (fake) |
| **Total** | **120** | — |

## Elementos Dinámicos · Catálogo Inicial
- **Forms Runner** (ejecuta formularios con lógica avanzada)
- **Payment Gateway Simulator** (checkout + 3DS mock + webhooks + errores)
- **Webhook Inspector** (recibe/visualiza/replay)
- **Email Previewer** (render y envío simulado)
- **Data Table/CRUD simulado** (catálogo, usuarios ficticios)
- **Scenario Switcher** (inyecta fallos y variantes para pruebas)

## Aceptación Global de la Release 2
- Edición completa en front con workflows, versionado, diff y rollback
- ≥120 plantillas y ≥300 secciones auditadas (a11y, SEO, perf)
- Elementos Dinámicos seguros (sandbox + SRI + scopes), con simulador de pagos y formularios pro
- Canvases interactivos con colaboración y export
- CI/CD con gates (axe, LHC, budgets, e2e) y rollback practicado
- Documentación y SDK listos; equipo capaz de crear/extender sin soporte del core
