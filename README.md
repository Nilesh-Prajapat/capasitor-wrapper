# Capacitor Biometric Auth Demo

A simple Next.js frontend wrapped in Capacitor, featuring secure biometric login (Face ID/Touch ID) and background privacy protection.

---

## 🚀 Setup Instructions

1. **Environment Setup**
   Create a `.env` file in the root directory:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Next.js App**
   *(This exports static HTML/JS/CSS to the `out/` folder)*
   ```bash
   npm run build
   ```

4. **Add Native Platform** (First time only)
   *(This initializes the native Android folder)*
   ```bash
   npx cap add android
   ```

5. **Sync with Capacitor**
   *(This copies the `out/` folder into the native Android/iOS projects)*
   ```bash
   npx cap sync
   ```

6. **Run on Android**
   *(Requires Android Studio & SDKs)*
   ```bash
   npx cap run android
   ```

**To run in browser for web development:**
```bash
npm run dev
```

---

## 🔒 How Biometric Auth Works

The app implements a **BiometricGuard** component that manages security:

1. **Check Biometry**: On launch, the app verifies if biometrics (Face/Fingerprint) or device credentials (PIN/Pattern) are available.
2. **Authenticate**: It prompts the user natively. If successful, the app unlocks.
3. **Background Privacy**: By listening to Capacitor's `appStateChange` event, the app instantly locks itself the moment the user sends it to the background. 
4. **Resume Protection**: When returning to the foreground, the biometric prompt automatically re-triggers to prove the user's identity again before revealing the screen.

---

## 📦 Capacitor Plugins Used

- **`@aparajita/capacitor-biometric-auth`**: Handles the native biometric prompt (Face, Fingerprint, Iris) and secure device credential fallback (PIN/Pattern).
- **`@aparajita/capacitor-secure-storage`**: Safely stores authentication tokens in the device's native secure enclave (Keychain/Keystore).
- **`@capacitor-community/privacy-screen`**: Prevents the OS from taking screenshots of the app while it sits in the "Recent Apps" app switcher.
- **`@capacitor/app`**: Listens for app state changes (foreground vs. background) to know when to lock the app.
