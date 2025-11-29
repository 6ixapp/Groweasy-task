# GrowEasy Backend

A FastAPI backend with Prisma ORM and PostgreSQL database for the GrowEasy todo app.

## Tech Stack

- **Framework**: FastAPI
- **Database ORM**: Prisma (Python client)
- **Database**: PostgreSQL (Prisma Postgres)
- **Authentication**: JWT tokens + bcrypt password hashing
- **Server**: Uvicorn

## Prerequisites

- Python 3.11+ (tested with Python 3.13)
- pip (Python package manager)

---

## Setup Guide

### Step 1: Create Virtual Environment

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# Windows (CMD):
.\.venv\Scripts\activate.bat

# macOS/Linux:
source .venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Database Setup

You have two options for the database:

#### Option A: Use Prisma Postgres (Cloud - Recommended)

1. **Login to Prisma**:
   ```bash
   npx prisma login
   ```

2. **Create a Prisma Postgres database**:
   - Go to [console.prisma.io](https://console.prisma.io)
   - Create a new project
   - Copy the connection string

3. **Update `.env` file**:
   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   ```

#### Option B: Use Local PostgreSQL

1. **Install PostgreSQL** on your machine

2. **Create a database**:
   ```sql
   CREATE DATABASE groweasy;
   ```

3. **Update `.env` file**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/groweasy"
   ```

#### Option C: Use SQLite (Quick Development)

1. **Modify `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

### Step 4: Generate Prisma Client

```bash
# Generate the Prisma Python client
prisma generate
```

### Step 5: Run Database Migrations

```bash
# Create and apply migrations
prisma migrate dev --name init
```

### Step 6: Configure Environment Variables

Create/update `.env` file in the backend folder:

```env
# Database
DATABASE_URL="your-database-connection-string"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
```

### Step 7: Run the Server

```bash
# Development mode with auto-reload
python run.py

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at: `http://localhost:8000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/google` | Login with Google OAuth |
| GET | `/auth/me` | Get current user info |

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos/` | Get all todos for user |
| POST | `/todos/` | Create new todo |
| PATCH | `/todos/{id}` | Update todo |
| DELETE | `/todos/{id}` | Delete todo |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |

---

## API Request Examples

### Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create Todo (with auth token)
```bash
curl -X POST http://localhost:8000/todos/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Buy groceries"}'
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── prisma_client.py     # Prisma client instance
│   └── routers/
│       ├── auth.py          # Authentication endpoints
│       ├── todos.py         # Todo CRUD endpoints
│       └── users.py         # User endpoints
├── prisma/
│   └── schema.prisma        # Database schema
├── prisma_client/           # Generated Prisma client
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
└── run.py                   # Server startup script
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String?  // nullable for social users
  googleId  String?  @unique
  createdAt DateTime @default(now())
  todos     Todo[]
}

model Todo {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## Troubleshooting

### Prisma client not found
```bash
prisma generate
```

### Database connection error
- Check your `DATABASE_URL` in `.env`
- Ensure database server is running
- Verify credentials are correct

### bcrypt errors on Python 3.13
The app uses direct bcrypt instead of passlib for compatibility. Ensure bcrypt is installed:
```bash
pip install bcrypt
```

---

## License

MIT
