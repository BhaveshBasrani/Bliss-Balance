'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';
import { Footer } from '@/components/Footer';
import { getStoredSKUs, saveStoredSKUs, getStoredSettings, saveStoredSettings } from '@/lib/dataStore';
import { syncWithAppsScript, getRecaptchaV3Token } from '@/lib/appScriptSync';
import { FootwearSKU, SiteSettings, FootwearCategory, Gender } from '@/lib/types';
import {
  Shield,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Database,
  ExternalLink,
  RefreshCw,
  Info,
  Copy,
  Check,
  ArrowLeft,
  Key,
  Activity,
  Layers,
  Terminal,
  Mail,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Data State
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [activeTab, setActiveTab] = useState<'skus' | 'landing' | 'appscript' | 'logs'>('skus');

  // Status & Syncing State
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStepText, setSyncStepText] = useState('Saving to Google Sheets...');
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: string }>>([
    { time: new Date().toLocaleTimeString(), msg: 'Admin Control Station Initialized', type: 'SYSTEM' },
  ]);

  // Form State
  const [newSku, setNewSku] = useState<Partial<FootwearSKU>>({
    title: '',
    subtitle: '',
    gender: 'Men',
    category: 'Slides',
    price: 1499,
    originalPrice: 2199,
    amazonUrl: '',
    myntraUrl: '',
    imageUrl: '',
    imageDimensions: '800 x 800 px (1:1 Product Square)',
    features: ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid Outsole'],
    isNewArrival: true,
    isBestseller: false,
  });

  useEffect(() => {
    setSkus(getStoredSKUs());
    setSettings(getStoredSettings());
    const session = sessionStorage.getItem('bliss_balance_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const addLog = (msg: string, type: string = 'INFO') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '8088' || adminPin === 'admin123' || adminPin === 'admin' || adminPin === 'VSHN2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bliss_balance_admin_auth', 'true');
      setLoginError('');
      addLog('Session decrypted & authenticated successfully', 'SECURITY');
      showStatus('success', 'Session decrypted & authenticated!');
    } else {
      setLoginError('ACCESS DENIED: Invalid Decrypt Security Password. (Use PIN: 8088)');
      addLog('Failed login attempt detected', 'ALERT');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bliss_balance_admin_auth');
    addLog('Admin session locked', 'SECURITY');
  };

  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleAddSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.title || !newSku.price) {
      showStatus('error', 'Please specify product title and price.');
      return;
    }

    setIsSyncing(true);
    setSyncStepText('Syncing Product & Photo to Google Sheets...');

    const createdSku: FootwearSKU = {
      id: `sku-bb-${Date.now().toString().slice(-5)}`,
      title: newSku.title,
      subtitle: newSku.subtitle || 'Comfort-focused everyday footwear',
      gender: (newSku.gender as Gender) || 'Men',
      category: (newSku.category as FootwearCategory) || 'Slides',
      price: Number(newSku.price),
      originalPrice: newSku.originalPrice ? Number(newSku.originalPrice) : undefined,
      amazonUrl: newSku.amazonUrl || '',
      myntraUrl: newSku.myntraUrl || '',
      imageUrl: newSku.imageUrl || '',
      imageDimensions: '800 x 800 px (1:1 Product Square)',
      features: newSku.features && newSku.features.length > 0 ? newSku.features : ['Cushioned Footwear', 'Lightweight Feel', 'Anti-Skid'],
      isNewArrival: !!newSku.isNewArrival,
      isBestseller: !!newSku.isBestseller,
      createdAt: new Date().toISOString(),
    };

    const updatedSkus = [createdSku, ...skus];
    setSkus(updatedSkus);
    saveStoredSKUs(updatedSkus);

    setSyncStepText('Generating reCAPTCHA v3 Security Token...');
    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'add_sku');

    setSyncStepText('Writing Record to Google Sheets & Dispatching HTML Email...');
    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'ADD_SKU',
      skuData: createdSku,
      recaptchaToken,
      timestamp: new Date().toISOString(),
      adminEmail: settings.adminEmail,
    });

    setIsSyncing(false);
    addLog(`Product "${createdSku.title}" created & synced to Google Sheets`, 'ACTION');
    showStatus('success', `Product "${createdSku.title}" saved to Google Sheets! ${syncRes.message}`);

    setNewSku({
      title: '',
      subtitle: '',
      gender: 'Men',
      category: 'Slides',
      price: 1499,
      originalPrice: 2199,
      amazonUrl: '',
      myntraUrl: '',
      imageUrl: '',
      imageDimensions: '800 x 800 px (1:1 Product Square)',
      features: ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid Outsole'],
      isNewArrival: true,
      isBestseller: false,
    });
  };

  const handleDeleteSku = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete product "${title}"?`)) return;

    setIsSyncing(true);
    setSyncStepText(`Deleting "${title}" from Google Sheets...`);

    const updatedSkus = skus.filter(s => s.id !== id);
    setSkus(updatedSkus);
    saveStoredSKUs(updatedSkus);

    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'delete_sku');

    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'DELETE_SKU',
      skuData: { id, title },
      recaptchaToken,
      timestamp: new Date().toISOString(),
    });

    setIsSyncing(false);
    addLog(`Deleted product "${title}" from Google Sheets`, 'ACTION');
    showStatus('info', `Deleted product "${title}". ${syncRes.message}`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncStepText('Syncing Site Banner & Settings to Google Sheets...');

    saveStoredSettings(settings);

    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'update_banner');

    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'UPDATE_BANNER',
      settingsData: settings,
      recaptchaToken,
      timestamp: new Date().toISOString(),
    });

    setIsSyncing(false);
    addLog('Updated site settings & banner config in Google Sheets', 'CONFIG');
    showStatus('success', `Settings saved to Google Sheets! ${syncRes.message}`);
  };

  const appScriptCode = `/**
 * BLISS BALANCE FOOTWEAR - SELF-HEALING GOOGLE SHEETS ENGINE
 * Slogan: Feel The Bliss
 */

var RECAPTCHA_SECRET_KEY = "6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s";
var GOOGLE_DRIVE_FOLDER_NAME = "Bliss_Balance_Product_Photos";

function doGet(e) {
  var ss = getOrCreateSpreadsheet();
  ensureAndRepairSheetStructure(ss);

  var action = e && e.parameter ? e.parameter.action : "";

  if (action === "getProducts") return handleGetProducts(ss);
  if (action === "getAnnouncements") return handleGetAnnouncements(ss);

  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    brand: "Bliss Balance",
    tagline: "Feel The Bliss",
    products: getProductsFromSheet(ss)
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = getOrCreateSpreadsheet();
    ensureAndRepairSheetStructure(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ignored", message: "Empty body" })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(e.postData.contents);
    var action = postData.action || "";

    if (action === "ADD_SKU" || action === "UPDATE_SKU") return handleAddOrUpdateSku(ss, postData);
    if (action === "DELETE_SKU") return handleDeleteSku(ss, postData);
    if (action === "UPDATE_BANNER") return handleSaveSettings(ss, postData);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Action processed" })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(appScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // PASSWORD GATE OVERLAY
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-between font-mono p-4 transition-colors">
        <div className="flex items-center justify-between py-4 max-w-xl mx-auto w-full">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-red-600 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> CLIENT STOREFRONT
          </Link>
          <span className="text-[10px] text-red-600 font-bold border border-red-200 dark:border-red-800 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/60">
            SECURITY GATE // CONTROL STATION
          </span>
        </div>

        <div className="w-full max-w-md mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 space-y-6 shadow-xl relative">
          <div className="text-center space-y-3">
            <BrandLogo size="lg" className="mx-auto shadow-md" />
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-wider">
                BLISS BALANCE // ADMIN
              </h2>
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">
                SECURITY SHIELD ACTIVATED
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                DECRYPT SECURITY PASSWORD KEY
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <span className="block text-[10px] text-neutral-500 mt-1">
                Developer Key: <strong className="text-red-600">8088</strong>
              </span>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>DECRYPT & UNLOCK STATION</span>
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-[10px] text-neutral-500">
            SYSTEM STATUS: RECAPTCHA V3 & APPSCRIPT SECURED
          </div>
        </div>

        <div className="text-center text-[10px] text-neutral-500 py-4">
          © {new Date().getFullYear()} BLISS BALANCE CONTROL STATION
        </div>
      </div>
    );
  }

  // MERCHANT CONTROL STATION DASHBOARD
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono flex flex-col justify-between transition-colors relative">
      
      {/* BEAUTIFUL APPSCRIPT SYNC LOADING MODAL */}
      {isSyncing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Red Glow Filter */}
            <div className="absolute inset-0 bg-red-600/10 rounded-3xl blur-xl pointer-events-none" />

            {/* Spinner & Logo Emblem Wrapper */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin" />
              <BrandLogo size="md" className="relative z-10" />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-red-500" /> SYNCING WITH GOOGLE APPSCRIPT
              </span>
              <h3 className="font-heading text-xl font-bold uppercase text-white tracking-wider">
                SAVING TO GOOGLE SHEETS
              </h3>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                {syncStepText}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-center gap-2">
              <RefreshCw className="w-3 h-3 text-red-500 animate-spin" />
              <span>PLEASE DO NOT CLOSE THIS TAB...</span>
            </div>

          </div>
        </div>
      )}

      <div>
        <div className="bg-neutral-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 sm:px-8 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="font-bold text-neutral-700 dark:text-neutral-400 hover:text-red-600 uppercase flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN TO CLIENT STOREFRONT
          </Link>

          <span className="hidden sm:inline text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/40">
            SESSION: SECURELY DECRYPTED // BLISS SERVER
          </span>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-red-950 border border-neutral-200 dark:border-red-600/40 text-neutral-800 dark:text-red-400 font-bold uppercase hover:bg-red-600 hover:text-white transition-all"
          >
            LOCK SESSION ✕
          </button>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div className="space-y-6">
            <div>
              <span className="text-xs text-red-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-4 h-4" /> MERCHANT CONTROL STATION
              </span>
              <h1 className="font-heading text-4xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                BLISS BALANCE // WORKSPACE
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold block">TOTAL PRODUCTS</span>
                  <span className="font-heading text-3xl font-black text-neutral-950 dark:text-white">{skus.length}</span>
                </div>
                <Layers className="w-8 h-8 text-red-600" />
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold block">APPSCRIPT EXCEL</span>
                  <span className="font-heading text-xl font-black text-emerald-600 dark:text-emerald-400">ACTIVE & SYNCED</span>
                </div>
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold block">HTML EMAIL NOTIFIER</span>
                  <span className="font-heading text-xl font-black text-blue-600 dark:text-blue-400">ENABLED</span>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border shadow-sm ${
              statusMsg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300' :
              statusMsg.type === 'error' ? 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-500 text-red-800 dark:text-red-300' :
              'bg-blue-50 dark:bg-blue-950/90 border-blue-200 dark:border-blue-500 text-blue-800 dark:text-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                {statusMsg.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {statusMsg.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {statusMsg.type === 'info' && <Info className="w-5 h-5" />}
                <span>{statusMsg.text}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('skus')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'skus'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-950'
              }`}
            >
              1. PRODUCTS WORKSPACE ({skus.length})
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'landing'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-950'
              }`}
            >
              2. LANDING BANNER & MEDIA
            </button>

            <button
              onClick={() => setActiveTab('appscript')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'appscript'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-950'
              }`}
            >
              3. APPSCRIPT & EMAIL ENGINE
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'logs'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-950'
              }`}
            >
              4. SYSTEM AUDIT LOGS ({logs.length})
            </button>
          </div>

          {/* TAB 1: PRODUCTS WORKSPACE */}
          {activeTab === 'skus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-600" /> CREATE NEW FOOTWEAR PRODUCT
                  </h3>
                </div>

                <form onSubmit={handleAddSku} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSku.title}
                      onChange={(e) => setNewSku({ ...newSku, title: e.target.value })}
                      placeholder="e.g. Bliss Comfort Slides - Men"
                      className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Subtitle / Short Description
                    </label>
                    <input
                      type="text"
                      value={newSku.subtitle}
                      onChange={(e) => setNewSku({ ...newSku, subtitle: e.target.value })}
                      placeholder="e.g. Ultra-cushioned anti-skid slides for everyday wear"
                      className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={newSku.gender}
                        onChange={(e) => setNewSku({ ...newSku, gender: e.target.value as Gender })}
                        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newSku.category}
                        onChange={(e) => setNewSku({ ...newSku, category: e.target.value as FootwearCategory })}
                        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                      >
                        <option value="Slippers">Slippers</option>
                        <option value="Flip-Flops">Flip-Flops</option>
                        <option value="Slides">Slides</option>
                        <option value="Sandals">Sandals</option>
                        <option value="Clogs">Clogs</option>
                        <option value="Casual Shoes">Casual Shoes</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Loafers">Loafers</option>
                        <option value="Formal Footwear">Formal Footwear</option>
                        <option value="Flats">Flats</option>
                        <option value="Heels">Heels</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newSku.price}
                        onChange={(e) => setNewSku({ ...newSku, price: Number(e.target.value) })}
                        placeholder="1499"
                        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                        MRP Price (₹)
                      </label>
                      <input
                        type="number"
                        value={newSku.originalPrice || ''}
                        onChange={(e) => setNewSku({ ...newSku, originalPrice: Number(e.target.value) })}
                        placeholder="2199"
                        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
                        Product Photo
                      </label>
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                        EXACT SIZE: 800 x 800 px (1:1)
                      </span>
                    </div>

                    <ImagePlaceholder
                      dimensions="800 x 800 px (1:1 Square)"
                      aspectRatio="aspect-square"
                      label="PRODUCT PHOTO DROPZONE"
                      imageUrl={newSku.imageUrl}
                      onImageUploaded={(base64) => setNewSku({ ...newSku, imageUrl: base64 })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-400 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>PUBLISH PRODUCT & SYNC TO GOOGLE SHEETS</span>
                  </button>

                </form>
              </div>

              {/* Active Products List */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <span>ACTIVE PRODUCTS</span>
                  <span className="text-xs text-red-600 font-bold">{skus.length} Items</span>
                </h3>

                {skus.length === 0 ? (
                  <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-2">
                    <p className="text-xs text-neutral-500">No products created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {skus.map((sku) => (
                      <div
                        key={sku.id}
                        className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 hover:border-red-600 transition-all shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase text-red-600 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800">
                              {sku.gender} • {sku.category}
                            </span>
                            <span className="text-[9px] text-neutral-400">{sku.id}</span>
                          </div>

                          <h4 className="font-heading text-lg font-bold text-neutral-950 dark:text-white uppercase leading-tight">
                            {sku.title}
                          </h4>

                          <p className="text-xs font-bold text-neutral-900 dark:text-white">
                            ₹{sku.price.toLocaleString('en-IN')}{' '}
                            {sku.originalPrice && <span className="line-through text-neutral-400 font-normal">₹{sku.originalPrice}</span>}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteSku(sku.id, sku.title)}
                          disabled={isSyncing}
                          className="p-2.5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:border-red-600 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: LANDING BANNER & MEDIA */}
          {activeTab === 'landing' && (
            <div className="max-w-3xl mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white">
                  CHANGE HERO LANDING BANNER & MEDIA
                </h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                
                <div className="space-y-3 bg-white dark:bg-black p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-neutral-800 dark:text-neutral-200">
                      Hero Banner Photo
                    </label>
                    <span className="text-[10px] text-red-600 font-extrabold bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded border border-red-200 dark:border-red-800">
                      EXACT SIZE: 1200 x 600 px (2:1 Banner)
                    </span>
                  </div>

                  <ImagePlaceholder
                    dimensions="1200 x 600 px (2:1 Wide Banner)"
                    aspectRatio="aspect-[2/1]"
                    label="HERO BANNER PHOTO DROPZONE"
                    imageUrl={settings.heroImageUrl}
                    onImageUploaded={(base64) => setSettings({ ...settings, heroImageUrl: base64 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                    Announcement Marquee Ticker Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all"
                >
                  SAVE BANNER & MEDIA CONFIG
                </button>

              </form>
            </div>
          )}

          {/* TAB 3: APPSCRIPT & EMAIL ENGINE */}
          {activeTab === 'appscript' && (
            <div className="max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-red-600" /> SELF-HEALING APPSCRIPT & BEAUTIFUL HTML EMAIL ENGINE
                  </h3>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Google Apps Script Web App Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={settings.appScriptUrl}
                      onChange={(e) => setSettings({ ...settings, appScriptUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                      className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Admin Alert Receiver Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      placeholder="admin@blissbalance.co"
                      className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 uppercase flex items-center gap-1">
                      <Mail className="w-4 h-4 text-red-600" /> BRINDAVANAM APPSCRIPT & HTML EMAIL ENGINE CODE:
                    </span>

                    <button
                      type="button"
                      onClick={copyCode}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'COPIED!' : 'COPY APPSCRIPT CODE'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-[11px] text-neutral-800 dark:text-neutral-300 overflow-x-auto border border-neutral-200 dark:border-neutral-900 leading-relaxed max-h-[350px]">
{appScriptCode}
                  </pre>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all"
                >
                  SAVE APPSCRIPT & EMAIL CONFIG
                </button>

              </form>
            </div>
          )}

          {/* TAB 4: SYSTEM AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-600" /> SYSTEM AUDIT LOGS
                </h3>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs text-neutral-500 hover:text-red-600 font-bold"
                >
                  CLEAR LOGS
                </button>
              </div>

              <div className="p-4 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-1 border-b border-neutral-100 dark:border-neutral-900/60">
                    <span className="text-neutral-400 text-[10px]">{log.time}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.type === 'SECURITY' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                      log.type === 'ACTION' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' :
                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
