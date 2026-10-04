# Fullstack GCP — Plataforma de Métricas de Marketing

Dashboard de métricas de marketing digital desplegado en Google Cloud Platform. Proyecto de portafolio que demuestra arquitectura fullstack de punta a punta: desde el diseño de la base de datos hasta el despliegue en la nube.

## Arquitectura

```
Frontend (React + Vite + Tailwind)
        Firebase Hosting — CDN estático
              ↓ HTTP
Backend (Node.js + Express + Prisma ORM)
        Cloud Run — contenedor Docker, escala a cero
              ↓ TCP
Base de datos (PostgreSQL)
        Cloud SQL — instancia db-f1-micro
```

### Decisiones de diseño

**¿Por qué frontend y backend separados?**
Cambian a ritmos distintos y escalan distinto. El frontend son archivos estáticos servidos por CDN; el backend concentra la lógica de negocio y las credenciales. El frontend nunca habla directo con la base de datos.

**¿Por qué Docker solo en el backend?**
Cloud Run ejecuta contenedores. El frontend compilado (HTML/JS/CSS) no necesita servidor — Firebase Hosting lo sirve directo desde el CDN.

**¿Por qué PostgreSQL?**
La herramienta agrupa por día, canal y campaña y calcula agregaciones (ROAS, CTR). Postgres tiene mejor soporte para consultas analíticas: window functions, CTEs, tipos JSONB.

**¿Cómo se manejan las credenciales?**
En desarrollo: archivo `.env` ignorado por Git. En producción: Secret Manager inyecta `DATABASE_URL` como variable de entorno al contenedor en Cloud Run — mismo concepto, distinto mecanismo.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express + Prisma ORM |
| Base de datos | PostgreSQL 16 |
| Contenedor | Docker |
| Deploy frontend | Firebase Hosting |
| Deploy backend | Cloud Run |
| Base de datos nube | Cloud SQL |
| Credenciales | Secret Manager |
| Registro de imágenes | Artifact Registry |

## Estructura del proyecto

```
fullstack-gcp-bf/
├── backend/
│   ├── src/
│   │   ├── routes/        # define las URLs de la API
│   │   ├── controllers/   # maneja req/res
│   │   ├── services/      # lógica de negocio (ROAS, CTR, agrupaciones)
│   │   └── middlewares/   # manejo global de errores
│   ├── prisma/
│   │   ├── schema.prisma  # modelos Campaign y DailyMetric
│   │   └── seed.js        # datos de ejemplo
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── components/    # componentes reutilizables
│       ├── pages/         # Dashboard, Campaigns
│       ├── hooks/         # useMetrics, useCampaigns
│       └── services/      # llamadas a la API
├── docker-compose.yml     # Postgres local para desarrollo
└── .gitignore
```

## Correr localmente

**Requisitos:** Node.js 20+, Docker Desktop

```bash
# 1. Levantar la base de datos local
docker compose up -d

# 2. Instalar dependencias del backend
cd backend && npm install

# 3. Crear las tablas
npm run db:migrate

# 4. Cargar datos de ejemplo
npm run db:seed

# 5. Levantar el backend
npm run dev
```

El backend queda disponible en `http://localhost:3000`.

## API endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servidor |
| GET | `/api/campaigns` | Lista todas las campañas |
| GET | `/api/campaigns/:id` | Detalle de una campaña |
| GET | `/api/metrics?campaignId=&from=&to=` | Métricas diarias filtradas |
| GET | `/api/metrics/summary` | Resumen con ROAS y CTR por campaña |

## Costos en GCP

| Servicio | Costo mensual |
|---|---|
| Cloud SQL (db-f1-micro) | USD 8–11 |
| Cloud Run | USD 0 (2M requests gratis) |
| Firebase Hosting | USD 0 (10 GB gratis) |
| Secret Manager | USD 0 (6 secretos gratis) |
| Artifact Registry | USD 0 (500 MB gratis) |
| **Total** | **~USD 8–11/mes** |
