"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/utils/auth';
import Button from '@/components/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.replace('/login');
      } else {
        setMounted(true);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    router.replace('/login');
  };

  if (!mounted) return null;

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="welcome-title">Welcome, Curator</h1>
        <Button variant="danger" className="logout-btn" onClick={handleLogout}>Logout</Button>
      </header>

      <main>
        <div className="card">
          <h2 className="card-title">Companion Activity</h2>
          <p className="card-content">
            Your companion <strong>Shadow</strong> has been resting in the void.
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Recent Artifacts</h2>
          <p className="card-content">
            No new artifacts discovered recently.
          </p>
        </div>
      </main>
    </div>
  );
}
