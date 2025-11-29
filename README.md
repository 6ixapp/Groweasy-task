# GrowEasy

A full-stack task management application with a React Native Expo frontend and FastAPI Python backend.

## 🚀 Features

- ✅ User authentication (Email/Password + Google OAuth)
- ✅ Task management (Create, Read, Update, Delete)
- ✅ Task completion tracking
- ✅ Beautiful animated UI
- ✅ Dark/Light theme support
- ✅ Responsive design
- ✅ Onboarding flow

## 📁 Project Structure

```
GrowEasy/
├── backend/                 # FastAPI Python backend
│   ├── app/                 # Application code
│   │   ├── routers/         # API routes (auth, todos, users)
│   │   └── main.py          # FastAPI app entry
│   ├── prisma/              # Database schema
│   └── README.md            # Backend setup guide
│
├── frontend/
│   └── my-app/              # React Native Expo app
│       ├── app/             # Screens (file-based routing)
│       ├── components/      # Reusable components
│       ├── utils/           # Utilities and hooks
│       └── README.md        # Frontend setup guide
│
└── README.md                # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Prisma Postgres)
- **ORM**: Prisma (Python client)
- **Auth**: JWT + bcrypt
- **Server**: Uvicorn

### Frontend
- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router
- **State**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: React Native Reanimated

## 🏁 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Expo Go app (for mobile testing)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/GrowEasy.git
cd GrowEasy/WORK
```

### 2. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup database (see backend/README.md for options)
prisma generate
prisma migrate dev --name init

# Create .env file with your DATABASE_URL
# Run server
python run.py
```

### 3. Setup Frontend
```bash
cd frontend/my-app

# Install dependencies
npm install

# Create .env file
echo "EXPO_PUBLIC_API_URL=http://YOUR_IP:8000" > .env

# Start Expo
npx expo start
```

### 4. Test on Device
1. Install Expo Go on your phone
2. Scan the QR code from the terminal
3. Make sure phone and computer are on same WiFi

## 📖 Documentation

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/my-app/README.md)

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Login |
| POST | `/auth/google` | Google OAuth |
| GET | `/auth/me` | Get current user |
| GET | `/todos/` | Get all todos |
| POST | `/todos/` | Create todo |
| PATCH | `/todos/{id}` | Update todo |
| DELETE | `/todos/{id}` | Delete todo |

## 📄 License

MIT
