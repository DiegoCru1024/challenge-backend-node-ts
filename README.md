# Backend Node TS - Challenge

## Stack

- **Node.js** con **TypeScript**
- **Express.js** como framework web
- **GraphQL** con Apollo Server para APIs
- **MongoDB** como base de datos
- **Logging** estructurado con Pino
- **Validaciones** con Zod
- **Formateo de código** con Prettier

## Instalación

### 1. Instala las dependencias:
```bash
npm install
```

### 2. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.test`:
```bash
cp .env.test .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Aplicación:
PORT=3000

# Base de datos MongoDB:
MONGODB_URL_ACCOUNTS='mongodb://localhost:27017/eiAccounts'
MONGODB_URL_PRODUCTS='mongodb://localhost:27017/eiBusiness'

# Odoo (opcional):
ODOO_URL='http://localhost:8069'
ODOO_DB='tu_base_de_datos'
ODOO_UID='tu_usuario_id'
ODOO_PASSWORD='tu_contraseña'

# Logging (opcional):
LOG_LEVEL=info
```

### 3. Ejecuta la aplicación:

```bash
npm run dev
```

## Acceso a la API

Una vez que el servidor esté ejecutándose, podrás acceder a:

- **GraphQL Playground:** `http://localhost:3000/graphql`
- **Servidor:** `http://localhost:3000`

## Estructura del Proyecto

```
server/
├── app.ts                 # Punto de entrada de la aplicación
├── config/               # Configuraciones
│   ├── app.ts           # Configuración principal
│   └── logger.ts        # Configuración de logging
├── db/                  # Conexiones a base de datos
│   └── mongodb.ts       # Configuración de MongoDB
├── graphql/             # Esquemas y resolvers de GraphQL
│   ├── accounts/        # Módulo de cuentas
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   ├── products/        # Módulo de productos
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   ├── root/           # Esquema raíz
│   │   └── index.ts
│   └── index.ts        # Configuración de Apollo Server
├── interfaces/          # Interfaces de TypeScript
│   ├── account.ts      # IAccount
│   └── product.ts      # IProduct
├── models/             # Modelos de datos
│   ├── accounts.ts
│   └── products.ts
├── repositories/       # Capa de acceso a datos
│   ├── accounts.repository.ts
│   └── products.repository.ts
├── services/           # Servicios externos
│   └── odoo.ts        # Integración con Odoo
├── utils/              # Utilidades
│   └── logger.utils.ts
└── validations/        # Esquemas de validación
    ├── accounts.validations.ts
    └── products.validations.ts
```