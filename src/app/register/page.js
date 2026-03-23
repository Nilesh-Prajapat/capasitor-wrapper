"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { registerUser } from '@/utils/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', petName: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData.name, formData.email, formData.petName, formData.password);
      router.push('/login');
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="auth-card">
        <div>
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Join the Midnight Curator.</p>
        </div>

        {error && <div style={{ color: 'var(--error)', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <form className="form-group" onSubmit={handleRegister}>
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
          <Input
            label="Pet Name"
            name="petName"
            type="text"
            value={formData.petName}
            onChange={handleChange}
            required
            placeholder="Shadow"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login" className="subtitle">Already have an account? <span style={{ color: 'var(--primary)' }}>Log In</span></Link>
        </div>
      </div>
    </div>
  );
}
