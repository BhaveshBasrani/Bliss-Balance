'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Lock,
  Tag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  MessageCircle,
  QrCode,
  CreditCard,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { FootwearSKU } from '@/lib/types';
import { INITIAL_SKUS } from '@/lib/initialSkus';
import { fetchSupabaseSKUs } from '@/lib/supabaseClient';
import { syncWithAppsScript } from '@/lib/appScriptSync';
import { BrandLogo } from '@/components/BrandLogo';

interface CheckoutItem {
  sku: FootwearSKU;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  unitPrice: number;
  originalPrice?: number;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allSkus, setAllSkus] = useState<FootwearSKU[]>(INITIAL_SKUS);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'amazon' | 'whatsapp'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1. Load SKU Catalog & Parse Query Params
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const fetched = await fetchSupabaseSKUs();
        if (isMounted && fetched && fetched.length > 0) {
          setAllSkus(fetched);
          parseProducts(fetched);
        } else if (isMounted) {
          parseProducts(INITIAL_SKUS);
        }
      } catch (err) {
        if (isMounted) parseProducts(INITIAL_SKUS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Parse `products` and `coupon` from URL query string
  const parseProducts = (skuCatalog: FootwearSKU[]) => {
    const productsParam =
      searchParams.get('products') ||
      searchParams.get('product') ||
      searchParams.get('sku') ||
      searchParams.get('id') ||
      searchParams.get('items') ||
      '';

    const urlCoupon =
      searchParams.get('coupon') ||
      searchParams.get('couponCode') ||
      searchParams.get('promo') ||
      '';

    if (urlCoupon) {
      applyCouponDirect(urlCoupon);
    }

    if (!productsParam.trim()) {
      // If no product in URL, check if there are saved cart items or default to empty
      setItems([]);
      return;
    }

    const resolvedItems: CheckoutItem[] = [];
    const entries = productsParam.split(',');

    for (const entry of entries) {
      const parts = entry.trim().split(':');
      const productId = parts[0]?.trim();
      const qty = parseInt(parts[1]?.trim() || '1', 10) || 1;

      if (!productId) continue;

      // Find matching SKU
      const foundSku = skuCatalog.find(
        (s) =>
          s.id.toLowerCase() === productId.toLowerCase() ||
          s.title.toLowerCase().includes(productId.toLowerCase())
      );

      if (foundSku) {
        const defaultSize =
          foundSku.sizes && foundSku.sizes.length > 0
            ? foundSku.sizes[0]
            : 'UK 8';
        const defaultColor =
          foundSku.colorVariants && foundSku.colorVariants.length > 0
            ? foundSku.colorVariants[0].name
            : undefined;

        resolvedItems.push({
          sku: foundSku,
          quantity: Math.max(1, qty),
          selectedSize: defaultSize,
          selectedColor: defaultColor,
          unitPrice: foundSku.price,
          originalPrice: foundSku.originalPrice || foundSku.price + 700,
        });
      }
    }

    setItems(resolvedItems);

    // Track Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && (window as any).fbq && resolvedItems.length > 0) {
      try {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_ids: resolvedItems.map((i) => i.sku.id),
          content_type: 'product',
          num_items: resolvedItems.reduce((acc, i) => acc + i.quantity, 0),
          value: resolvedItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
          currency: 'INR',
        });
      } catch (e) {}
    }
  };

  const applyCouponDirect = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    // Bliss Balance coupon engine
    const validDiscounts: Record<string, number> = {
      BLISS10: 10,
      FEELTHEBLISS: 10,
      WELCOME10: 10,
      META10: 10,
      FB10: 10,
      INSTA10: 10,
      OFFICIAL15: 15,
      BLISS20: 20,
    };

    if (validDiscounts[cleanCode]) {
      setAppliedCoupon(cleanCode);
      setCouponDiscountPercent(validDiscounts[cleanCode]);
      setCouponError('');
      setCouponCode(cleanCode);
    } else {
      // Grant standard 10% promotional discount for any shop coupon
      setAppliedCoupon(cleanCode);
      setCouponDiscountPercent(10);
      setCouponError('');
      setCouponCode(cleanCode);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    applyCouponDirect(couponCode);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setCouponCode('');
    setCouponError('');
  };

  // Calculations
  const rawMrpSubtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.originalPrice || item.unitPrice + 700) * item.quantity, 0);
  }, [items]);

  const itemsSubtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [items]);

  const productSavings = useMemo(() => {
    return Math.max(0, rawMrpSubtotal - itemsSubtotal);
  }, [rawMrpSubtotal, itemsSubtotal]);

  const couponSavings = useMemo(() => {
    if (!appliedCoupon || couponDiscountPercent <= 0) return 0;
    return Math.round((itemsSubtotal * couponDiscountPercent) / 100);
  }, [itemsSubtotal, appliedCoupon, couponDiscountPercent]);

  const finalPayableTotal = useMemo(() => {
    return Math.max(0, itemsSubtotal - couponSavings);
  }, [itemsSubtotal, couponSavings]);

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: newQty };
      }
      return updated;
    });
  };

  const updateSize = (index: number, size: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selectedSize: size };
      return updated;
    });
  };

  const updateColor = (index: number, color: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selectedColor: color };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeaturedSku = (sku: FootwearSKU) => {
    const defaultSize = sku.sizes && sku.sizes.length > 0 ? sku.sizes[0] : 'UK 8';
    const defaultColor = sku.colorVariants && sku.colorVariants.length > 0 ? sku.colorVariants[0].name : undefined;
    setItems((prev) => [
      ...prev,
      {
        sku,
        quantity: 1,
        selectedSize: defaultSize,
        selectedColor: defaultColor,
        unitPrice: sku.price,
        originalPrice: sku.originalPrice || sku.price + 700,
      },
    ]);
  };

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, '').slice(-10))) {
      errs.phone = 'Enter a valid 10-digit Indian phone number';
    }
    if (!formData.address.trim()) errs.address = 'Street / House address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit PIN Code';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your checkout is empty. Please add items to proceed.');
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const orderId = `BB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      customer: {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || 'Not Provided',
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        notes: formData.notes.trim(),
      },
      items: items.map((it) => ({
        id: it.sku.id,
        title: it.sku.title,
        price: it.unitPrice,
        quantity: it.quantity,
        size: it.selectedSize,
        color: it.selectedColor || 'Default',
        image: it.sku.imageUrl,
      })),
      pricing: {
        rawMrpSubtotal,
        itemsSubtotal,
        couponSavings,
        couponCode: appliedCoupon || 'None',
        shipping: 0,
        finalTotal: finalPayableTotal,
      },
      paymentMethod,
      source: searchParams.get('utm_source') || searchParams.get('fbclid') ? 'Meta Commerce / Facebook' : 'Official Website',
      timestamp: new Date().toISOString(),
      status: 'Confirmed - Processing',
    };

    // 1. Sync to Google Apps Script
    try {
      const appScriptUrl =
        process.env.NEXT_PUBLIC_APPSCRIPT_URL ||
        'https://script.google.com/macros/s/AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA/exec';

      await syncWithAppsScript(appScriptUrl, {
        action: 'createOrder',
        order: orderPayload,
      });
    } catch (err) {
      console.warn('Apps script sync bypassed:', err);
    }

    // 2. Save locally for user reference
    try {
      const existingOrders = JSON.parse(localStorage.getItem('bliss_orders') || '[]');
      existingOrders.unshift(orderPayload);
      localStorage.setItem('bliss_orders', JSON.stringify(existingOrders.slice(0, 20)));
    } catch (err) {}

    // 3. Track Meta Pixel Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('track', 'Purchase', {
          value: finalPayableTotal,
          currency: 'INR',
          content_ids: items.map((i) => i.sku.id),
          content_type: 'product',
          num_items: items.reduce((acc, i) => acc + i.quantity, 0),
          order_id: orderId,
        });
      } catch (e) {}
    }

    setIsSubmitting(false);
    setCompletedOrderId(orderId);
    setOrderComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp Checkout Shortcut
  const handleWhatsAppCheckout = () => {
    const orderItemsSummary = items
      .map((it) => `• ${it.sku.title} (Size: ${it.selectedSize}${it.selectedColor ? `, Color: ${it.selectedColor}` : ''}) x ${it.quantity} = ₹${it.unitPrice * it.quantity}`)
      .join('%0A');

    const msg = `*NEW ORDER INQUIRY - BLISS BALANCE*%0A%0A*Items:*%0A${orderItemsSummary}%0A%0A*Total Amount:* ₹${finalPayableTotal} (Free Shipping)%0A${appliedCoupon ? `*Coupon:* ${appliedCoupon}%0A` : ''}*Customer:* ${formData.fullName || 'Customer'}%0A*Phone:* ${formData.phone || ''}%0A*Address:* ${formData.address || ''}, ${formData.city || ''} ${formData.pincode || ''}%0A%0APlease confirm my order delivery timeline!`;

    window.open(`https://wa.me/919440961776?text=${msg}`, '_blank');
  };

  // Amazon Direct Shortcut
  const handleAmazonDirect = () => {
    const firstItem = items[0];
    const amazonLink =
      firstItem?.sku?.amazonUrl ||
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3';
    window.open(amazonLink, '_blank');
  };

  // ----------------------------------------------------
  // RENDER: SUCCESS SCREEN
  // ----------------------------------------------------
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-mono flex flex-col justify-between">
        <header className="border-b border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo className="w-8 h-8 text-white" />
              <span className="font-heading font-black tracking-wider text-lg uppercase">BLISS BALANCE</span>
            </Link>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>ORDER SECURED</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">FEEL THE BLISS • OFFICIAL ORDER</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-neutral-400 text-sm max-w-md mx-auto">
              Your order <span className="text-white font-bold">{completedOrderId}</span> has been confirmed. Our team in Hyderabad is packaging your cushioned footwear for dispatch.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">ORDER REFERENCE</span>
                <p className="font-heading text-xl font-black text-white">{completedOrderId}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-neutral-400 uppercase">ESTIMATED DELIVERY</span>
                <p className="text-sm font-bold text-emerald-400">2 - 4 Business Days (All India Express)</p>
              </div>
            </div>

            {/* Itemized summary */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-neutral-400">ORDERED PRODUCTS</span>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-800/60 gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.sku.imageUrl && (
                      <div className="w-12 h-12 bg-neutral-800 flex-shrink-0 relative overflow-hidden border border-neutral-700">
                        <img src={item.sku.imageUrl} alt={item.sku.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-black text-white">{item.sku.title}</p>
                      <p className="text-neutral-400 text-[11px]">
                        Size: {item.selectedSize} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-white whitespace-nowrap">₹{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="font-black text-neutral-400 uppercase">Total Amount ({paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid/UPI'})</span>
              <span className="font-heading font-black text-2xl text-red-500">₹{finalPayableTotal}</span>
            </div>

            {/* Shipping Address */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 text-xs space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-black">DELIVERY ADDRESS:</span>
              <p className="text-white font-bold">{formData.fullName} • {formData.phone}</p>
              <p className="text-neutral-400">{formData.address}, {formData.landmark ? `${formData.landmark}, ` : ''}{formData.city}, {formData.state} - {formData.pincode}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsAppCheckout}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-400 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>GET ORDER UPDATES ON WHATSAPP</span>
            </button>
            <button
              onClick={() => router.push('/collections')}
              className="flex-1 py-4 bg-white text-black hover:bg-neutral-200 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Bliss Balance Footwear. Official Store. All Rights Reserved.
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: MAIN CHECKOUT FLOW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-mono flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* TOP HEADER */}
      <header className="border-b border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8 text-white" />
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-wider text-lg uppercase text-white">BLISS BALANCE</span>
              <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase -mt-1">OFFICIAL STORE CHECKOUT</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">256-BIT SSL ENCRYPTED</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 px-3 py-1 text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>FREE SHIPPING INCLUDED</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1">
        {/* Breadcrumb / Headline */}
        <div className="mb-8 space-y-1">
          <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase font-black">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collections" className="hover:text-white transition-colors">CATALOG</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-red-500">EXPRESS CHECKOUT</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            COMPLETE YOUR ORDER
          </h1>
        </div>

        {/* IF EMPTY CART STATE */}
        {items.length === 0 && !isLoading && (
          <div className="bg-neutral-900 border border-neutral-800 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-black uppercase">YOUR CHECKOUT IS EMPTY</h2>
              <p className="text-neutral-400 text-xs max-w-md mx-auto">
                No products were detected in the checkout URL. Select from our bestsellers below or explore the complete collection.
              </p>
            </div>

            {/* Quick-add bestsellers */}
            <div className="pt-4 border-t border-neutral-800 text-left space-y-3">
              <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">POPULAR CUSHIONED FOOTWEAR:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allSkus.slice(0, 4).map((sku) => (
                  <div key={sku.id} className="p-3 bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {sku.imageUrl && (
                        <div className="w-10 h-10 bg-neutral-800 flex-shrink-0 relative overflow-hidden border border-neutral-700">
                          <img src={sku.imageUrl} alt={sku.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-black text-xs text-white truncate">{sku.title}</p>
                        <p className="text-[11px] text-red-500 font-black">₹{sku.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addFeaturedSku(sku)}
                      className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 font-black text-[10px] uppercase flex-shrink-0"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/collections"
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest border border-red-500"
              >
                BROWSE ALL FOOTWEAR
              </Link>
            </div>
          </div>
        )}

        {/* ACTIVE CHECKOUT LAYOUT */}
        {items.length > 0 && (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: CUSTOMER & DELIVERY INFO (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. SHIPPING ADDRESS */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-red-600 text-white font-black text-xs flex items-center justify-center">1</div>
                    <h2 className="font-heading text-lg font-black uppercase text-white">DELIVERY ADDRESS</h2>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">ALL INDIA EXPRESS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhavesh Basrani"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                    {formErrors.fullName && <p className="text-[10px] text-red-500 font-black">{formErrors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      MOBILE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="bg-neutral-800 border border-neutral-800 border-r-0 px-3 py-3 text-xs text-neutral-400 font-bold flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9440961776"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    {formErrors.phone && <p className="text-[10px] text-red-500 font-black">{formErrors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      EMAIL ADDRESS <span className="text-neutral-500">(FOR RECEIPT)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="support@blissbalance.co"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      STREET ADDRESS / HOUSE NO. / BUILDING <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Novel House, Road No. 1, Muralidhar Bagh, Abids"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                    {formErrors.address && <p className="text-[10px] text-red-500 font-black">{formErrors.address}</p>}
                  </div>

                  {/* Landmark */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      LANDMARK <span className="text-neutral-500">(OPTIONAL)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Near ISKCON Temple"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* PIN Code */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      PIN CODE <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="500012"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                    {formErrors.pincode && <p className="text-[10px] text-red-500 font-black">{formErrors.pincode}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      CITY <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Hyderabad"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                    {formErrors.city && <p className="text-[10px] text-red-500 font-black">{formErrors.city}</p>}
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-neutral-300">
                      STATE <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Telangana"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                    />
                    {formErrors.state && <p className="text-[10px] text-red-500 font-black">{formErrors.state}</p>}
                  </div>
                </div>
              </div>

              {/* 2. PAYMENT METHOD SELECTION */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-red-600 text-white font-black text-xs flex items-center justify-center">2</div>
                    <h2 className="font-heading text-lg font-black uppercase text-white">PAYMENT METHOD</h2>
                  </div>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">100% SECURE CHECKOUT</span>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-neutral-950 border-red-500 ring-1 ring-red-500'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 accent-red-600"
                        />
                        <div>
                          <p className="font-black text-xs uppercase text-white">CASH ON DELIVERY (COD)</p>
                          <p className="text-neutral-400 text-[11px]">Pay with cash or UPI QR scanner upon delivery at your doorstep.</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-800">
                        MOST POPULAR
                      </span>
                    </div>
                  </label>

                  {/* UPI / QR Online */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-neutral-950 border-red-500 ring-1 ring-red-500'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="mt-1 accent-red-600"
                        />
                        <div>
                          <p className="font-black text-xs uppercase text-white">INSTANT UPI / QR CODE</p>
                          <p className="text-neutral-400 text-[11px]">Pay via Google Pay, PhonePe, Paytm, BHIM UPI or Cards.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-neutral-400" />
                      </div>
                    </div>
                  </label>

                  {/* WhatsApp Support Order */}
                  <label
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-neutral-950 border-red-500 ring-1 ring-red-500'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'whatsapp'}
                          onChange={() => setPaymentMethod('whatsapp')}
                          className="mt-1 accent-red-600"
                        />
                        <div>
                          <p className="font-black text-xs uppercase text-white">ORDER VIA WHATSAPP CONCIERGE</p>
                          <p className="text-neutral-400 text-[11px]">Connect directly with our Hyderabad headquarters support team on WhatsApp.</p>
                        </div>
                      </div>
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Official Marketplace Fallback Notice */}
              <div className="bg-neutral-900/60 border border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-neutral-400">Prefer Amazon Prime Guarantee?</span>
                </div>
                <button
                  type="button"
                  onClick={handleAmazonDirect}
                  className="px-4 py-2 bg-[#FF9900] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#e68a00] transition-colors"
                >
                  <span>BUY ON AMAZON INDIA</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & TOTAL (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6 sticky top-24">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <h2 className="font-heading text-lg font-black uppercase text-white">ORDER ITEMS ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
                  <span className="text-[10px] font-black text-neutral-400 uppercase">PRICE (INR)</span>
                </div>

                {/* ITEMS LIST */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {items.map((item, index) => {
                    const availableSizes =
                      item.sku.sizes && item.sku.sizes.length > 0
                        ? item.sku.sizes
                        : ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

                    return (
                      <div
                        key={`${item.sku.id}-${index}`}
                        className="p-3 bg-neutral-950 border border-neutral-800/80 space-y-3"
                      >
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex-shrink-0 relative overflow-hidden">
                            {item.sku.imageUrl ? (
                              <img src={item.sku.imageUrl} alt={item.sku.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-600 font-black">
                                BLISS
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-black text-xs text-white truncate">{item.sku.title}</p>
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-neutral-500 hover:text-red-500 p-0.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-red-500 font-black">₹{item.unitPrice}</span>
                              {item.originalPrice && (
                                <span className="text-neutral-500 line-through">₹{item.originalPrice}</span>
                              )}
                            </div>

                            {/* Size selector dropdown */}
                            <div className="flex items-center gap-2 pt-1">
                              <label className="text-[10px] text-neutral-400 font-bold uppercase">SIZE:</label>
                              <select
                                value={item.selectedSize}
                                onChange={(e) => updateSize(index, e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 text-white text-[11px] font-bold px-2 py-0.5 focus:outline-none"
                              >
                                {availableSizes.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-850">
                          <span className="text-[10px] font-black uppercase text-neutral-400">QUANTITY</span>
                          <div className="flex items-center border border-neutral-700 bg-neutral-900">
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, -1)}
                              className="px-2 py-1 text-neutral-300 hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-xs font-black text-white">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, 1)}
                              className="px-2 py-1 text-neutral-300 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* COUPON INPUT SECTION */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-red-500" />
                    <span>HAVE A PROMO / COUPON CODE?</span>
                  </span>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-black">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>COUPON {appliedCoupon} APPLIED ({couponDiscountPercent}% OFF)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-neutral-400 hover:text-red-400 text-[10px] uppercase font-bold underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. BLISS10 / META10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-600 uppercase focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs uppercase border border-neutral-700"
                      >
                        APPLY
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
                </div>

                {/* PRICE BREAKDOWN TABLE */}
                <div className="pt-2 border-t border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Items Total (MRP)</span>
                    <span className="line-through">₹{rawMrpSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400">
                    <span>Store Discount</span>
                    <span>- ₹{productSavings}</span>
                  </div>

                  {couponSavings > 0 && (
                    <div className="flex justify-between text-emerald-400 font-black">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>- ₹{couponSavings}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-300">
                    <span>All India Express Delivery</span>
                    <span className="text-emerald-400 font-black uppercase">FREE</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-neutral-800">
                    <div>
                      <span className="font-heading font-black text-base uppercase text-white">TOTAL PAYABLE</span>
                      <p className="text-[10px] text-neutral-500">Includes all GST & Taxes</p>
                    </div>
                    <span className="font-heading font-black text-2xl text-red-500">₹{finalPayableTotal}</span>
                  </div>
                </div>

                {/* CTA BUTTON */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-heading font-black text-sm uppercase tracking-widest border-2 border-red-500 shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>SECURING YOUR ORDER...</span>
                    ) : (
                      <>
                        <span>
                          {paymentMethod === 'cod'
                            ? `PLACE ORDER (₹${finalPayableTotal} COD)`
                            : paymentMethod === 'upi'
                            ? `PAY NOW (₹${finalPayableTotal} UPI)`
                            : `CONFIRM WHATSAPP ORDER`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800 text-[9px] font-black text-center text-neutral-400">
                    <div className="p-2 bg-neutral-950 border border-neutral-850 space-y-1">
                      <Truck className="w-3.5 h-3.5 text-white mx-auto" />
                      <span>FAST DISPATCH</span>
                    </div>
                    <div className="p-2 bg-neutral-950 border border-neutral-850 space-y-1">
                      <RotateCcw className="w-3.5 h-3.5 text-white mx-auto" />
                      <span>7-DAY EXCHANGE</span>
                    </div>
                    <div className="p-2 bg-neutral-950 border border-neutral-850 space-y-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-white mx-auto" />
                      <span>100% ORIGINAL</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 py-6 bg-black text-center text-xs text-neutral-500 space-y-2">
        <p className="font-heading font-black uppercase tracking-wider text-neutral-400">
          BLISS BALANCE FOOTWEAR • HYDERABAD, INDIA
        </p>
        <p className="text-[11px] text-neutral-600">
          Official Support: +91 94409 61776 • support@blissbalance.co • 7-Day Easy Returns & Replacements
        </p>
      </footer>
    </div>
  );
}

export { CheckoutClient };
