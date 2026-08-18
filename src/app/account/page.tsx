'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { BrandLogo } from '@/components/BrandLogo';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { Mail, Lock, LogOut, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl bg-white dark:bg-black rounded-none border-2 border-neutral-900 dark:border-neutral-100 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] p-8 sm:p-10 space-y-8">
          
          {/* Header Emblem & Title */}
          <div className="text-center space-y-3">
            <BrandLogo size="lg" className="mx-auto rounded-none border border-black shadow-sm" />
            <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              {currentUser ? 'MY ACCOUNT' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </h1>
            <p className="font-mono text-xs text-neutral-500 max-w-sm mx-auto font-bold">
              {currentUser
                ? 'Manage your Bliss Balance account profile and preferences'
                : 'Access your account to view saved footwear collections & express checkout'}
            </p>
          </div>

          {/* LOGGED IN ACCOUNT DASHBOARD */}
          {currentUser ? (
            <div className="space-y-6 pt-2">
              <div className="p-6 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-none bg-red-600 text-white flex items-center justify-center font-heading text-2xl font-black border border-black shadow-md">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-black text-neutral-950 dark:text-white uppercase">
                      {currentUser.displayName || 'BLISS BALANCE MEMBER'}
                    </h3>
                    <p className="font-mono text-xs text-red-600 font-black">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs font-mono font-bold">
                  <div>
                    <span className="block text-neutral-400 text-[10px] uppercase font-black">Account Status</span>
                    <span className="font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Member
                    </span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 text-[10px] uppercase font-black">Member Perks</span>
                    <span className="font-black text-neutral-900 dark:text-white flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free Express Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <Link
                  href="/collections"
                  className="p-4 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border-2 border-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-between font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>BROWSE CATALOG</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-4 rounded-none bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center justify-between font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>SIGN OUT</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* PROFESSIONAL SIGN IN / REGISTER FORM */
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-none border-2 border-neutral-900 dark:border-neutral-800">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`py-2.5 rounded-none font-mono text-xs font-black uppercase tracking-wider transition-all border ${
                    !isSignUp ? 'bg-red-600 text-white border-red-600 shadow-md' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`py-2.5 rounded-none font-mono text-xs font-black uppercase tracking-wider transition-all border ${
                    isSignUp ? 'bg-red-600 text-white border-red-600 shadow-md' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-none bg-red-50 dark:bg-red-950 border-2 border-red-600 text-red-600 text-xs font-mono font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google One-Click Sign In */}
              <button
                onClick={handleGoogleAuth}
                className="w-full py-3.5 rounded-none bg-white dark:bg-black hover:bg-neutral-100 text-neutral-900 dark:text-white font-mono font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 border-2 border-neutral-900 dark:border-neutral-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
                <span className="bg-white dark:bg-black px-3 text-[10px] font-mono text-neutral-400 uppercase font-black">OR EMAIL AUTH</span>
              </div>

              {/* Form Input */}
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
                  className="w-full py-4 rounded-none bg-red-600 hover:bg-black text-white font-mono font-black text-xs uppercase tracking-widest border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                </button>
              </form>

            </div>
          )}

        </div>
      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={[]} />
    </div>
  );
}
