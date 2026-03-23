"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { App } from '@capacitor/app';
import { BiometricAuth, AndroidBiometryStrength } from '@aparajita/capacitor-biometric-auth';
import { isAuthenticated, removeToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function BiometricGuard({ children }) {
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();
  const isPrompting = useRef(false);

  const checkBiometric = useCallback(async () => {
    // Prevent infinite loop if the system dialog fires appStateChange: true
    if (isPrompting.current) return;
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      setIsLocked(false);
      return;
    }

    try {
      const info = await BiometricAuth.checkBiometry();
      
      // If biometry is available OR device has a passcode/PIN/Pattern
      if (info && (info.isAvailable || info.deviceIsSecure)) {
        setIsLocked(true); 
        isPrompting.current = true;
        await BiometricAuth.authenticate({
          reason: 'Authenticate to access your dashboard',
          cancelTitle: 'Cancel',
          allowDeviceCredential: true, // Allow PIN/Pattern fallback
          androidBiometryStrength: AndroidBiometryStrength.weak // Explicitly allow Face/Iris unlock too
        });
        
        setIsLocked(false);
        // Delay resetting the prompting flag to absorb the delayed appStateChange event
        setTimeout(() => {
          isPrompting.current = false;
        }, 1000);
      } else {
        // Device is completely unsecured (no lock screen at all)
        setIsLocked(false);
      }
    } catch (err) {
      console.warn("Biometric verification failed/canceled", err);
      // Keep locked if they cancel
      setIsLocked(true); 
      setTimeout(() => {
        isPrompting.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Delay initial check slightly to allow framework routing if needed, though use client handles this mostly.
    checkBiometric();

    // Listen to capacitor app state changes
    const listener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        // Only check biometrics when returning to foreground IF we aren't already prompting
        if (!isPrompting.current) {
          checkBiometric();
        }
      } else {
        // App goes to background -> lock immediately to hide content
        // (This does not prevent OS screenshots, that requires privacy-screen plugin)
        setIsLocked(true);
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [checkBiometric]);

  const handleLogout = async () => {
    await removeToken();
    setIsLocked(false);
    router.replace('/login');
  };

  if (isLocked) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
        <h1 className="title" style={{ marginBottom: '2rem' }}>App Locked</h1>
        <Button onClick={checkBiometric}>Unlock with Biometrics</Button>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="secondary" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    );
  }

  return children;
}
