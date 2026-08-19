'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
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
      
      {/* Minimal Sleek Auth Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-black hover:bg-red-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Emblem & Welcome Header */}
        <div className="text-center space-y-3 pt-2">
          <BrandLogo size="lg" className="mx-auto rounded-none border border-black" />
          <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
            {isSignUp ? 'JOIN BLISS BALANCE' : 'WELCOME TO BLISS BALANCE'}
          </h3>
          <p className="font-mono text-xs text-neutral-500 max-w-xs mx-auto font-bold">
            {isSignUp ? 'Create an account for express checkout' : 'Sign in to access your account & saved items'}
          </p>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-none bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-mono font-black text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Google Quick Sign-In */}
            <button
              onClick={handleGoogleAuth}
              className="w-full py-3.5 rounded-none bg-white dark:bg-black hover:bg-neutral-100 text-neutral-900 dark:text-white font-mono font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 border-2 border-neutral-900 dark:border-neutral-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t-2 border-neutral-200 dark:border-neutral-800 w-full" />
              <span className="bg-white dark:bg-black px-3 text-[10px] font-mono text-neutral-400 uppercase font-black">OR EMAIL SIGN IN</span>
            </div>

            {error && (
              <div className="p-3.5 rounded-none bg-red-50 dark:bg-red-950 border-2 border-red-600 text-red-600 text-xs font-mono font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-700 rounded-none pl-10 pr-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-700 rounded-none pl-10 pr-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-none bg-red-600 hover:bg-black text-white font-mono font-black text-xs uppercase tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>{loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'LOGIN / SIGNUP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs font-mono text-neutral-500 font-bold">
              {isSignUp ? (
                <span>
                  Already registered?{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-red-600 font-black underline uppercase">
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  New to Bliss Balance?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-red-600 font-black underline uppercase">
                    Create Account
                  </button>
                </span>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
