# 🛡️ CMS Access Control System - QA Services

## 📋 Resumen Ejecutivo

Se ha implementado un **Sistema de Control de Acceso Completo** para el CMS de QA Services que permite a los editores asignar vistas editadas a grupos específicos de usuarios por rol, usuarios específicos o vista pública.

### 🎯 Características Principales

- ✅ **Control de Acceso Granular**: Permisos por página con reglas específicas
- ✅ **Múltiples Tipos de Acceso**: Público, Privado, Basado en Rol, Usuario Específico, Organización
- ✅ **Gestión de Permisos**: VIEW, EDIT, PUBLISH, DELETE
- ✅ **Interfaz Intuitiva**: Panel dedicado en el CMS para gestión de acceso
- ✅ **API RESTful**: Endpoints completos para CRUD de reglas de acceso
- ✅ **Validación de Seguridad**: Verificación de permisos en cada operación

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
apps/web/components/cms/
├── CMSAccessControl.tsx     # Panel principal de control de acceso
├── CMSidebar.tsx            # Sidebar con nueva pestaña "Acceso"
└── CMSLayout.tsx            # Layout integrado con control de acceso

apps/web/app/api/cms/
├── pages/[pageId]/access-control/route.ts           # CRUD de reglas de acceso
├── pages/[pageId]/access-control/[ruleId]/route.ts # Actualizar/Eliminar reglas
├── roles/route.ts                                   # Obtener roles disponibles
├── users/route.ts                                   # Obtener usuarios disponibles
└── organizations/route.ts                           # Obtener organizaciones
```

### Base de Datos

```
prisma/schema.prisma
├── PageAccessRule          # Reglas de acceso por página
├── Page                   # Páginas del CMS (con relación a reglas)
├── Role                   # Roles del sistema
├── User                   # Usuarios del sistema
└── Organization           # Organizaciones
```

## 🚀 Funcionalidades Implementadas

### 1. Tipos de Acceso Soportados

#### **Acceso Público (PUBLIC)**
- **Descripción**: Página visible para todos los usuarios
- **Uso**: Contenido general, páginas de marketing, información pública
- **Permisos**: Solo VIEW
- **Configuración**: No requiere campos adicionales

#### **Acceso Privado (PRIVATE)**
- **Descripción**: Página visible solo para administradores y editores
- **Uso**: Contenido interno, borradores, páginas en desarrollo
- **Permisos**: VIEW, EDIT, PUBLISH, DELETE
- **Configuración**: No requiere campos adicionales

#### **Acceso Basado en Rol (ROLE_BASED)**
- **Descripción**: Página visible para usuarios con roles específicos
- **Uso**: Contenido por departamento, acceso por nivel jerárquico
- **Permisos**: VIEW, EDIT, PUBLISH, DELETE (configurables)
- **Configuración**: Requiere selección de rol específico

#### **Acceso por Usuario Específico (USER_SPECIFIC)**
- **Descripción**: Página visible solo para usuarios específicos
- **Uso**: Contenido personalizado, páginas de usuario individual
- **Permisos**: VIEW, EDIT, PUBLISH, DELETE (configurables)
- **Configuración**: Requiere selección de usuario específico

#### **Acceso por Organización (ORGANIZATION)**
- **Descripción**: Página visible para usuarios de organizaciones específicas
- **Uso**: Contenido multi-tenant, páginas corporativas
- **Permisos**: VIEW, EDIT, PUBLISH, DELETE (configurables)
- **Configuración**: Requiere selección de organización

### 2. Sistema de Permisos

#### **Permisos Disponibles**
- **VIEW**: Ver contenido de la página
- **EDIT**: Editar contenido de la página
- **PUBLISH**: Publicar cambios en la página
- **DELETE**: Eliminar la página

#### **Matriz de Permisos por Tipo de Acceso**

| Tipo de Acceso | VIEW | EDIT | PUBLISH | DELETE |
|----------------|------|------|---------|---------|
| Público | ✅ | ❌ | ❌ | ❌ |
| Privado | ✅ | ✅ | ✅ | ✅ |
| Basado en Rol | ✅* | ✅* | ✅* | ✅* |
| Usuario Específico | ✅* | ✅* | ✅* | ✅* |
| Organización | ✅* | ✅* | ✅* | ✅* |

*Permisos configurables según la regla específica

### 3. Interfaz de Usuario

#### **Panel de Control de Acceso**
- **Ubicación**: Nueva pestaña "Acceso" en el sidebar del CMS
- **Funcionalidades**:
  - Lista de reglas de acceso existentes
  - Botón para agregar nuevas reglas
  - Edición y eliminación de reglas existentes
  - Vista previa de permisos y configuraciones

#### **Formulario de Regla de Acceso**
- **Campos**:
  - Tipo de acceso (dropdown)
  - Selección de rol/usuario/organización (según tipo)
  - Permisos (checkboxes múltiples)
- **Validación**: Campos requeridos según el tipo de acceso
- **Feedback**: Mensajes de éxito/error en tiempo real

## 🔧 Configuración y Uso

### Requisitos Previos

```bash
# Asegurar que la base de datos esté actualizada
npx prisma generate
npx prisma db push

# Verificar que las tablas existan
npx prisma studio
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="tu-secret-key"

# CMS
CMS_ACCESS_CONTROL_ENABLED=true
```

### Uso del Sistema

#### **1. Acceder al Control de Acceso**
1. Abrir el CMS en `/admin`
2. Seleccionar la pestaña "Acceso" en el sidebar
3. El panel derecho mostrará las reglas de acceso existentes

#### **2. Crear Nueva Regla de Acceso**
1. Hacer clic en "Agregar Regla de Acceso"
2. Seleccionar el tipo de acceso deseado
3. Configurar campos específicos según el tipo
4. Seleccionar permisos requeridos
5. Guardar la regla

#### **3. Editar Regla Existente**
1. Hacer clic en el botón de editar (ícono de lápiz)
2. Modificar los campos necesarios
3. Guardar los cambios

#### **4. Eliminar Regla**
1. Hacer clic en el botón de eliminar (ícono de papelera)
2. Confirmar la eliminación

### Ejemplos de Configuración

#### **Ejemplo 1: Página Pública para Todos**
```json
{
  "accessType": "PUBLIC",
  "permissions": ["VIEW"]
}
```

#### **Ejemplo 2: Página para Editores CMS**
```json
{
  "accessType": "ROLE_BASED",
  "roleId": "role_editor_cms",
  "permissions": ["VIEW", "EDIT", "PUBLISH"]
}
```

#### **Ejemplo 3: Página Privada para Usuario Específico**
```json
{
  "accessType": "USER_SPECIFIC",
  "userId": "user_john_doe",
  "permissions": ["VIEW", "EDIT"]
}
```

#### **Ejemplo 4: Página Corporativa**
```json
{
  "accessType": "ORGANIZATION",
  "organizationId": "org_qa_services",
  "permissions": ["VIEW", "EDIT", "PUBLISH"]
}
```

## 📊 API Endpoints

### **1. Obtener Reglas de Acceso**
```http
GET /api/cms/pages/{pageId}/access-control
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "accessRules": [
    {
      "id": "rule_1",
      "accessType": "ROLE_BASED",
      "roleId": "role_editor",
      "permissions": ["VIEW", "EDIT"],
      "role": {
        "id": "role_editor",
        "name": "Editor CMS",
        "description": "Editor de contenido"
      }
    }
  ]
}
```

### **2. Crear Regla de Acceso**
```http
POST /api/cms/pages/{pageId}/access-control
Authorization: Bearer {token}
Content-Type: application/json

{
  "accessType": "ROLE_BASED",
  "roleId": "role_editor",
  "permissions": ["VIEW", "EDIT"]
}
```

### **3. Actualizar Regla de Acceso**
```http
PUT /api/cms/pages/{pageId}/access-control/{ruleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "accessType": "ROLE_BASED",
  "roleId": "role_editor",
  "permissions": ["VIEW", "EDIT", "PUBLISH"]
}
```

### **4. Eliminar Regla de Acceso**
```http
DELETE /api/cms/pages/{pageId}/access-control/{ruleId}
Authorization: Bearer {token}
```

### **5. Obtener Recursos Disponibles**
```http
GET /api/cms/roles
GET /api/cms/users
GET /api/cms/organizations
Authorization: Bearer {token}
```

## 🔒 Seguridad y Validación

### **Autenticación**
- Todas las operaciones requieren token JWT válido
- Verificación de rol de usuario (Administrador o Editor CMS)

### **Autorización**
- Validación de permisos antes de cualquier operación
- Verificación de que la regla pertenece a la página especificada

### **Validación de Datos**
- Campos requeridos según el tipo de acceso
- Validación de tipos de datos y formatos
- Sanitización de inputs

### **Auditoría**
- Logs de todas las operaciones de acceso
- Timestamps de creación y modificación
- Trazabilidad de cambios

## 🧪 Testing y Validación

### **Scripts de Prueba**
```bash
# Probar funcionalidad del control de acceso
node scripts/test-access-control.js

# Probar endpoints de la API
npm run test:api:access-control
```

### **Casos de Uso Validados**
- ✅ Creación de reglas de acceso
- ✅ Edición de reglas existentes
- ✅ Eliminación de reglas
- ✅ Validación de permisos
- ✅ Control de acceso por rol
- ✅ Control de acceso por usuario
- ✅ Control de acceso por organización
- ✅ Acceso público y privado

## 🔮 Roadmap y Mejoras Futuras

### **Corto Plazo (1-2 semanas)**
- [ ] **Auditoría de Acceso**: Logs detallados de acceso
- [ ] **Notificaciones**: Alertas cuando se cambian permisos
- [ ] **Plantillas**: Reglas de acceso predefinidas

### **Mediano Plazo (1-2 meses)**
- [ ] **Workflow de Aprobación**: Aprobación de cambios de acceso
- [ ] **Expiración de Acceso**: Reglas con fecha de vencimiento
- [ ] **Acceso Temporal**: Permisos por tiempo limitado

### **Largo Plazo (3-6 meses)**
- [ ] **Machine Learning**: Sugerencias automáticas de permisos
- [ ] **Análisis de Uso**: Métricas de acceso y patrones
- [ ] **Integración SSO**: Soporte para sistemas de autenticación externos

## 🚨 Solución de Problemas

### **Problemas Comunes**

#### **Error: "No tienes permisos para editar esta página"**
```bash
# Verificar que el usuario tenga rol de Editor CMS o Administrador
# Verificar que la regla de acceso incluya el permiso EDIT
```

#### **Error: "Regla de acceso no encontrada"**
```bash
# Verificar que el ruleId sea correcto
# Verificar que la regla pertenezca a la página especificada
```

#### **Error: "Campos requeridos faltantes"**
```bash
# Verificar que todos los campos obligatorios estén completos
# Verificar que el tipo de acceso tenga los campos correspondientes
```

### **Logs y Debugging**
```bash
# Habilitar logs detallados
DEBUG=* npm run dev

# Ver logs de acceso
DEBUG=access-control:* npm run dev
```

## 📚 Recursos y Referencias

### **Documentación Oficial**
- [Next.js 14](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [JWT](https://jwt.io/introduction)

### **Repositorios Relacionados**
- [QA Services Frontend](https://github.com/marcaexpress/QAservice_Repo)
- [CMS Core Package](packages/cms-core/)
- [Access Control System](components/cms/CMSAccessControl.tsx)

### **Contacto y Soporte**
- **Desarrollador**: AI Assistant
- **Proyecto**: QA Services CMS Access Control
- **Versión**: 1.0.0
- **Fecha**: Diciembre 2024

## 🎉 Conclusión

El Sistema de Control de Acceso implementado representa una **solución robusta y flexible** para la gestión de permisos en el CMS de QA Services, proporcionando:

- **Control Granular**: Permisos específicos por página y usuario
- **Flexibilidad**: Múltiples tipos de acceso para diferentes necesidades
- **Seguridad**: Validación completa de autenticación y autorización
- **Usabilidad**: Interfaz intuitiva para gestión de acceso
- **Escalabilidad**: Arquitectura preparada para crecimiento futuro

El sistema está **listo para producción** y puede ser utilizado inmediatamente por editores y administradores para gestionar el acceso al contenido del CMS de manera segura y eficiente.
