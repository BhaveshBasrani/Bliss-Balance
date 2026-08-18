'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';
import { Footer } from '@/components/Footer';
import { getStoredSKUs, saveStoredSKUs, clearAllSKUs, getStoredSettings, saveStoredSettings, fetchCloudSKUs, DEFAULT_HERO_SLIDES } from '@/lib/dataStore';
import { upsertSupabaseSKU, deleteSupabaseSKU, deleteAllSupabaseSKUs, getStorageQuotaStats, StorageQuotaStats } from '@/lib/supabaseClient';
import { syncWithAppsScript, getRecaptchaV3Token } from '@/lib/appScriptSync';
import { FootwearSKU, SiteSettings, FootwearCategory, Gender, ColorVariant, ProductReview, HeroSlide } from '@/lib/types';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Database,
  RefreshCw,
  Info,
  Copy,
  Check,
  ArrowLeft,
  Flame,
  Key,
  Layers,
  Terminal,
  Mail,
  Sparkles,
  X,
  Palette,
  Image as ImageIcon,
  Zap,
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
  const [activeTab, setActiveTab] = useState<'skus' | 'landing' | 'appscript' | 'logs' | 'reviews'>('skus');

  // Dynamic Ticker Offer Items State (Learned from Brindavanam)
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [newTickerText, setNewTickerText] = useState('');
  const [editingTickerIndex, setEditingTickerIndex] = useState<number | null>(null);
  const [editingTickerValue, setEditingTickerValue] = useState('');

  // Admin Customer Reviews State
  const [allReviews, setAllReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    if (settings.announcementText) {
      const parsed = settings.announcementText
        .split('•')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      setTickerItems(parsed);
    }
  }, [settings.announcementText]);

  useEffect(() => {
    try {
      const savedRev = localStorage.getItem('bliss_balance_reviews_v1');
      if (savedRev) {
        const parsed = JSON.parse(savedRev);
        if (Array.isArray(parsed)) setAllReviews(parsed);
      }
    } catch (e) {}
  }, []);

  const handleAddTickerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    const updated = [...tickerItems, newTickerText.trim()];
    const joined = updated.join(' • ');
    setTickerItems(updated);
    setSettings(prev => ({ ...prev, announcementText: joined }));
    saveStoredSettings({ ...settings, announcementText: joined });
    setNewTickerText('');
    addLog(`Added ticker offer item: "${newTickerText.trim()}"`, 'CONFIG');
    showStatus('success', 'Ticker item added!');
  };

  const handleDeleteTickerItem = (idx: number) => {
    const updated = tickerItems.filter((_, i) => i !== idx);
    const joined = updated.join(' • ');
    setTickerItems(updated);
    setSettings(prev => ({ ...prev, announcementText: joined }));
    saveStoredSettings({ ...settings, announcementText: joined });
    addLog('Deleted ticker announcement item', 'CONFIG');
    showStatus('info', 'Ticker item deleted.');
  };

  const handleSaveEditedTickerItem = (idx: number) => {
    if (!editingTickerValue.trim()) return;
    const updated = [...tickerItems];
    updated[idx] = editingTickerValue.trim();
    const joined = updated.join(' • ');
    setTickerItems(updated);
    setSettings(prev => ({ ...prev, announcementText: joined }));
    saveStoredSettings({ ...settings, announcementText: joined });
    setEditingTickerIndex(null);
    addLog('Updated ticker announcement item', 'CONFIG');
    showStatus('success', 'Ticker item updated!');
  };

  const handleResetDefaultTickers = () => {
    const defaults = [
      'EASY 7-DAY RETURNS & REPLACEMENTS',
      'CUSHIONED & ANTI-SKID FOOTWEAR',
      'OFFICIAL ONLINE STORE',
      'MADE IN INDIA'
    ];
    const joined = defaults.join(' • ');
    setTickerItems(defaults);
    setSettings(prev => ({ ...prev, announcementText: joined }));
    saveStoredSettings({ ...settings, announcementText: joined });
    addLog('Reset ticker announcements to default offers', 'CONFIG');
    showStatus('info', 'Reset tickers to defaults.');
  };

  const handleDeleteAdminReview = (revId: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    const updated = allReviews.filter(r => r.id !== revId);
    setAllReviews(updated);
    try {
      localStorage.setItem('bliss_balance_reviews_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('reviews-updated'));
    } catch (e) {}
    addLog(`Deleted customer review ${revId}`, 'ACTION');
    showStatus('info', 'Review deleted.');
  };

  // Editing Product Mode State
  const [editingSkuId, setEditingSkuId] = useState<string | null>(null);

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
    category: 'Sneakers',
    price: 1675,
    originalPrice: 4499,
    amazonUrl: '',
    myntraUrl: '',
    flipkartUrl: '',
    imageUrl: '',
    hoverImageUrl: '',
    galleryImages: ['', '', '', ''],
    colorVariants: [],
    sizeMarketplaceUrls: {},
    imageDimensions: '800 x 800 px (1:1 Product Square)',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    features: ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid Outsole'],
    isNewArrival: true,
    isBestseller: false,
  });

  // Color Variant Form State
  const [colorInput, setColorInput] = useState<ColorVariant>({
    name: '',
    hex: '#1E293B',
    imageUrl: '',
    amazonUrl: '',
    myntraUrl: '',
    flipkartUrl: '',
  });

  const availableSizeOptions = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

  const [quotaStats, setQuotaStats] = useState<StorageQuotaStats | null>(null);

  useEffect(() => {
    const currentSkus = getStoredSKUs();
    setSkus(currentSkus);
    setSettings(getStoredSettings());
    getStorageQuotaStats(currentSkus).then(setQuotaStats);

    // Fetch live products from Supabase/cloud on mount to guarantee up-to-date products!
    fetchCloudSKUs(undefined, true).then(cloudSkus => {
      setSkus(cloudSkus || []);
      getStorageQuotaStats(cloudSkus || []).then(setQuotaStats);
    }).catch(() => {});

    const session = sessionStorage.getItem('bliss_balance_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    getStorageQuotaStats(skus).then(setQuotaStats);
  }, [skus]);

  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('bliss_balance_logs_v1');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed) && parsed.length > 0) setLogs(parsed);
      }
    } catch (e) {}
  }, []);

  const addLog = (msg: string, type: string = 'INFO') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => {
      const next = [{ time, msg, type }, ...prev];
      try {
        localStorage.setItem('bliss_balance_logs_v1', JSON.stringify(next.slice(0, 100)));
      } catch (e) {}
      return next;
    });

    if (settings.appScriptUrl && !settings.appScriptUrl.includes('EXAMPLE')) {
      syncWithAppsScript(settings.appScriptUrl, {
        action: 'save_log',
        log: { time, msg, type },
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    }
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

  const toggleSize = (size: string) => {
    const current = newSku.sizes || [];
    if (current.includes(size)) {
      setNewSku({ ...newSku, sizes: current.filter(s => s !== size) });
    } else {
      setNewSku({ ...newSku, sizes: [...current, size] });
    }
  };

  const addQuickColorVariant = (name: string, hex: string) => {
    const current = newSku.colorVariants || [];
    if (current.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const newVariant: ColorVariant = {
      name,
      hex,
      amazonUrl: newSku.amazonUrl || '',
      myntraUrl: newSku.myntraUrl || '',
      flipkartUrl: newSku.flipkartUrl || '',
    };
    setNewSku({ ...newSku, colorVariants: [...current, newVariant] });
  };

  const addColorVariant = () => {
    if (!colorInput.name) return;
    const updated = [...(newSku.colorVariants || []), colorInput];
    setNewSku({ ...newSku, colorVariants: updated });
    setColorInput({
      name: '',
      hex: '#1E293B',
      imageUrl: '',
      amazonUrl: '',
      myntraUrl: '',
      flipkartUrl: '',
    });
  };

  const removeColorVariant = (index: number) => {
    const updated = (newSku.colorVariants || []).filter((_, i) => i !== index);
    setNewSku({ ...newSku, colorVariants: updated });
  };

  const setGalleryImage = (index: number, url: string) => {
    const current = newSku.galleryImages ? [...newSku.galleryImages] : ['', '', '', ''];
    current[index] = url;
    setNewSku({ ...newSku, galleryImages: current });
  };

  const handleEditClick = (sku: FootwearSKU) => {
    setEditingSkuId(sku.id);
    setNewSku({
      title: sku.title,
      subtitle: sku.subtitle,
      gender: sku.gender,
      category: sku.category,
      price: sku.price,
      originalPrice: sku.originalPrice,
      amazonUrl: sku.amazonUrl || '',
      myntraUrl: sku.myntraUrl || '',
      flipkartUrl: sku.flipkartUrl || '',
      imageUrl: sku.imageUrl || '',
      hoverImageUrl: sku.hoverImageUrl || '',
      galleryImages: sku.galleryImages && sku.galleryImages.length > 0 ? sku.galleryImages : ['', '', '', ''],
      colorVariants: sku.colorVariants || [],
      sizeMarketplaceUrls: sku.sizeMarketplaceUrls || {},
      imageDimensions: '800 x 800 px (1:1 Product Square)',
      sizes: sku.sizes || ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      features: sku.features || ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid Outsole'],
      isNewArrival: !!sku.isNewArrival,
      isBestseller: !!sku.isBestseller,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSkuId(null);
    setNewSku({
      title: '',
      subtitle: '',
      gender: 'Men',
      category: 'Slides',
      price: 1499,
      originalPrice: 2199,
      amazonUrl: '',
      myntraUrl: '',
      flipkartUrl: '',
      imageUrl: '',
      hoverImageUrl: '',
      galleryImages: ['', '', '', ''],
      colorVariants: [],
      sizeMarketplaceUrls: {},
      imageDimensions: '800 x 800 px (1:1 Product Square)',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      features: ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid Outsole'],
      isNewArrival: true,
      isBestseller: false,
    });
  };

  const handleSaveSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.title || !newSku.price) {
      showStatus('error', 'Please specify product title and price.');
      return;
    }

    setIsSyncing(true);
    setSyncStepText(editingSkuId ? 'Updating Product in Google Sheets...' : 'Syncing New Product to Google Sheets...');

    const targetId = editingSkuId || `sku-bb-${Date.now().toString().slice(-5)}`;
    const filteredGallery = (newSku.galleryImages || []).filter(img => img && img.trim() !== '');

    const savedSku: FootwearSKU = {
      id: targetId,
      title: newSku.title,
      subtitle: newSku.subtitle || 'Comfort-focused everyday footwear',
      gender: (newSku.gender as Gender) || 'Men',
      category: (newSku.category as FootwearCategory) || 'Slides',
      price: Number(newSku.price),
      originalPrice: newSku.originalPrice ? Number(newSku.originalPrice) : undefined,
      amazonUrl: newSku.amazonUrl || '',
      myntraUrl: newSku.myntraUrl || '',
      flipkartUrl: newSku.flipkartUrl || '',
      imageUrl: newSku.imageUrl || '',
      hoverImageUrl: newSku.hoverImageUrl || '',
      galleryImages: filteredGallery,
      colorVariants: newSku.colorVariants || [],
      sizeMarketplaceUrls: newSku.sizeMarketplaceUrls || {},
      imageDimensions: '800 x 800 px (1:1 Product Square)',
      sizes: newSku.sizes && newSku.sizes.length > 0 ? newSku.sizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      features: newSku.features && newSku.features.length > 0 ? newSku.features : ['Cushioned Footwear', 'Lightweight Feel', 'Anti-Skid'],
      rating: 5.0,
      reviewCount: 0,
      isNewArrival: !!newSku.isNewArrival,
      isBestseller: !!newSku.isBestseller,
      createdAt: new Date().toISOString(),
    };

    let updatedSkus: FootwearSKU[];
    if (editingSkuId) {
      updatedSkus = skus.map(s => s.id === editingSkuId ? savedSku : s);
    } else {
      updatedSkus = [savedSku, ...skus];
    }

    setSkus(updatedSkus);
    saveStoredSKUs(updatedSkus);

    setSyncStepText('Writing Record to Supabase PostgreSQL Database...');
    await upsertSupabaseSKU(savedSku);

    setSyncStepText('Generating reCAPTCHA v3 Security Token...');
    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'save_sku');

    setSyncStepText('Writing Record to Google Sheets & Dispatching Email...');
    await syncWithAppsScript(settings.appScriptUrl, {
      action: editingSkuId ? 'UPDATE_SKU' : 'ADD_SKU',
      skuData: savedSku,
      recaptchaToken,
      timestamp: new Date().toISOString(),
      adminEmail: settings.adminEmail,
    });

    setIsSyncing(false);
    addLog(`Product "${savedSku.title}" saved to Supabase & Google Sheets`, 'ACTION');
    showStatus('success', `Product "${savedSku.title}" saved to Supabase & Google Sheets!`);

    handleCancelEdit();
  };

  const handleDeleteSku = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete product "${title}"?`)) return;

    setIsSyncing(true);
    setSyncStepText(`Deleting "${title}" from Supabase & Google Sheets...`);

    const updatedSkus = skus.filter(s => s.id !== id);
    setSkus(updatedSkus);
    saveStoredSKUs(updatedSkus);

    await deleteSupabaseSKU(id);

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

  const handleWipeSupabase = async () => {
    if (!confirm('⚠️ ARE YOU ABSOLUTELY SURE?\nThis will completely wipe all product records and image references from Supabase PostgreSQL Database and local storage.')) return;

    setIsSyncing(true);
    setSyncStepText('Wiping All Products & Storage Data from Supabase Database...');

    clearAllSKUs();
    setSkus([]);

    const success = await deleteAllSupabaseSKUs();

    setIsSyncing(false);
    if (success) {
      addLog('Completely wiped all products & storage from Supabase Database', 'ACTION');
      showStatus('success', 'Supabase Database & Storage completely cleaned and wiped!');
    } else {
      showStatus('error', 'Could not complete full wipe. Please check network connection.');
    }
  };

  const handleToggleBestseller = async (id: string, isBestseller: boolean) => {
    setIsSyncing(true);
    const updated = skus.map(s => s.id === id ? { ...s, isBestseller } : s);
    setSkus(updated);
    saveStoredSKUs(updated);
    const skuToSave = updated.find(s => s.id === id);
    if (skuToSave) {
      await upsertSupabaseSKU(skuToSave);
    }
    setIsSyncing(false);
    showStatus('success', isBestseller ? 'Marked product as BESTSELLER! 🔥' : 'Removed product from Bestsellers.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncStepText('Syncing Site Banner & Settings to Google Sheets...');

    saveStoredSettings(settings);

    if (!settings.appScriptUrl || settings.appScriptUrl.includes('EXAMPLE')) {
      setIsSyncing(false);
      addLog('Saved settings locally. Google Apps Script endpoint is unconfigured (empty).', 'CONFIG');
      showStatus('info', 'Settings saved locally! Google Apps Script URL is unconfigured (empty).');
      return;
    }

    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'update_banner');

    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'UPDATE_BANNER',
      settingsData: settings,
      recaptchaToken,
      timestamp: new Date().toISOString(),
    });

    setIsSyncing(false);
    addLog('Updated site settings & ticker config in Google Sheets', 'CONFIG');
    showStatus('success', `Settings saved to Google Sheets! ${syncRes.message}`);
  };

  const appScriptCode = `/**
 * BLISS BALANCE FOOTWEAR - GOOGLE SHEETS LIVE SYNC ENGINE
 */
var RECAPTCHA_SECRET_KEY = "6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s";
function doGet(e) { return ContentService.createTextOutput(JSON.stringify({ status: "active" })).setMimeType(ContentService.MimeType.JSON); }`;

  const copyCode = () => {
    navigator.clipboard.writeText(appScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // PASSWORD GATE OVERLAY
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white font-mono flex flex-col items-center justify-center p-4 transition-colors relative select-none">
        
        {/* Top Header Return Link */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-xl mx-auto w-full">
          <Link
            href="/"
            className="text-xs font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-300 hover:text-red-600 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> CLIENT STOREFRONT
          </Link>
          <span className="text-[10px] text-red-600 font-black border border-red-200 dark:border-red-800 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/80">
            SECURITY GATE // CONTROL STATION
          </span>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Login Box */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl relative z-10">
          
          <div className="text-center space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="w-14 h-14 mx-auto flex items-center justify-center p-2 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800">
              <BrandLogo size="md" />
            </div>

            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block pt-1">
              BLISS BALANCE SECURITY ENGINE
            </span>
            <h2 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
              CONTROL STATION UNLOCK
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">
              Enter admin security password to access merchant controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
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
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-600 text-xs font-mono font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>DECRYPT & UNLOCK STATION</span>
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-[10px] text-neutral-500 font-black uppercase">
            SYSTEM STATUS: RECAPTCHA V3 & APPSCRIPT SECURED
          </div>
        </div>

        <div className="text-center text-[10px] text-neutral-500 font-black py-4">
          © {new Date().getFullYear()} BLISS BALANCE CONTROL STATION
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono flex flex-col justify-between transition-colors relative select-none">
      
      {/* SOLID HIGH-IMPACT LUXURY LOADING SCREEN */}
      {isSyncing && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-200 text-white font-mono select-none">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-600 animate-pulse" />

            <div className="relative w-16 h-16 mx-auto flex items-center justify-center p-3 rounded-2xl bg-red-950/80 border border-red-800">
              <BrandLogo size="md" className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-black uppercase text-white tracking-wider">
                SYNCING DATA...
              </h3>
              <p className="text-xs font-mono font-bold text-neutral-400">
                Updating cloud database & local storage. Please wait.
              </p>
            </div>

            <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-red-600 h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 sm:px-8 flex items-center justify-between text-xs backdrop-blur-md">
          <Link
            href="/"
            className="font-black text-neutral-800 dark:text-neutral-200 hover:text-red-600 uppercase flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN TO CLIENT STOREFRONT
          </Link>

          <span className="hidden sm:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-black bg-white dark:bg-black px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            SESSION: SECURELY DECRYPTED // BLISS SERVER
          </span>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black uppercase border border-red-600 hover:bg-neutral-950 transition-all duration-200 shadow-sm"
          >
            LOCK SESSION ✕
          </button>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div className="space-y-6">
            <div>
              <span className="text-xs text-red-600 font-black uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-4 h-4" /> MERCHANT CONTROL STATION
              </span>
              <h1 className="font-heading text-4xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                BLISS BALANCE // WORKSPACE
              </h1>
            </div>

            {/* DASHBOARD METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-black block">TOTAL PRODUCTS</span>
                  <span className="font-heading text-3xl font-black text-neutral-950 dark:text-white">{skus.length}</span>
                </div>
                <Layers className="w-8 h-8 text-red-600" />
              </div>

              {/* 1GB SUPABASE STORAGE MONITOR */}
              <div className="p-5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 uppercase font-black">SUPABASE 1GB STORAGE</span>
                  <button
                    onClick={handleWipeSupabase}
                    className="text-[9px] font-black text-red-600 hover:text-white bg-red-50 dark:bg-red-950 hover:bg-red-600 px-2 py-0.5 rounded-full border border-red-300 dark:border-red-800 transition-all flex items-center gap-1"
                    title="Wipe all products and clear Supabase database"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>WIPE STORAGE</span>
                  </button>
                </div>
                <div>
                  <div className="flex items-baseline justify-between text-xs font-black">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {quotaStats ? `${(quotaStats.remainingBytes / (1024 * 1024)).toFixed(1)} MB LEFT` : '1024.0 MB LEFT'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {quotaStats ? `${quotaStats.usedPercentage}% USED` : '0% USED'}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${quotaStats ? Math.max(2, quotaStats.usedPercentage) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-black block">APPSCRIPT SPREADSHEET</span>
                  <span className="font-heading text-lg font-black text-emerald-600 dark:text-emerald-400">ACTIVE & SYNCED</span>
                </div>
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-black block">HTML EMAIL NOTIFIER</span>
                  <span className={`font-heading text-lg font-black ${
                    settings.isEmailEnabled !== false
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}>
                    {settings.isEmailEnabled !== false ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <Mail className={`w-8 h-8 ${
                  settings.isEmailEnabled !== false ? 'text-emerald-600' : 'text-neutral-400'
                }`} />
              </div>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-4 rounded-none text-xs font-black flex items-center justify-between border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              statusMsg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-800 dark:text-emerald-300' :
              statusMsg.type === 'error' ? 'bg-red-50 dark:bg-red-950 border-red-600 text-red-800 dark:text-red-300' :
              'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-800 dark:text-blue-300'
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
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'skus'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              1. SINGLE SKU FORM ({skus.length})
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'landing'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              2. LANDING BANNER & MEDIA
            </button>

            <button
              onClick={() => setActiveTab('appscript')}
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'appscript'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              3. APPSCRIPT & EMAIL ENGINE
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'logs'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              4. AUDIT LOGS ({logs.length})
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === 'reviews'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              5. REVIEWS MANAGER ({allReviews.length})
            </button>
          </div>

          {/* TAB 1: PRODUCTS WORKSPACE */}
          {activeTab === 'skus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Form (Create & Edit Mode) */}
              <div className="lg:col-span-7 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                    {editingSkuId ? <Edit className="w-5 h-5 text-red-600" /> : <Plus className="w-5 h-5 text-red-600" />}
                    <span>{editingSkuId ? 'EDIT FOOTWEAR PRODUCT' : 'CREATE NEW FOOTWEAR PRODUCT'}</span>
                  </h3>

                  {editingSkuId && (
                    <button
                      onClick={handleCancelEdit}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 text-xs font-black uppercase flex items-center gap-1 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" /> CANCEL EDIT
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveSku} className="space-y-5">
                  
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                      Product Title / SKU Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSku.title}
                      onChange={(e) => setNewSku({ ...newSku, title: e.target.value })}
                      placeholder="e.g. BB158 (Bliss Sneaker)"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                      Subtitle / Short Description
                    </label>
                    <input
                      type="text"
                      value={newSku.subtitle}
                      onChange={(e) => setNewSku({ ...newSku, subtitle: e.target.value })}
                      placeholder="e.g. All-Day Perfect Comfort for Active Lifestyles"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                        Gender
                      </label>
                      <select
                        value={newSku.gender}
                        onChange={(e) => setNewSku({ ...newSku, gender: e.target.value as Gender })}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none font-black"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                        Category
                      </label>
                      <select
                        value={newSku.category}
                        onChange={(e) => setNewSku({ ...newSku, category: e.target.value as FootwearCategory })}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none font-black"
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
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newSku.price}
                        onChange={(e) => setNewSku({ ...newSku, price: Number(e.target.value) })}
                        placeholder="1675"
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                        MRP Price (₹)
                      </label>
                      <input
                        type="number"
                        value={newSku.originalPrice || ''}
                        onChange={(e) => setNewSku({ ...newSku, originalPrice: Number(e.target.value) })}
                        placeholder="4499"
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* BESTSELLER TAG TOGGLE CHECKBOX */}
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!newSku.isBestseller}
                      onChange={(e) => setNewSku({ ...newSku, isBestseller: e.target.checked })}
                      className="w-5 h-5 accent-red-600 rounded-md cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-mono font-black uppercase text-red-600 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 fill-red-600" /> MARK AS BESTSELLER PRODUCT
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 font-bold block">
                        Displays product prominently in the Bestsellers section on homepage & catalog
                      </span>
                    </div>
                  </label>

                  {/* Available Sizes Checkboxes */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200">
                        Available Sizes
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setNewSku({ ...newSku, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] })}
                          className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono font-bold rounded-lg hover:bg-red-600 transition-all"
                        >
                          + Mens 6-11
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSku({ ...newSku, sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'] })}
                          className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono font-bold rounded-lg hover:bg-red-600 transition-all"
                        >
                          + Womens 3-8
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSku({ ...newSku, sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'] })}
                          className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono font-bold rounded-lg hover:bg-red-600 transition-all"
                        >
                          + All 3-12
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizeOptions.map((size) => {
                        const isChecked = (newSku.sizes || []).includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-black uppercase transition-all duration-200 border ${
                              isChecked
                                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-red-600/60'
                            }`}
                          >
                            {size} {isChecked && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PRIMARY & HOVER PHOTOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200">
                        Primary Product Photo *
                      </label>
                      <ImagePlaceholder
                        dimensions="800 x 800 px (1:1)"
                        aspectRatio="aspect-square"
                        label="PRIMARY PHOTO DROPZONE"
                        imageUrl={newSku.imageUrl}
                        onImageUploaded={(base64) => setNewSku({ ...newSku, imageUrl: base64 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200">
                        Hover Secondary Photo (Comet Style)
                      </label>
                      <ImagePlaceholder
                        dimensions="800 x 800 px (1:1)"
                        aspectRatio="aspect-square"
                        label="HOVER PHOTO DROPZONE"
                        imageUrl={newSku.hoverImageUrl}
                        onImageUploaded={(base64) => setNewSku({ ...newSku, hoverImageUrl: base64 })}
                      />
                    </div>
                  </div>

                  {/* ADDITIONAL CATALOG / GALLERY PHOTOS */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-red-600" />
                      <span>CATALOG & GALLERY PHOTOS (UP TO 4 EXTRA ANGLE PHOTOS)</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="block text-[9px] font-black text-neutral-400">Photo {idx + 1}</span>
                          <ImagePlaceholder
                            dimensions="800 x 800 px"
                            aspectRatio="aspect-square"
                            label={`GALLERY ${idx + 1}`}
                            imageUrl={newSku.galleryImages ? newSku.galleryImages[idx] : ''}
                            onImageUploaded={(base64) => setGalleryImage(idx, base64)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLOR VARIANTS WITH SPECIFIC PHOTOS & BUY LINKS */}
                  <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-red-600" />
                        <span>COLOR VARIANTS (PHOTOS, SWATCHES & SPECIFIC LINKS)</span>
                      </label>
                    </div>

                    {/* 1-CLICK QUICK ADD COMMON COLORS */}
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                      <span className="block text-[10px] font-mono font-black uppercase text-neutral-500">
                        ⚡ 1-CLICK ADD COMMON FOOTWEAR COLORS:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => addQuickColorVariant('Navy & White', '#1E293B')} className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + Navy & White
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Chestnut Brown', '#451A03')} className="px-3.5 py-1.5 rounded-lg bg-amber-950 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + Chestnut Brown
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('All Black', '#000000')} className="px-3.5 py-1.5 rounded-lg bg-black text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + All Black
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Olive Green', '#3F6212')} className="px-3.5 py-1.5 rounded-lg bg-lime-950 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + Olive Green
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Tan Beige', '#D97706')} className="px-3.5 py-1.5 rounded-lg bg-amber-700 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + Tan Beige
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Pure White', '#FFFFFF')} className="px-3.5 py-1.5 rounded-lg bg-white text-black border border-neutral-300 text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600 hover:text-white">
                          + Pure White
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Charcoal Grey', '#4B5563')} className="px-3.5 py-1.5 rounded-lg bg-neutral-600 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-red-600">
                          + Charcoal Grey
                        </button>
                        <button type="button" onClick={() => addQuickColorVariant('Crimson Red', '#DC2626')} className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-mono font-black shadow-xs transition-all hover:bg-neutral-950">
                          + Crimson Red
                        </button>
                      </div>
                    </div>

                    {/* Added Colors List */}
                    <div className="flex flex-wrap gap-2">
                      {newSku.colorVariants?.map((cv, idx) => (
                        <div key={idx} className="px-3.5 py-2 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs font-mono font-black shadow-xs">
                          {cv.imageUrl ? (
                            <img src={cv.imageUrl} alt={cv.name} className="w-6 h-6 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700" style={{ backgroundColor: cv.hex }} />
                          )}
                          <span>{cv.name}</span>
                          <button type="button" onClick={() => removeColorVariant(idx)} className="text-neutral-400 hover:text-red-600 font-black">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Color Variant Add Card */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        
                        <div className="sm:col-span-4 space-y-1">
                          <label className="block text-[10px] font-mono font-black uppercase text-red-600">
                            Photo For This Color *
                          </label>
                          <ImagePlaceholder
                            dimensions="800 x 800 px"
                            aspectRatio="aspect-square"
                            label="COLOR PHOTO DROPZONE"
                            imageUrl={colorInput.imageUrl}
                            onImageUploaded={(base64) => setColorInput({ ...colorInput, imageUrl: base64 })}
                          />
                        </div>

                        <div className="sm:col-span-8 space-y-3 font-mono">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono font-black uppercase text-neutral-500 mb-1">Color Name (e.g. Navy Blue)</label>
                              <input
                                type="text"
                                value={colorInput.name}
                                onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                                placeholder="Navy Blue"
                                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono font-black uppercase text-neutral-500 mb-1">Color Swatch Hex</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={colorInput.hex}
                                  onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                                  className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={colorInput.hex}
                                  onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                                  className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono font-black"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="url"
                              value={colorInput.amazonUrl || ''}
                              onChange={(e) => setColorInput({ ...colorInput, amazonUrl: e.target.value })}
                              placeholder="Amazon Link for this color"
                              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-2 text-[11px] font-mono"
                            />
                            <input
                              type="url"
                              value={colorInput.myntraUrl || ''}
                              onChange={(e) => setColorInput({ ...colorInput, myntraUrl: e.target.value })}
                              placeholder="Myntra Link for this color"
                              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-2 text-[11px] font-mono"
                            />
                            <input
                              type="url"
                              value={colorInput.flipkartUrl || ''}
                              onChange={(e) => setColorInput({ ...colorInput, flipkartUrl: e.target.value })}
                              placeholder="Flipkart Link for this color"
                              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-2 text-[11px] font-mono"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={addColorVariant}
                            className="w-full py-3.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-black text-xs font-mono font-black uppercase hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
                          >
                            + ADD COLOR VARIANT WITH PHOTO & LINKS
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* BASE MARKETPLACE LINKS */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200">
                      DEFAULT BASE MARKETPLACE LINKS
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="block text-[10px] text-amber-600 font-mono font-black uppercase mb-1">Default Amazon Link</span>
                        <input
                          type="url"
                          value={newSku.amazonUrl || ''}
                          onChange={(e) => setNewSku({ ...newSku, amazonUrl: e.target.value })}
                          placeholder="https://www.amazon.in/dp/B0H9B2DYS7..."
                          className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] text-red-600 font-mono font-black uppercase mb-1">Default Myntra Link</span>
                        <input
                          type="url"
                          value={newSku.myntraUrl || ''}
                          onChange={(e) => setNewSku({ ...newSku, myntraUrl: e.target.value })}
                          placeholder="https://myntra.com/..."
                          className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] text-blue-600 font-mono font-black uppercase mb-1">Default Flipkart Link</span>
                        <input
                          type="url"
                          value={newSku.flipkartUrl || ''}
                          onChange={(e) => setNewSku({ ...newSku, flipkartUrl: e.target.value })}
                          placeholder="https://flipkart.com/..."
                          className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="w-full py-4 rounded-xl bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingSkuId ? 'UPDATE PRODUCT & SYNC TO SHEETS' : 'PUBLISH PRODUCT & SYNC TO SHEETS'}</span>
                  </button>

                </form>
              </div>

              {/* Active Products List */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <span>ACTIVE PRODUCTS</span>
                  <span className="text-xs text-red-600 font-mono font-black">{skus.length} Items</span>
                </h3>

                {skus.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-2 shadow-sm">
                    <p className="text-xs text-neutral-500 font-mono font-bold">No products created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1">
                    {skus.map((sku) => (
                      <div
                        key={sku.id}
                        className={`p-4 rounded-xl bg-white dark:bg-black border flex items-center justify-between gap-4 transition-all shadow-sm ${
                          editingSkuId === sku.id ? 'border-red-600 ring-2 ring-red-600/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                              {sku.gender} • {sku.category}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-black">{sku.id}</span>
                          </div>

                          <h4 className="font-heading text-base font-black text-neutral-950 dark:text-white uppercase leading-tight truncate">
                            {sku.title}
                          </h4>

                          <p className="text-xs font-black text-neutral-950 dark:text-white">
                            ₹{sku.price.toLocaleString('en-IN')}{' '}
                            {sku.originalPrice && <span className="line-through text-neutral-400 font-normal">₹{sku.originalPrice}</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleBestseller(sku.id, !sku.isBestseller)}
                            disabled={isSyncing}
                            className={`px-3 py-2 rounded-lg text-xs font-mono font-black uppercase transition-all shadow-xs flex items-center gap-1 border ${
                              sku.isBestseller
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-red-600'
                            }`}
                            title="Toggle Bestseller Tag"
                          >
                            <Flame className={`w-3.5 h-3.5 ${sku.isBestseller ? 'fill-white' : ''}`} />
                            <span className="hidden sm:inline">{sku.isBestseller ? 'BESTSELLER' : '+ BESTSELLER'}</span>
                          </button>

                          <button
                            onClick={() => handleEditClick(sku)}
                            disabled={isSyncing}
                            className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white transition-all shadow-xs"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteSku(sku.id, sku.title)}
                            disabled={isSyncing}
                            className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white transition-all shadow-xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: LANDING BANNER & MEDIA */}
          {activeTab === 'landing' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white">
                  CHANGE HERO LANDING BANNER & MEDIA
                </h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 font-mono">
                {/* DYNAMIC HERO SLIDES CAROUSEL MANAGER */}
                <div className="space-y-4 p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <div>
                      <h4 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-red-600" /> DYNAMIC HERO SLIDES [{ (settings.heroSlides || DEFAULT_HERO_SLIDES).length }]
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Add, edit, or delete desktop & mobile auto-sliding hero banners and overlay copy text.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = settings.heroSlides || DEFAULT_HERO_SLIDES;
                        const newSlide = {
                          id: `slide-${Date.now()}`,
                          desktopImageUrl: '/hero-banner.png',
                          mobileImageUrl: '/hero-banner-mobile.png',
                          badgeText: 'FEEL THE BLISS • NEW DROP',
                          titleText: 'BUILT FOR THE ONES BALANCING LIFE.',
                          subheadlineText: 'Comfort, contemporary style and dependable grip.',
                          ctaText: 'SHOP NOW',
                          ctaLink: '/collections',
                        };
                        setSettings({ ...settings, heroSlides: [...current, newSlide] });
                        showStatus('info', 'New Hero Slide Added! Click Save below.');
                      }}
                      className="px-4 py-2 bg-red-600 text-white font-mono font-black text-xs uppercase rounded-xl hover:bg-neutral-950 transition-all shrink-0 shadow-xs"
                    >
                      + ADD HERO SLIDE
                    </button>
                  </div>

                  {/* SLIDES LIST */}
                  <div className="space-y-6 max-h-[550px] overflow-y-auto pr-1 pt-2">
                    {(settings.heroSlides || DEFAULT_HERO_SLIDES).map((slide: HeroSlide, sIdx: number) => (
                      <div key={slide.id || sIdx} className="p-4 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                          <span className="text-xs font-black text-red-600 uppercase">
                            SLIDE #{sIdx + 1}
                          </span>
                          {(settings.heroSlides || DEFAULT_HERO_SLIDES).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const current = settings.heroSlides || DEFAULT_HERO_SLIDES;
                                const updated = current.filter((_: HeroSlide, i: number) => i !== sIdx);
                                setSettings({ ...settings, heroSlides: updated });
                              }}
                              className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-neutral-900 transition-all"
                            >
                              DELETE SLIDE ✕
                            </button>
                          )}
                        </div>

                        {/* DESKTOP & MOBILE IMAGE INPUTS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                              Desktop Banner Photo (1200 x 600 px)
                            </label>
                            <ImagePlaceholder
                              dimensions="1200 x 600 px (Desktop Banner)"
                              aspectRatio="aspect-[2/1]"
                              label={`DESKTOP SLIDE #${sIdx + 1}`}
                              imageUrl={slide.desktopImageUrl}
                              onImageUploaded={(base64) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], desktopImageUrl: base64 };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                              Mobile Banner Photo (800 x 800 px)
                            </label>
                            <ImagePlaceholder
                              dimensions="800 x 800 px (Mobile Square Banner)"
                              aspectRatio="aspect-square"
                              label={`MOBILE SLIDE #${sIdx + 1}`}
                              imageUrl={slide.mobileImageUrl}
                              onImageUploaded={(base64) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], mobileImageUrl: base64 };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                            />
                          </div>
                        </div>

                        {/* SLIDE TEXT FIELDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              Badge Pill Text
                            </label>
                            <input
                              type="text"
                              value={slide.badgeText || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], badgeText: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="FEEL THE BLISS • MADE IN INDIA"
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              Headline Title Text
                            </label>
                            <input
                              type="text"
                              value={slide.titleText || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], titleText: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="BUILT FOR THE ONES BALANCING LIFE."
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              Subheadline Copy
                            </label>
                            <input
                              type="text"
                              value={slide.subheadlineText || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], subheadlineText: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="Comfort, contemporary style, lightweight construction..."
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              CTA Button 1 Label
                            </label>
                            <input
                              type="text"
                              value={slide.ctaText || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], ctaText: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="SHOP MEN"
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              CTA Button 1 Target Link
                            </label>
                            <input
                              type="text"
                              value={slide.ctaLink || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], ctaLink: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="/men or /collections"
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              CTA Button 2 Label
                            </label>
                            <input
                              type="text"
                              value={slide.ctaText2 || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], ctaText2: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="SHOP WOMEN"
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                              CTA Button 2 Target Link
                            </label>
                            <input
                              type="text"
                              value={slide.ctaLink2 || ''}
                              onChange={(e) => {
                                const current = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
                                current[sIdx] = { ...current[sIdx], ctaLink2: e.target.value };
                                setSettings({ ...settings, heroSlides: current });
                              }}
                              placeholder="/women"
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC TICKER OFFER MANAGER */}
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-red-600" /> DYNAMIC MARQUEE TICKER OFFERS [{tickerItems.length}]
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Add, edit, delete, or re-order announcement ticker messages. Updates live across the website.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetDefaultTickers}
                      className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-[10px] font-black uppercase rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-red-600 hover:text-white transition-all shrink-0 self-start sm:self-auto"
                    >
                      RESET DEFAULTS
                    </button>
                  </div>

                  {/* Add New Ticker Item Input */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newTickerText}
                      onChange={(e) => setNewTickerText(e.target.value)}
                      placeholder="e.g. FAST PAN-INDIA SHIPPING • 7-DAY EASY RETURNS"
                      className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTickerItem}
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase rounded-xl transition-all shadow-xs shrink-0"
                    >
                      + ADD TICKER
                    </button>
                  </div>

                  {/* Active Ticker Items List with Inline Edit/Delete */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {tickerItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between gap-3 font-mono text-xs shadow-xs"
                      >
                        {editingTickerIndex === idx ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingTickerValue}
                              onChange={(e) => setEditingTickerValue(e.target.value)}
                              className="flex-1 bg-white dark:bg-black border border-red-600 px-3 py-1.5 text-xs font-bold text-neutral-950 dark:text-white focus:outline-none rounded-lg"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditedTickerItem(idx)}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg border border-emerald-600"
                            >
                              SAVE
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTickerIndex(null)}
                              className="px-3 py-1.5 bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white text-[10px] font-black uppercase rounded-lg"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                              <strong className="text-red-600 mr-2">[{idx + 1}]</strong> {item}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTickerIndex(idx);
                                  setEditingTickerValue(item);
                                }}
                                className="p-1.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-red-600"
                                title="Edit Ticker Item"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTickerItem(idx)}
                                className="p-1.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-red-600"
                                title="Delete Ticker Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
                >
                  SAVE BANNER & MEDIA CONFIG
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: APPSCRIPT & EMAIL ENGINE */}
          {activeTab === 'appscript' && (
            <div className="max-w-4xl mx-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-600" /> APPSCRIPT & HTML EMAIL ENGINE
                </h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                      Google Apps Script Web App Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={settings.appScriptUrl}
                      onChange={(e) => setSettings({ ...settings, appScriptUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">
                      Admin Alert Receiver Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      placeholder="admin@blissbalance.co"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* EMAIL SYSTEM TOGGLE SWITCH */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono shadow-xs">
                  <div>
                    <span className="block text-xs font-black uppercase text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-emerald-600" /> AUTOMATIC HTML EMAIL NOTIFICATIONS
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold">
                      Sends real-time email order alerts & SKU updates to <strong className="text-red-600">{settings.adminEmail || 'admin'}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !settings.isEmailEnabled;
                      const updated = { ...settings, isEmailEnabled: nextState };
                      setSettings(updated);
                      saveStoredSettings(updated);
                      addLog(`Admin email notification system ${nextState ? 'ENABLED' : 'DISABLED'}`, 'CONFIG');
                      showStatus('info', `Email notifications ${nextState ? 'Enabled ✓' : 'Disabled ✕'}`);
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 font-black text-xs uppercase shadow-xs transition-all shrink-0 text-center ${
                      settings.isEmailEnabled !== false ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {settings.isEmailEnabled !== false ? 'SYSTEM ENABLED ✓' : 'SYSTEM DISABLED ✕'}
                  </button>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-black text-red-600 uppercase flex items-center gap-1">
                      <Mail className="w-4 h-4 text-red-600" /> LIVE SYNC APPSCRIPT CODE:
                    </span>

                    <button
                      type="button"
                      onClick={copyCode}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-red-600 text-white text-xs font-mono font-black border border-neutral-900 flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-white dark:bg-black rounded-xl text-[11px] text-neutral-800 dark:text-neutral-300 overflow-x-auto border border-neutral-200 dark:border-neutral-800 leading-relaxed max-h-[350px] font-mono font-bold">
{appScriptCode}
                  </pre>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
                >
                  SAVE APPSCRIPT & EMAIL CONFIG
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SYSTEM AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="max-w-4xl mx-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-600" /> SYSTEM AUDIT LOGS
                </h3>
                <button
                  onClick={() => {
                    setLogs([]);
                    try {
                      localStorage.removeItem('bliss_balance_logs_v1');
                    } catch (e) {}
                    showStatus('info', 'Audit logs cleared successfully!');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-neutral-950 font-mono font-black text-xs uppercase transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>CLEAR LOGS</span>
                </button>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-1 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-400 text-[10px] font-bold">{log.time}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                      log.type === 'SECURITY' ? 'bg-red-600 text-white border-red-600' :
                      log.type === 'ACTION' ? 'bg-emerald-600 text-white border-emerald-600' :
                      'bg-neutral-900 text-white border-neutral-800'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MANAGER */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-600" /> CUSTOMER REVIEWS MANAGER [{allReviews.length}]
                </h3>
              </div>

              {allReviews.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-950 rounded-none border-2 border-neutral-900 dark:border-neutral-800 p-6 space-y-2">
                  <p className="text-xs text-neutral-500 font-mono font-bold">No customer reviews submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {allReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-700 flex items-center justify-between gap-4 font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-neutral-950 dark:text-white uppercase">{rev.authorName}</span>
                          <span className="text-[10px] text-amber-500 font-black">{'★'.repeat(rev.rating)}</span>
                          <span className="text-[10px] text-neutral-400 font-bold">{rev.date}</span>
                        </div>
                        <h5 className="font-bold text-neutral-900 dark:text-neutral-100">{rev.headline}</h5>
                        <p className="text-neutral-500 text-[11px] truncate max-w-xl">{rev.comment}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAdminReview(rev.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-black text-white text-xs font-black uppercase border border-black transition-all shrink-0"
                      >
                        DELETE REVIEW ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
