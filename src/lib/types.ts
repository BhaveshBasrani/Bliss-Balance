export type FootwearCategory = 
  | 'Slippers'
  | 'Flip-Flops'
  | 'Slides'
  | 'Sandals'
  | 'Clogs'
  | 'Casual Shoes'
  | 'Sneakers'
  | 'Loafers'
  | 'Formal Footwear'
  | 'Flats'
  | 'Heels';

export type Gender = 'Men' | 'Women' | 'Unisex';

export interface ColorVariant {
  name: string;
  hex: string;
  imageUrl?: string;
  amazonUrl?: string;
  myntraUrl?: string;
  flipkartUrl?: string;
}

export interface SizeMarketplaceUrl {
  size: string;
  amazonUrl?: string;
  myntraUrl?: string;
  flipkartUrl?: string;
}

export interface FootwearSKU {
  id: string;
  title: string;
  subtitle: string;
  gender: Gender;
  category: FootwearCategory;
  price: number;
  originalPrice?: number;
  amazonUrl?: string;
  myntraUrl?: string;
  flipkartUrl?: string;
  officialUrl?: string;
  imageUrl?: string;
  hoverImageUrl?: string;
  galleryImages?: string[];
  imageDimensions?: string;
  features: string[];
  sizes?: string[];
  colorVariants?: ColorVariant[];
  sizeMarketplaceUrls?: Record<string, SizeMarketplaceUrl>;
  rating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  gender: Gender;
  description: string;
  imageDimensions: string;
  imageUrl?: string;
  slug: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  location?: string;
  rating: number;
  headline: string;
  comment: string;
  verified: boolean;
  date: string;
}

export interface SiteSettings {
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl?: string;
  heroImageDimensions: string;
  appScriptUrl: string;
  googleDriveFolderId: string;
  recaptchaSiteKey: string;
  adminEmail: string;
}
