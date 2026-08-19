'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';
import { getStoredSKUs, fetchSingleProduct, getStoredReviews, saveStoredReviews } from '@/lib/dataStore';
import { syncWithAppsScript } from '@/lib/appScriptSync';
import { FootwearSKU, ProductReview, ColorVariant } from '@/lib/types';
import {
  Star,
  Heart,
  Ruler,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Plus,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Zap,
} from 'lucide-react';

const REVIEWS_STORAGE_KEY = 'bliss_balance_reviews_v2';
const PREFERRED_SIZE_KEY = 'bliss_balance_preferred_size';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();

  const [sku, setSku] = useState<FootwearSKU | null>(null);
  const [allSkus, setAllSkus] = useState<FootwearSKU[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('UK 8');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Dynamic Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    authorName: '',
    rating: 5,
    headline: '',
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    // Load Preferred Size
    try {
      const savedSize = localStorage.getItem(PREFERRED_SIZE_KEY);
      if (savedSize) {
        setSelectedSize(savedSize);
      }
    } catch (e) {}

    // INSTANT LOCAL CACHE HYDRATION (0ms Load)
    const targetId = decodeURIComponent(productId).trim().toLowerCase();
    const loadedSkus = getStoredSKUs();
    setAllSkus(loadedSkus);
    
    const found = loadedSkus.find(s => 
      s.id.toLowerCase() === targetId || 
      encodeURIComponent(s.id).toLowerCase() === targetId
    );

    if (found) {
      setSku(found);
      const activeColorImg = (found.colorVariants && found.colorVariants.length > 0 && found.colorVariants[0].imageUrl && found.colorVariants[0].imageUrl.trim() !== '')
        ? found.colorVariants[0].imageUrl
        : (found.imageUrl || '');

      setSelectedImage(activeColorImg);
      if (found.colorVariants && found.colorVariants.length > 0) {
        setSelectedColor(found.colorVariants[0].name);
      }
      setIsLoading(false);
    }

    // TARGETED SINGLE-PRODUCT CLOUD FETCH (Only if missing or refreshing this 1 product)
    if (!found || !found.galleryImages || found.galleryImages.length === 0) {
      fetchSingleProduct(productId).then(cloudFound => {
        if (cloudFound) {
          setSku(cloudFound);
          const cloudImg = (cloudFound.colorVariants && cloudFound.colorVariants.length > 0 && cloudFound.colorVariants[0].imageUrl && cloudFound.colorVariants[0].imageUrl.trim() !== '')
            ? cloudFound.colorVariants[0].imageUrl
            : (cloudFound.imageUrl || '');

          setSelectedImage(prev => (prev && prev.trim() !== '') ? prev : cloudImg);
          if (cloudFound.colorVariants && cloudFound.colorVariants.length > 0 && !selectedColor) {
            setSelectedColor(cloudFound.colorVariants[0].name);
          }
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    // Check Wishlist
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setIsWishlisted(ids.includes(productId));
      }
    } catch (e) {}

    // Live Dynamic Fetch of Customer Reviews
    fetchLiveReviewsFromCloud(productId);
  }, [productId]);

  const fetchLiveReviewsFromCloud = async (prodId: string) => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const allReviews: ProductReview[] = JSON.parse(stored);
        setReviews(allReviews.filter(r => r.productId === prodId));
      }
    } catch (e) {}

    try {
      const appScriptUrl = process.env.NEXT_PUBLIC_APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA/exec';
      const res = await fetch(`${appScriptUrl}?action=getReviews`, { method: 'GET' });
      const data = await res.json();
      if (data && data.reviews && Array.isArray(data.reviews)) {
        const prodReviews = data.reviews.filter((r: ProductReview) => r.productId === prodId);
        setReviews(prodReviews);

        const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
        const localReviews: ProductReview[] = stored ? JSON.parse(stored) : [];
        const otherProdReviews = localReviews.filter(r => r.productId !== prodId);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify([...prodReviews, ...otherProdReviews]));
      }
    } catch (e) {
      console.warn('Could not fetch live reviews:', e);
    }
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    try {
      localStorage.setItem(PREFERRED_SIZE_KEY, size);
    } catch (e) {}
  };

  const toggleWishlist = () => {
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      let wishlistIds: string[] = stored ? JSON.parse(stored) : [];
      if (wishlistIds.includes(productId)) {
        wishlistIds = wishlistIds.filter(id => id !== productId);
        setIsWishlisted(false);
      } else {
        wishlistIds.push(productId);
        setIsWishlisted(true);
      }
      localStorage.setItem('bliss_balance_wishlist', JSON.stringify(wishlistIds));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {}
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName || !newReview.comment) return;

    setSubmittingReview(true);

    const createdReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      authorName: newReview.authorName,
      rating: newReview.rating,
      headline: newReview.headline || 'Excellent Footwear!',
      comment: newReview.comment,
      verified: true,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [createdReview, ...reviews];
    setReviews(updated);

    try {
      const allReviews = getStoredReviews();
      saveStoredReviews([createdReview, ...allReviews]);
    } catch (e) {}

    try {
      const appScriptUrl = process.env.NEXT_PUBLIC_APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA/exec';
      await syncWithAppsScript(appScriptUrl, {
        action: 'submitReview',
        review: createdReview,
      });
    } catch (e) {}

    setSubmittingReview(false);
    setShowReviewForm(false);
    setReviewMsg('Thank you! Your review has been saved live to Google Sheets.');
    setTimeout(() => setReviewMsg(''), 5000);
    setNewReview({ authorName: '', rating: 5, headline: '', comment: '' });
  };

  const handleDeleteMyReview = (revId: string) => {
    const updated = reviews.filter(r => r.id !== revId);
    setReviews(updated);
    try {
      const all = getStoredReviews();
      const nextAll = all.filter(r => r.id !== revId);
      saveStoredReviews(nextAll);
    } catch (e) {}
  };

  if (isLoading && !sku) {
    return <BrandLoadingScreen message="FEEL THE BLISS • LOADING PRODUCT..." />;
  }

  if (!sku) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col justify-between font-mono">
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 flex flex-col items-center justify-center p-8 font-mono space-y-4">
          <p className="text-sm text-neutral-500 uppercase font-black">PRODUCT NOT FOUND</p>
          <button
            onClick={() => router.push('/collections')}
            className="px-6 py-3 rounded-none bg-red-600 text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            RETURN TO CATALOG
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const rawSizes = sku.sizes && sku.sizes.length > 0
    ? sku.sizes
    : ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

  const availableSizes = [...rawSizes].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const discountPercent = sku.originalPrice
    ? Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const displayColorVariants: ColorVariant[] = sku.colorVariants || [];

  const activeColorObj = displayColorVariants.find(cv => cv.name === selectedColor);
  const activeSizeLinkObj = sku.sizeMarketplaceUrls ? sku.sizeMarketplaceUrls[selectedSize] : undefined;

  let resolvedAmazonUrl = (activeSizeLinkObj && activeSizeLinkObj.amazonUrl && activeSizeLinkObj.amazonUrl.trim() !== '')
    ? activeSizeLinkObj.amazonUrl
    : (activeColorObj && activeColorObj.amazonUrl && activeColorObj.amazonUrl.trim() !== '')
      ? activeColorObj.amazonUrl
      : sku.amazonUrl;

  if (resolvedAmazonUrl && resolvedAmazonUrl.includes('amazon.in') && !resolvedAmazonUrl.includes('th=1')) {
    const separator = resolvedAmazonUrl.includes('?') ? '&' : '?';
    resolvedAmazonUrl = `${resolvedAmazonUrl}${separator}th=1&psc=1`;
  }

  const resolvedMyntraUrl = (activeSizeLinkObj && activeSizeLinkObj.myntraUrl && activeSizeLinkObj.myntraUrl.trim() !== '')
    ? activeSizeLinkObj.myntraUrl
    : (activeColorObj && activeColorObj.myntraUrl && activeColorObj.myntraUrl.trim() !== '')
      ? activeColorObj.myntraUrl
      : sku.myntraUrl;

  const resolvedFlipkartUrl = (activeSizeLinkObj && activeSizeLinkObj.flipkartUrl && activeSizeLinkObj.flipkartUrl.trim() !== '')
    ? activeSizeLinkObj.flipkartUrl
    : (activeColorObj && activeColorObj.flipkartUrl && activeColorObj.flipkartUrl.trim() !== '')
      ? activeColorObj.flipkartUrl
      : sku.flipkartUrl;

  const hasAnyMarketplaceUrl = (resolvedAmazonUrl && resolvedAmazonUrl.trim() !== '') ||
    (resolvedMyntraUrl && resolvedMyntraUrl.trim() !== '') ||
    (resolvedFlipkartUrl && resolvedFlipkartUrl.trim() !== '');

  const allGalleryThumbnails: Array<{ url: string; label: string }> = [];
  
  if (activeColorObj && activeColorObj.imageUrl && activeColorObj.imageUrl.trim() !== '') {
    allGalleryThumbnails.push({ url: activeColorObj.imageUrl, label: activeColorObj.name });
  } else if (sku.imageUrl) {
    allGalleryThumbnails.push({ url: sku.imageUrl, label: 'Primary' });
  }

  if (sku.hoverImageUrl) allGalleryThumbnails.push({ url: sku.hoverImageUrl, label: 'Angle 2' });
  
  sku.galleryImages?.forEach((img, i) => {
    if (img && img.trim() !== '') allGalleryThumbnails.push({ url: img, label: `Catalog ${i + 1}` });
  });

  sku.colorVariants?.forEach((cv) => {
    if (cv.imageUrl && cv.imageUrl.trim() !== '' && cv.name !== selectedColor) {
      allGalleryThumbnails.push({ url: cv.imageUrl, label: cv.name });
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-8 sm:space-y-12">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-mono text-xs font-black text-neutral-600 dark:text-neutral-400 hover:text-red-600 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO CATALOG
        </button>

        {/* Top Product Section: Dual Image Gallery & Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Multi-Photo Gallery Stage */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 shadow-sm">
              {(selectedImage && selectedImage.trim() !== '') || (sku.imageUrl && sku.imageUrl.trim() !== '') ? (
                <img
                  src={(selectedImage && selectedImage.trim() !== '') ? selectedImage : sku.imageUrl}
                  alt={sku.title}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-400">
                  NO IMAGE
                </div>
              )}

              {/* Wishlist Floating Button */}
              <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full border transition-all ${
                  isWishlisted 
                    ? 'bg-red-600 text-white border-red-600 scale-105 shadow-md' 
                    : 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {allGalleryThumbnails.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(item.url)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all shrink-0 p-1 bg-white dark:bg-black ${
                    selectedImage === item.url 
                      ? 'border-red-600 ring-2 ring-red-600/30' 
                      : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                  }`}
                  title={item.label}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Product Specs & Dynamic Marketplace Buying Buttons */}
          <div className="lg:col-span-5 space-y-6 font-mono">
            
            <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1 rounded-full">
                  {sku.gender} • {sku.category}
                </span>

                {discountPercent > 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-900 text-emerald-400 dark:bg-neutral-800 px-3 py-1 rounded-full">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                {sku.title}
              </h1>

              <p className="font-mono text-xs text-neutral-500 font-bold">
                {sku.subtitle}
              </p>

              {/* Price & Rating */}
              <div className="flex items-baseline justify-between pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-neutral-950 dark:text-white">
                    ₹{sku.price.toLocaleString('en-IN')}
                  </span>
                  {sku.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{sku.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm font-black text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-[10px] text-neutral-400">({reviews.length})</span>
                </div>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            {displayColorVariants.length > 0 && (
              <div className="space-y-3 pt-2 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 tracking-wider">
                    COLOR: <span className="text-red-600">{selectedColor || displayColorVariants[0].name}</span>
                  </label>
                  <span className="text-[10px] text-neutral-400 font-black uppercase flex items-center gap-1">
                    <span>{displayColorVariants.length} VARIANTS</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Side-by-Side Shoe Photo Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {displayColorVariants.map((cv) => {
                    const isSelected = (selectedColor || displayColorVariants[0].name) === cv.name;
                    return (
                      <button
                        key={cv.name}
                        onClick={() => {
                          setSelectedColor(cv.name);
                          if (cv.imageUrl) setSelectedImage(cv.imageUrl);
                        }}
                        className={`relative rounded-xl overflow-hidden p-2 transition-all flex flex-col items-center gap-1 bg-white dark:bg-black border ${
                          isSelected
                            ? 'border-red-600 ring-2 ring-red-600/30 bg-red-50/20 dark:bg-red-950/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 p-1 flex items-center justify-center">
                          {cv.imageUrl ? (
                            <img src={cv.imageUrl} alt={cv.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ backgroundColor: cv.hex }} />
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase text-neutral-950 dark:text-white truncate max-w-full">
                          {cv.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200">
                  SELECT SIZE: <span className="text-red-600">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-black text-red-600 hover:text-red-500 uppercase flex items-center gap-1 underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>SIZE GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSelectSize(size)}
                    className={`py-3 rounded-lg text-xs font-black uppercase border transition-all ${
                      selectedSize === size
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-red-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC MARKETPLACE BUYING BUTTONS */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  BUY ON OFFICIAL MARKETPLACES:
                </span>
                <span className="text-[9px] font-bold text-red-600 uppercase bg-red-50 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800 self-start sm:self-auto break-words">
                  RESOLVED FOR {selectedSize} {selectedColor ? `• ${selectedColor}` : ''}
                </span>
              </div>

              {resolvedAmazonUrl && resolvedAmazonUrl.trim() !== '' && (
                <a
                  href={resolvedAmazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#FF9900] hover:bg-[#e68a00] text-black font-black text-xs uppercase tracking-widest border border-amber-500 shadow-sm transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>BUY NOW ON AMAZON INDIA ({selectedSize})</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {resolvedMyntraUrl && resolvedMyntraUrl.trim() !== '' && (
                <a
                  href={resolvedMyntraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#ff3f6c] hover:bg-[#e6355d] text-white font-black text-xs uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>BUY NOW ON MYNTRA</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {resolvedFlipkartUrl && resolvedFlipkartUrl.trim() !== '' && (
                <a
                  href={resolvedFlipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#2874f0] hover:bg-[#1f62d1] text-white font-black text-xs uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>BUY NOW ON FLIPKART</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {!hasAnyMarketplaceUrl && (
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center text-xs font-black text-neutral-500 uppercase">
                  COMING SOON ON AMAZON, MYNTRA & FLIPKART
                </div>
              )}
            </div>

            {/* Service & Assurance Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[10px] font-black text-center text-neutral-900 dark:text-neutral-100">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <Truck className="w-4 h-4 text-red-600 mx-auto" />
                <span>FAST SHIPPING</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <RotateCcw className="w-4 h-4 text-red-600 mx-auto" />
                <span>7-DAY RETURNS</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <ShieldCheck className="w-4 h-4 text-red-600 mx-auto" />
                <span>100% ORIGINAL</span>
              </div>
            </div>

          </div>

        </div>

        {/* DYNAMIC REVIEWS & RATINGS SYSTEM */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8 font-mono">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-red-600 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> VERIFIED CUSTOMER REVIEWS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase text-neutral-950 dark:text-white">
                RATINGS & REVIEWS ({reviews.length})
              </h2>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-wider border border-red-600 transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WRITE A REVIEW</span>
            </button>
          </div>

          {reviewMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{reviewMsg}</span>
            </div>
          )}

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-lg space-y-4 max-w-2xl">
              <h3 className="font-heading text-xl font-black uppercase text-neutral-950 dark:text-white">
                SUBMIT YOUR REVIEW
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newReview.authorName}
                    onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                    placeholder="e.g. Rahul M."
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">Rating *</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none font-black"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                    <option value={2}>⭐⭐ 2 Stars (Below Average)</option>
                    <option value={1}>⭐ 1 Star (Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReview.headline}
                  onChange={(e) => setNewReview({ ...newReview, headline: e.target.value })}
                  placeholder="e.g. Extremely soft slippers!"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 mb-1">Review Details *</label>
                <textarea
                  rows={3}
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Write your honest review..."
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-neutral-950 dark:text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black text-xs uppercase border border-neutral-300 dark:border-neutral-700"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {/* Dynamic Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-3">
              <Star className="w-10 h-10 text-amber-500 mx-auto fill-amber-400" />
              <p className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white">
                NO REVIEWS YET FOR THIS PRODUCT
              </p>
              <p className="text-xs text-neutral-500 font-mono font-bold max-w-sm mx-auto">
                Be the first customer to write a verified review for {sku.title}!
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase border border-red-600 shadow-sm hover:bg-neutral-950 transition-all"
              >
                <Plus className="w-4 h-4" /> WRITE FIRST REVIEW
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-neutral-950 dark:text-white uppercase">{rev.authorName}</span>
                      {rev.verified && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          VERIFIED BUYER
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-neutral-400">{rev.date}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMyReview(rev.id)}
                        className="text-[10px] font-black text-neutral-400 hover:text-red-600 uppercase underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {rev.headline && (
                    <p className="font-heading text-sm font-black text-neutral-900 dark:text-white uppercase">{rev.headline}</p>
                  )}
                  <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={allSkus} />
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} initialGender={sku.gender as any} />
    </div>
  );
}
