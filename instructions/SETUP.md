# 🏗️ Setup Guide - Real Estate Platform

Esta guía te ayudará a configurar la plataforma inmobiliaria desde cero.

## 📋 Prerrequisitos

- **Node.js 18+** instalado
- **PostgreSQL** con extensión PostGIS
- **Redis** server
- Cuenta en **Clerk** (https://clerk.com)
- Cuenta en **Google Cloud** (para Maps API)
- Cuenta en **Resend** (para emails)
- Cuenta en **Cloudflare** (para R2 storage)

## 🚀 Pasos de Configuración

### 1. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Completa las variables necesarias:

#### Base de Datos PostgreSQL
```env
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_db"
```

#### Redis
```env
REDIS_URL="redis://localhost:6379"
```

#### Clerk Authentication
1. Ve a https://clerk.com y crea una nueva aplicación
2. Copia las claves:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

#### Google Maps API
1. Ve a Google Cloud Console
2. Habilita estas APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Street View Static API
3. Crea una API key:
```env
GOOGLE_MAPS_API_KEY="your_google_maps_key"
```

#### Resend (Email)
1. Ve a https://resend.com
2. Crea una API key:
```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@tu-dominio.com"
```

#### Cloudflare R2 (Storage)
1. Ve a Cloudflare Dashboard
2. Configura R2:
```env
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
CLOUDFLARE_R2_BUCKET_NAME="real-estate-assets"
CLOUDFLARE_R2_ENDPOINT="https://ACCOUNT_ID.r2.cloudflarestorage.com"
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

1. **Generar cliente de Prisma:**
```bash
npm run db:generate
```

2. **Crear tablas en la base de datos:**
```bash
npm run db:push
```

3. **Poblar con datos de ejemplo:**
```bash
npm run db:seed
```

### 4. Configurar Clerk Webhooks

1. En el dashboard de Clerk, ve a "Webhooks"
2. Agrega un nuevo webhook endpoint:
   - URL: `https://tu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`, `user.deleted`
3. Copia el signing secret:
```env
CLERK_WEBHOOK_SECRET="whsec_..."
```

### 5. Configurar Roles en Clerk

En el dashboard de Clerk, configura el schema de metadata:

```json
{
  "publicMetadata": {
    "role": "client",
    "agencyId": null,
    "teamId": null
  }
}
```

### 6. Testear Conexiones

```bash
npm run test:connections
```

Este comando verificará:
- ✅ Conexión a PostgreSQL
- ✅ Conexión a Redis
- ✅ Configuración básica

### 7. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter
- `npm run db:generate` - Genera cliente de Prisma
- `npm run db:push` - Sincroniza schema con BD
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:seed` - Pobla BD con datos de ejemplo
- `npm run test:connections` - Testa conexiones
- `npm run type-check` - Verifica tipos TypeScript

## 🔧 Configuración Adicional

### PostGIS (Opcional pero Recomendado)

Para búsquedas geoespaciales avanzadas:

```sql
-- En tu base de datos PostgreSQL
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Redis Configuración Avanzada

Para producción, considera configurar Redis con:
- Persistencia habilitada
- Autenticación con password
- Configuración de memoria límite

### Clerk Configuración Avanzada

1. **Personalizar flujos de autenticación**
2. **Configurar metadata adicional**
3. **Habilitar autenticación social**

## 📊 Datos de Ejemplo

Después del seed, tendrás:
- ✅ 1 Agencia: "Inmobiliaria Demo"
- ✅ 1 Agente: agente@demo.com
- ✅ 1 Edificio: "Torre Ejemplo"
- ✅ 3 Propiedades variadas

## 🚨 Solución de Problemas

### Error de Conexión a PostgreSQL
```bash
# Verifica que PostgreSQL esté corriendo
pg_ctl status

# Verifica la URL de conexión
echo $DATABASE_URL
```

### Error de Conexión a Redis
```bash
# Verifica que Redis esté corriendo
redis-cli ping

# Debería responder: PONG
```

### Error en Clerk Webhooks
1. Verifica que el endpoint esté público
2. Confirma que el signing secret sea correcto
3. Revisa los logs en el dashboard de Clerk

### Error en Prisma
```bash
# Regenera el cliente
npm run db:generate

# Reinicia el schema
npm run db:push
```

## 📚 Próximos Pasos

Una vez completado el setup:

1. **Fase 1**: Implementar páginas principales
2. **Fase 2**: Desarrollar componentes de búsqueda
3. **Fase 3**: Crear dashboard de agentes
4. **Fase 4**: Implementar sistema de leads

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en la consola
2. Verifica todas las variables de entorno
3. Ejecuta `npm run test:connections`
4. Consulta la documentación oficial de cada servicio

---

¡Ya tienes la plataforma inmobiliaria lista para desarrollar! 🎉