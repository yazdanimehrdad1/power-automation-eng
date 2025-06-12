# PAE Site Collector

A Node.js application for managing sites and assets with caching capabilities.

## 🚀 Features

- Site and Asset management through REST API
- PostgreSQL database with Prisma ORM
- Redis caching layer
- Docker containerization
- TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Redis (via Homebrew for local development)
- PostgreSQL (handled by Docker)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pae_site_collector
   ```

2. **Install dependencies - local development**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sitecontroller
   REDIS_URL=redis://localhost:6379
   contact admin for the env file
   ```

4. **Start the services**
   ```bash
   # Start all services with Docker
   docker-compose up -d or make up

   # Or start services individually for development:
   brew services start redis    # Start Redis
   npm run start               # Start the application
   ```

## 🏗 Project Structure

```
src/
├── config/
│   ├── redis.ts         # Redis configuration
│   └── prisma.ts        # Prisma configuration
├── services/
│   ├── site.service.ts  # Site management with caching
│   └── asset.service.ts # Asset management with caching
├── utils/
│   ├── redis.utils.ts   # Redis utility functions
│   └── cache.decorator.ts # Caching decorator
└── index.ts            # Application entry point
```

## 💾 Database Schema

### Site Model
```prisma
model Site {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  name      String    @unique
  address   String
  assets    Asset[]
}
```

### Asset Model
```prisma
model Asset {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  assetType   String
  belongsTo   Site?    @relation(fields: [belongsToId], references: [id])
  belongsToId String?
}
```

## 🔄 Caching System

The application implements a multi-layer caching system using Redis:

1. **Database Query Caching**
   - Automatic caching of read operations
   - Cache invalidation on write operations
   - Configurable TTL per query type

2. **Cache Usage Example**
   ```typescript
   // Using the cache decorator
   @Cache({ keyPrefix: 'sites', ttl: 3600 })
   async getAllSites(): Promise<Site[]> {
     return this.prisma.site.findMany();
   }
   ```

## 🐳 Docker Configuration

The application uses Docker Compose to manage multiple services:

- **PostgreSQL**: Main database
- **Redis**: Caching layer
- **Application**: Node.js service

To manage Docker volumes:
```bash
# Stop all containers
docker-compose down

# Remove all volumes
docker volume prune -f

# Rebuild and start
docker-compose up -d --build
```

## 🔧 Development

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Start Development Server**
   ```bash
   npm run start
   ```

4. **Access Prisma Studio**
   ```bash
   npm run studio
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Sites Endpoints

- `GET /sites` - Get all sites
- `GET /sites/:id` - Get site by ID
- `POST /sites` - Create new site
- `PUT /sites/:id` - Update site
- `DELETE /sites/:id` - Delete site

### Assets Endpoints

- `GET /assets` - Get all assets
- `GET /assets/:id` - Get asset by ID
- `GET /assets/site/:siteId` - Get assets by site ID
- `POST /assets` - Create new asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

## 🔐 Environment Variables

| Variable      | Description           | Default Value |
|---------------|-----------------------|---------------|
| DATABASE_URL  | PostgreSQL connection | postgresql://postgres:postgres@localhost:5432/sitecontroller |
| REDIS_URL     | Redis connection      | redis://localhost:6379 |
| PORT          | Application port      | 3000 |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

