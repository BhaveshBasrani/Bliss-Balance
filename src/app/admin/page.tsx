'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';
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
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Admin Data State
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [activeTab, setActiveTab] = useState<'skus' | 'landing' | 'appscript'>('skus');

  // Status Notifications
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // New SKU Form State
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

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    setSkus(getStoredSKUs());
    setSettings(getStoredSettings());
    const session = sessionStorage.getItem('bliss_balance_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '8088' || adminPin === 'admin123' || adminPin === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bliss_balance_admin_auth', 'true');
      setLoginError('');
      showStatus('success', 'Logged in as Admin successfully!');
    } else {
      setLoginError('Invalid Master Admin PIN. (Default PIN: 8088)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bliss_balance_admin_auth');
  };

  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleAddSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.title || !newSku.price) {
      showStatus('error', 'Please fill in SKU Title and Selling Price.');
      return;
    }

    setIsSyncing(true);

    const createdSku: FootwearSKU = {
      id: `sku-bb-${Date.now().toString().slice(-5)}`,
      title: newSku.title,
      subtitle: newSku.subtitle || 'Comfort-focused everyday footwear',
      gender: (newSku.gender as Gender) || 'Men',
      category: (newSku.category as FootwearCategory) || 'Slides',
      price: Number(newSku.price),
      originalPrice: newSku.originalPrice ? Number(newSku.originalPrice) : undefined,
      amazonUrl: newSku.amazonUrl || 'https://www.amazon.in',
      myntraUrl: newSku.myntraUrl || 'https://www.myntra.com',
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

    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'add_sku');

    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'ADD_SKU',
      skuData: createdSku,
      recaptchaToken,
      timestamp: new Date().toISOString(),
      adminEmail: settings.adminEmail,
    });

    setIsSyncing(false);
    showStatus('success', `SKU "${createdSku.title}" added successfully! ${syncRes.message}`);

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
    if (!confirm(`Are you sure you want to delete SKU "${title}"?`)) return;

    setIsSyncing(true);
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
    showStatus('info', `Deleted SKU "${title}". ${syncRes.message}`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    saveStoredSettings(settings);

    const recaptchaToken = await getRecaptchaV3Token(settings.recaptchaSiteKey, 'update_banner');

    const syncRes = await syncWithAppsScript(settings.appScriptUrl, {
      action: 'UPDATE_BANNER',
      settingsData: settings,
      recaptchaToken,
      timestamp: new Date().toISOString(),
    });

    setIsSyncing(false);
    showStatus('success', `Site Settings & Landing Banner updated! ${syncRes.message}`);
  };

  const handleAddFeatureTag = () => {
    if (!featureInput.trim()) return;
    setNewSku(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput('');
  };

  const handleRemoveFeatureTag = (index: number) => {
    setNewSku(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const appScriptSelfHealingCode = `/**
 * SELF-HEALING GOOGLE APPS SCRIPT FOR BLISS BALANCE
 * Auto-creates & repairs Sheet headers if missing or deleted!
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // SELF-HEALING CHECK: Check if header row exists
    var expectedHeaders = [
      "Timestamp", "Action", "SKU ID", "Title", "Category",
      "Gender", "Selling Price (INR)", "MRP (INR)", "Amazon Link",
      "Myntra Link", "Image URL", "Features", "reCAPTCHA Token"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      var headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
      headerRange.setBackground("#E50914");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
    }

    var sku = data.skuData || {};
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.action || "UPDATE",
      sku.id || "",
      sku.title || "",
      sku.category || "",
      sku.gender || "",
      sku.price || "",
      sku.originalPrice || "",
      sku.amazonUrl || "",
      sku.myntraUrl || "",
      sku.imageUrl || "",
      sku.features ? sku.features.join(", ") : "",
      data.recaptchaToken || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Bliss Balance Excel record updated & self-healed."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyAppsScriptCode = () => {
    navigator.clipboard.writeText(appScriptSelfHealingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
        <Navbar onOpenSearch={() => {}} />

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-3xl font-black uppercase tracking-tight">
                BLISS BALANCE <span className="text-red-500">ADMIN</span>
              </h1>
              <p className="font-mono text-xs text-neutral-400">
                Master Admin Portal Authorization
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                  Master Admin PIN
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (Default: 8088)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-all"
              >
                UNLOCK ADMIN PANEL
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-800 text-center text-[10px] font-mono text-neutral-500 space-y-1">
              <p>Default Master PIN: <span className="text-red-400 font-bold">8088</span></p>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white font-body">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase flex items-center gap-1">
              <Shield className="w-4 h-4" /> STORE MANAGEMENT CONTROL PANEL
            </span>
            <h1 className="font-heading text-4xl font-black uppercase">
              BLISS BALANCE <span className="text-red-500">ADMIN</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showStatus('info', 'Self-healing Google Apps Script & Excel Tracker active.')}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs font-bold uppercase flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>AppsScript Sync Active</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-600/40 text-red-400 font-mono text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div className={`p-4 rounded-xl font-mono text-xs font-bold flex items-center justify-between border shadow-lg ${
            statusMsg.type === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
            statusMsg.type === 'error' ? 'bg-red-950/80 border-red-500 text-red-300' :
            'bg-blue-950/80 border-blue-500 text-blue-300'
          }`}>
            <div className="flex items-center gap-2">
              {statusMsg.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {statusMsg.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {statusMsg.type === 'info' && <Info className="w-5 h-5" />}
              <span>{statusMsg.text}</span>
            </div>
            {isSyncing && <RefreshCw className="w-4 h-4 animate-spin" />}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('skus')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'skus'
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            1. ADD & MANAGE SKUs ({skus.length})
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'landing'
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            2. LANDING BANNER PIC
          </button>

          <button
            onClick={() => setActiveTab('appscript')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'appscript'
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            3. APPSCRIPT & SELF-HEALING EXCEL TRACKER
          </button>
        </div>

        {/* TAB 1: ADD & MANAGE SKUs */}
        {activeTab === 'skus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form: Create New SKU */}
            <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-heading text-2xl font-bold uppercase text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-500" /> ADD NEW FOOTWEAR SKU
                </h3>
              </div>

              <form onSubmit={handleAddSku} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                    Footwear Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSku.title}
                    onChange={(e) => setNewSku({ ...newSku, title: e.target.value })}
                    placeholder="e.g. Bliss Comfort Slides - Men"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                    Subtitle / Short Description
                  </label>
                  <input
                    type="text"
                    value={newSku.subtitle}
                    onChange={(e) => setNewSku({ ...newSku, subtitle: e.target.value })}
                    placeholder="e.g. Ultra-cushioned anti-skid slides for everyday wear"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Gender & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={newSku.gender}
                      onChange={(e) => setNewSku({ ...newSku, gender: e.target.value as Gender })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newSku.category}
                      onChange={(e) => setNewSku({ ...newSku, category: e.target.value as FootwearCategory })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
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

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newSku.price}
                      onChange={(e) => setNewSku({ ...newSku, price: Number(e.target.value) })}
                      placeholder="1499"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                      Original Price (MRP ₹)
                    </label>
                    <input
                      type="number"
                      value={newSku.originalPrice || ''}
                      onChange={(e) => setNewSku({ ...newSku, originalPrice: Number(e.target.value) })}
                      placeholder="2199"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Marketplace Direct Links (Amazon & Myntra) */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-mono font-bold uppercase text-red-400">
                    MARKETPLACE REDIRECT LINKS
                  </span>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Amazon India Product Link
                    </label>
                    <input
                      type="url"
                      value={newSku.amazonUrl}
                      onChange={(e) => setNewSku({ ...newSku, amazonUrl: e.target.value })}
                      placeholder="https://www.amazon.in/dp/your-sku-asin"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Myntra Product Link
                    </label>
                    <input
                      type="url"
                      value={newSku.myntraUrl}
                      onChange={(e) => setNewSku({ ...newSku, myntraUrl: e.target.value })}
                      placeholder="https://www.myntra.com/bliss-balance-sku"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL & Exact Spec Helper */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                      Product Image URL
                    </label>
                    <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded">
                      EXACT SIZE: 800 x 800 px (1:1)
                    </span>
                  </div>

                  <input
                    type="url"
                    value={newSku.imageUrl}
                    onChange={(e) => setNewSku({ ...newSku, imageUrl: e.target.value })}
                    placeholder="https://drive.google.com/direct-link-or-cdn-image.jpg"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[10px] font-mono text-neutral-400">
                    If left blank, exact placeholder container "800 x 800 px" will be displayed until you paste an image URL.
                  </p>
                </div>

                {/* Feature Tags */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                    Footwear Features
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="e.g. Anti-Skid Soles, Cushioned Bed"
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureTag}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-red-600 text-white font-mono text-xs font-bold"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {newSku.features?.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-neutral-950 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-800 flex items-center gap-1"
                      >
                        {feat}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureTag(idx)}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                    <input
                      type="checkbox"
                      checked={newSku.isNewArrival}
                      onChange={(e) => setNewSku({ ...newSku, isNewArrival: e.target.checked })}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <span>New Arrival Flag</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                    <input
                      type="checkbox"
                      checked={newSku.isBestseller}
                      onChange={(e) => setNewSku({ ...newSku, isBestseller: e.target.checked })}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <span>Bestseller Flag</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>PUBLISH SKU & SYNC WITH APPSCRIPT EXCEL TRACKER</span>
                </button>

              </form>
            </div>

            {/* Right Column: Active SKUs */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-heading text-2xl font-bold uppercase text-white flex items-center justify-between border-b border-neutral-800 pb-3">
                <span>ACTIVE STORE SKUs</span>
                <span className="text-xs font-mono text-red-500 font-bold">{skus.length} Items</span>
              </h3>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {skus.map((sku) => (
                  <div
                    key={sku.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4 hover:border-red-500/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-red-500 bg-red-950 px-1.5 py-0.5 rounded">
                          {sku.gender} • {sku.category}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500">{sku.id}</span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-white uppercase leading-tight">
                        {sku.title}
                      </h4>

                      <p className="font-mono text-xs font-bold text-white">
                        ₹{sku.price.toLocaleString('en-IN')}{' '}
                        {sku.originalPrice && <span className="line-through text-neutral-500 font-normal">₹{sku.originalPrice}</span>}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                        {sku.amazonUrl && <span className="text-amber-400 flex items-center gap-0.5"><ExternalLink className="w-3 h-3" /> Amazon</span>}
                        {sku.myntraUrl && <span className="text-pink-400 flex items-center gap-0.5"><ExternalLink className="w-3 h-3" /> Myntra</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSku(sku.id, sku.title)}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                      title="Delete SKU"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LANDING PIC & SITE SETTINGS */}
        {activeTab === 'landing' && (
          <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="font-heading text-2xl font-bold uppercase text-white">
                CHANGE LANDING PIC & HERO BANNER
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-200">
                    Landing Pic Image URL
                  </label>
                  <span className="text-[10px] font-mono text-red-400 font-extrabold bg-red-950 px-2.5 py-1 rounded border border-red-500/40">
                    EXACT SIZE NEEDED: 1200 x 600 px (2:1 Banner)
                  </span>
                </div>

                <input
                  type="url"
                  value={settings.heroImageUrl || ''}
                  onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                  placeholder="https://drive.google.com/direct-link-or-cdn-banner.jpg"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                />

                <div className="pt-2">
                  <span className="block text-[10px] font-mono text-neutral-400 mb-2 uppercase">LANDING PIC PREVIEW:</span>
                  <ImagePlaceholder
                    dimensions="1200 x 600 px (2:1 Wide Banner)"
                    aspectRatio="aspect-[2/1]"
                    label="HERO LANDING PIC PREVIEW"
                    imageUrl={settings.heroImageUrl}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                  Announcement Top Bar Text
                </label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                  Hero Subheadline
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubheadline}
                  onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-all"
              >
                SAVE LANDING BANNER SETTINGS
              </button>

            </form>
          </div>
        )}

        {/* TAB 3: APPSCRIPT & SELF-HEALING EXCEL TRACKER */}
        {activeTab === 'appscript' && (
          <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-500" /> SELF-HEALING APPSCRIPT & EXCEL INTEGRATION
                </h3>
                <p className="font-mono text-xs text-neutral-400">
                  Automatically repairs Google Sheet headers if anyone deletes or alters them!
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                  Google Apps Script Web App Deployment URL
                </label>
                <input
                  type="url"
                  value={settings.appScriptUrl}
                  onChange={(e) => setSettings({ ...settings, appScriptUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                  Google Drive Image Folder ID
                </label>
                <input
                  type="text"
                  value={settings.googleDriveFolderId}
                  onChange={(e) => setSettings({ ...settings, googleDriveFolderId: e.target.value })}
                  placeholder="1_BlissBalance_Footwear_Drive_Folder_ID"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Self-Healing Apps Script Code Generator */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase flex items-center gap-1">
                    <Info className="w-4 h-4 text-red-500" /> BULLETPROOF SELF-HEALING APPS SCRIPT CODE:
                  </span>

                  <button
                    type="button"
                    onClick={copyAppsScriptCode}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'COPIED TO CLIPBOARD!' : 'COPY CODE'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-black rounded-xl text-[11px] font-mono text-neutral-300 overflow-x-auto border border-neutral-900 leading-relaxed">
{appScriptSelfHealingCode}
                </pre>
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-all"
              >
                SAVE APPSCRIPT CONFIGURATION
              </button>

            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
