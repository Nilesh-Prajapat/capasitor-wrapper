"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
      setMounted(true);
    }
    checkAuth();
  }, [router]);

  if (!mounted) {
    return (
      <div className="container">
        <div className="subtitle">Loading...</div>
      </div>
    );
  }

  return null;
}
