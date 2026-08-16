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

export interface FootwearSKU {
  id: string;
  title: string;
  subtitle: string;
  gender: Gender;
  category: FootwearCategory;
  price: number;
  originalPrice?: number;
  amazonUrl: string;
  myntraUrl: string;
  imageUrl?: string;
  imageDimensions: string; // e.g. "800 x 800 px (1:1)"
  features: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  gender: Gender;
  description: string;
  imageDimensions: string; // e.g. "600 x 800 px (3:4)"
  imageUrl?: string;
  slug: string;
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
