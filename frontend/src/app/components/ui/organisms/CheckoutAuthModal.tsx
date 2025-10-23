'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from '@/styles/auth-modal.module.css';

interface CheckoutAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function ModalContent({ isOpen, onClose, onSuccess }: CheckoutAuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [adminMode, setAdminMode] = useState(false); // ← new
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loggedInUser: { role: 'admin' | 'customer' } | null = null;

      if (mode === 'register') {
        if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');

        loggedInUser = await register(formData.name, formData.email, formData.password);
      } else {
        loggedInUser = await login(formData.email, formData.password);
      }

      // If admin sign-in is requested, enforce admin role
      if (adminMode && loggedInUser?.role !== 'admin') {
        setError('This account is not an admin.');
        setLoading(false);
        return;
      }

      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>

        <div className={styles.header}>
          <h2 className={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className={styles.subtitle}>
            {mode === 'login' ? 'Sign in to complete your order' : 'Create an account to place your order'}
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label htmlFor="auth-name" className={styles.label}>Full Name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="auth-email" className={styles.label}>Email Address</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="auth-password" className={styles.label}>Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className={styles.input}
              placeholder="••••••••"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            {mode === 'register' && <p className={styles.hint}>Must be at least 6 characters</p>}
          </div>

          {mode === 'register' && (
            <div className={styles.field}>
              <label htmlFor="auth-confirm" className={styles.label}>Confirm Password</label>
              <input
                id="auth-confirm"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={styles.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Admin sign-in toggle (non-invasive UI) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <input
              id="auth-admin"
              type="checkbox"
              checked={adminMode}
              onChange={(e) => setAdminMode(e.target.checked)}
            />
            <label htmlFor="auth-admin" className={styles.label} style={{ margin: 0 }}>
              Admin sign-in
            </label>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.switcher}>
          <p>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" className={styles.linkButton} onClick={switchMode}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutAuthModal(props: CheckoutAuthModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<ModalContent {...props} />, document.body);
}
