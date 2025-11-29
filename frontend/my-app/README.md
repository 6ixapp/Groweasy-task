# GrowEasy Frontend

A React Native Expo app for task management with beautiful UI and smooth animations.

---

## App Assets

### App Icon
<p align="center">
  <img src="./assets/images/icon.png" alt="App Icon" width="128" height="128" />
</p>

### Splash Screen Icon
<p align="center">
  <img src="./assets/images/splash-icon.png" alt="Splash Icon" width="200" />
</p>

### Android Adaptive Icons
| Background | Foreground | Monochrome |
|:----------:|:----------:|:----------:|
| <img src="./assets/images/android-icon-background.png" alt="Android Background" width="100" /> | <img src="./assets/images/android-icon-foreground.png" alt="Android Foreground" width="100" /> | <img src="./assets/images/android-icon-monochrome.png" alt="Android Monochrome" width="100" /> |

### Favicon
<p align="center">
  <img src="./assets/images/favicon.png" alt="Favicon" width="48" />
</p>

---

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: React Native Reanimated
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo Go app on your mobile device (for testing)
- Backend server running (see backend README)

---

## Setup Guide

### Step 1: Install Dependencies

```bash
# Navigate to frontend folder
cd frontend/my-app

# Install dependencies
npm install
```

### Step 2: Configure Environment

Create/update `.env` file in the `frontend/my-app` folder:

```env
# API URL - Use your local IP for mobile testing
# Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000

# Example:
# EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

**Important**: Use your computer's local IP address (not `localhost`) when testing on a physical device with Expo Go.

#### Finding Your Local IP:

**Windows (PowerShell)**:
```powershell
ipconfig | Select-String "IPv4"
```

**macOS/Linux**:
```bash
ifconfig | grep "inet "
```

### Step 3: Configure Google OAuth (Optional)

If you want Google Sign-In, add these to your `.env`:

```env
# Google OAuth Client IDs from Google Cloud Console
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
```

**To get Google OAuth credentials**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client IDs for Web, Android, and iOS

### Step 4: Start the Development Server

```bash
# Start Expo development server
npx expo start
```

### Step 5: Run on Device

1. **Install Expo Go** on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code** shown in your terminal with:
   - iOS: Camera app
   - Android: Expo Go app

3. **Make sure**:
   - Your phone and computer are on the same WiFi network
   - The backend server is running on port 8000

---

## Running Options

```bash
# Start Expo with options
npx expo start

# Press in terminal:
# a - Open on Android emulator
# i - Open on iOS simulator  
# w - Open in web browser
# r - Reload app
# j - Open debugger
```

### Run on Specific Platform

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

---

## Project Structure

```
frontend/my-app/
├── app/                     # File-based routing (screens)
│   ├── _layout.tsx          # Root layout with auth guard
│   ├── index.tsx            # Landing page
│   ├── onboarding.tsx       # Onboarding flow
│   ├── auth/
│   │   ├── login.tsx        # Login screen
│   │   └── signup.tsx       # Signup screen
│   └── (tabs)/              # Tab-based navigation
│       ├── _layout.tsx      # Tab layout
│       ├── index.tsx        # Dashboard (home tab)
│       ├── calendar.tsx     # Calendar tab
│       ├── stats.tsx        # Statistics tab
│       └── profile.tsx      # Profile tab
├── components/              # Reusable components
├── constants/
│   └── config.ts            # API configuration
├── contexts/
│   └── ThemeContext.tsx     # Theme provider
├── hooks/                   # Custom hooks
├── utils/
│   └── auth/
│       ├── useAuth.ts       # Auth state management
│       └── useGoogleAuth.ts # Google OAuth hook
├── assets/                  # Images, fonts
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

---

## Features

- ✅ Email/Password Authentication
- ✅ Google OAuth (optional)
- ✅ Onboarding flow
- ✅ Task management (CRUD)
- ✅ Task completion toggle
- ✅ Task deletion
- ✅ Dark/Light theme support
- ✅ Responsive design
- ✅ Animated UI
- ✅ Pull-to-refresh

---

## Connecting to Backend

The app connects to the backend via the `EXPO_PUBLIC_API_URL` environment variable.

**Development Setup**:
1. Start the backend: `python run.py` (in backend folder)
2. Note your local IP address
3. Update `.env` with: `EXPO_PUBLIC_API_URL=http://YOUR_IP:8000`
4. Start frontend: `npx expo start`

**Troubleshooting Connection Issues**:

1. **Network Error**:
   - Ensure phone and computer are on same WiFi
   - Check firewall isn't blocking port 8000
   - Verify backend is running with `--host 0.0.0.0`

2. **Cannot connect to localhost**:
   - Use your computer's local IP, not `localhost`
   - `localhost` on phone refers to the phone itself

3. **Timeout errors**:
   - Check if backend is responding: `curl http://YOUR_IP:8000`

---

## Building for Production

### Create Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Create Production APK/IPA

```bash
# Android APK
eas build --platform android --profile production

# iOS IPA
eas build --platform ios --profile production
```

---

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### Dependency issues
```bash
rm -rf node_modules
npm install
```

### Expo Go not connecting
- Clear Expo Go app cache
- Restart development server
- Check WiFi connection

### TypeScript errors
```bash
npx tsc --noEmit
```

---

## License

MIT
