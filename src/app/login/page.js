"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { loginUser } from '@/utils/api';
import { setToken } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (data && data.token) {
        await setToken(data.token);
        router.push('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div>
          <h1 className="title">TaskFlow</h1>
          <p className="subtitle">Enter the void.</p>
        </div>

        {error && <div style={{ color: 'var(--error)', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}

        <form className="form-group" onSubmit={handleLogin}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="curator@midnight.io"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link href="/register" className="subtitle">New here? <span style={{ color: 'var(--primary)' }}>Sign Up</span></Link>
        </div>
      </div>
    </div>
  );
}
