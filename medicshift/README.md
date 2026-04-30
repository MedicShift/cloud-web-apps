# MedicShift Backend

MedicShift is a production-ready, enterprise-grade NestJS backend designed for hospital nurse scheduling and management. It is built using **CQRS (Command Query Responsibility Segregation)** architecture, following **SOLID** principles to ensure scalability and maintainability.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Docker** and **Docker Compose**

### 2. Environment Setup
Clone the repository and create your local environment file:
```bash
cp .env.example .env
```
*Note: The default values in `.env.example` are pre-configured to work perfectly with the Docker Compose setup.*

### 3. Spin up Infrastructure
Start the PostgreSQL and Redis services using Docker:
```bash
docker-compose up -d
```

### 4. Install & Run
```bash
# Install dependencies
npm install

# Run in development mode (watch mode)
npm run start:dev
```
The API will be available at `http://localhost:3000`.

---

## 📚 API Documentation

Once the application is running, you can explore and test the API via Swagger:
- **Swagger UI**: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Architecture**: CQRS, SOLID, Multi-tenant ready.
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/).
- **Cache/Health**: Redis.
- **Security**: 
  - JWT Authentication (Access + Refresh Tokens)
  - RBAC (Role Based Access Control)
  - Argon2/Bcrypt Password Hashing with Pepper
  - Account Lockout Logic
  - Helmet.js & Rate Limiting
- **Logging**: [Pino](https://github.com/pinojs/pino) (Structured JSON logging).

---

## 🗄 Database & Migrations

- **Development**: In development mode, TypeORM is configured to `synchronize: true`. Tables are created automatically based on your entity definitions when the app starts.
- **Production**: Synchronize is disabled for safety. Database changes should be managed via TypeORM migrations.
npm run migration:generate -- src/database/migrations/InitialSchema
npm run migration:run


---

## ⌨️ Available Commands

| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Starts the app in watch mode for development. |
| `npm run build` | Compiles the TypeScript code to JavaScript. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run format` | Formats the entire codebase using Prettier. |
| `npm run test` | Executes unit tests. |
| `npm run test:e2e` | Executes end-to-end tests. |

---

## 🏗 Project Structure

```text
src/
├── common/          # Shared decorators, guards, filters, and interceptors
├── config/          # Type-safe configuration management
├── modules/
│   ├── auth/        # Authentication & Token management
│   ├── users/       # User profiles & Role management
│   ├── hospitals/   # Multi-tenant hospital management
│   ├── departments/ # Hospital department management
│   ├── shifts/      # Shift definitions
│   └── schedules/   # Shift scheduling & Generation logic
└── main.ts          # Application entry point
```

---

## 📄 License
MedicShift is [UNLICENSED](LICENSE).
