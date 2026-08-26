'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Signed in successfully!');
      }
      setLoading(false);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      setSuccessMsg('Signed in with Google!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      
      {/* Sleek Auth Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-black border-2 border-black dark:border-white p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <BrandLogo size="lg" className="mx-auto" />
          <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
            {isSignUp ? 'JOIN BLISS BALANCE' : 'BLISS BALANCE ACCOUNT'}
          </h3>
          <p className="font-mono text-xs text-neutral-500 max-w-xs mx-auto font-bold">
            {isSignUp ? 'Create an account for express checkout' : 'Sign in to access your orders & saved wishlist'}
          </p>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-mono font-black text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-500 text-red-700 dark:text-red-300 text-xs font-mono font-bold">
                {error}
              </div>
            )}

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full py-3.5 px-4 border-2 border-black dark:border-white bg-white dark:bg-black text-neutral-950 dark:text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">OR EMAIL</span>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Email Address</label>
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5">
                  <Mail className="w-4 h-4 text-neutral-400 mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-transparent text-xs text-neutral-950 dark:text-white font-mono focus:outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Password</label>
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5">
                  <Lock className="w-4 h-4 text-neutral-400 mr-2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs text-neutral-950 dark:text-white font-mono focus:outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-black hover:bg-[#E5FF00] hover:text-black text-white font-heading font-black text-xs uppercase tracking-widest transition-all border-2 border-black dark:border-white disabled:opacity-50"
              >
                {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-xs font-mono font-bold uppercase text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Join Now"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
