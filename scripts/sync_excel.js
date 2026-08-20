/**
 * Bliss Balance - Official Product Catalog Sync Utility (Node.js)
 * Syncs all sheets (Products, Colour Images, Variant Matrix) from Bliss_Balance_Exact.xlsx
 * into Supabase Database and local initialSkus.ts.
 * Usage: npm run sync:excel
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const SUPABASE_URL = 'https://ummvwrzzxehetmtaugop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXZ3cnp6eGVoZXRtdGF1Z29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1NzIsImV4cCI6MjEwMjYyODU3Mn0.CWzbUjICztb1Ga3u_gxjicbe362ZR519OdJK5YItu2E';

let excelPath = path.resolve('Bliss_Balance_Exact.xlsx');
if (!fs.existsSync(excelPath)) {
  const altPath = path.join(require('os').homedir(), 'Downloads', 'Bliss_Balance_Exact_Excel_Scraper_FIXED_ROWS', 'exactfix', 'output', 'Bliss_Balance_Exact.xlsx');
  if (fs.existsSync(altPath)) {
    excelPath = altPath;
  } else {
    console.error(`Error: Bliss_Balance_Exact.xlsx not found in workspace.`);
    process.exit(1);
  }
}

console.log(`>>> [1/4] Reading Excel workbook: ${excelPath}...`);
const workbook = XLSX.readFile(excelPath);

const wsProducts = XLSX.utils.sheet_to_json(workbook.Sheets['Products'] || workbook.Sheets[workbook.SheetNames[0]]);
const wsColors = XLSX.utils.sheet_to_json(workbook.Sheets['Colour Images'] || workbook.Sheets[workbook.SheetNames[1]]);
const wsVariants = XLSX.utils.sheet_to_json(workbook.Sheets['Variant Matrix'] || workbook.Sheets[workbook.SheetNames[2]]);

// 1. Build input_asin -> parent_asin & sizes map from Variant Matrix
const inputToParent = {};
const sizesByParent = {};
const sizeUrlsByParent = {};

for (const row of wsVariants) {
  const pAsin = String(row['parent_asin'] || '').trim();
  const iAsin = String(row['input_asin'] || '').trim();
  const rawSize = String(row['size'] || '').trim();
  const vAsin = String(row['variant_asin'] || '').trim();
  const vLink = String(row['variant_link'] || '').trim() || (vAsin ? `https://www.amazon.in/dp/${vAsin}` : '');

  if (iAsin && pAsin) {
    inputToParent[iAsin] = pAsin;
  }

  if (pAsin && rawSize) {
    const match = rawSize.match(/(\d+(?:\.\d+)?)/);
    const normSize = match ? `UK ${match[1]}` : rawSize;

    if (!sizesByParent[pAsin]) {
      sizesByParent[pAsin] = new Set();
      sizeUrlsByParent[pAsin] = {};
    }
    sizesByParent[pAsin].add(normSize);
    if (!sizeUrlsByParent[pAsin][normSize] && vLink) {
      sizeUrlsByParent[pAsin][normSize] = vLink;
    }
  }
}

// 2. Build Colour Images map by parent_asin
const colorEntriesByParent = {};

function cleanHiresUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return url;
  if (url.includes('media-amazon.com')) {
    url = url.replace(/\._[A-Z0-9_,]+_\./, '.');
    if (!url.endsWith('._SL1500_.jpg')) {
      url = url.replace(/\.jpg$/, '._SL1500_.jpg');
    }
  }
  return url;
}

for (const row of wsColors) {
  const pAsin = String(row['parent_asin'] || '').trim();
  const cName = String(row['colour'] || '').trim().toUpperCase();
  const vAsin = String(row['variant_asin'] || '').trim();
  const swatch = cleanHiresUrl(String(row['swatch_image'] || '').trim());
  const vLink = String(row['variant_link'] || '').trim() || (vAsin ? `https://www.amazon.in/dp/${vAsin}` : '');

  const gallery = [];
  for (let i = 1; i <= 8; i++) {
    const gUrl = row[`gallery_image_${i}`];
    if (gUrl && String(gUrl).startsWith('http')) {
      gallery.push(cleanHiresUrl(String(gUrl).trim()));
    }
  }

  if (pAsin) {
    if (!colorEntriesByParent[pAsin]) {
      colorEntriesByParent[pAsin] = [];
    }
    colorEntriesByParent[pAsin].push({
      colour: cName,
      variant_asin: vAsin,
      swatch_image: swatch,
      gallery: gallery,
      variant_link: vLink,
    });
  }
}

function getHex(name) {
  const n = (name || '').toUpperCase().trim();
  if (n.includes('BLACK') || n.includes('COAL') || n.includes('JET') || n.includes('CLASSIC') || n === 'BK') return '#1A1A1A';
  if (n.includes('GOLD') || n.includes('SULTAN')) return '#C59B27';
  if (n.includes('CHERRY') || n.includes('REDDISH') || n.includes('RDTAN') || n.includes('MAROON')) return '#8B2500';
  if (n.includes('RUSTIC TAN') || n.includes('TAN HIDE') || n.includes('TAN BROWN') || n.includes('CAMEL TAN') || n.includes('TANHD') || n.includes('TAN')) return '#9C5B2D';
  if (n.includes('CAMEL')) return '#C19A6B';
  if (n.includes('ALMOND')) return '#D8C3A5';
  if (n.includes('MOCHA') || n.includes('COFFEE') || n.includes('MINK') || n.includes('DEEP BROWN') || n.includes('DARK BROWN') || n.includes('BROWN')) return '#5A381E';
  if (n.includes('PLUM') || n.includes('MAUVE') || n.includes('PURPLE') || n.includes('LAVENDER')) return '#8A4F7D';
  if (n.includes('CREAM') || n.includes('IVORY') || n.includes('CR')) return '#F5EBE1';
  if (n.includes('SAND') || n.includes('PALE BEIGE') || n.includes('BEIGE') || n.includes('BG')) return '#D2B48C';
  if (n.includes('SNOW') || n.includes('WHITE') || n === 'WH') return '#FFFFFF';
  if (n.includes('SKY')) return '#BAE6FD';
  if (n.includes('NAVY') || n.includes('BLUE')) return '#1E3A8A';
  if (n.includes('DOVE')) return '#9AA5B1';
  if (n.includes('MONSOON')) return '#7B8794';
  if (n.includes('MOUSE')) return '#737373';
  if (n.includes('GREY') || n.includes('GRAY') || n.includes('SLATE') || n.includes('GY')) return '#6B7280';
  if (n.includes('PEACH') || n.includes('ONION') || n.includes('PASTEL PEACH') || n.includes('PINK') || n.includes('PNK')) return '#F472B6';
  if (n.includes('OLIVE') || n.includes('GREEN') || n.includes('OLI')) return '#3F6212';
  if (n.includes('SULPHUR') || n.includes('SUL')) return '#C28B5B';
  if (n.includes('ORANGE') || n.includes('RUST')) return '#C2410C';
  if (n.includes('YELLOW') || n.includes('MUSTARD')) return '#D97706';
  if (n.includes('TEAL')) return '#0F766E';
  return '#333333';
}

function cleanSubtitle(raw) {
  let t = (raw || '').replace(/^BLISS\s*BALANCE\s*/i, '');
  t = t.replace(/\s+UK-?\d+/gi, '');
  t = t.replace(/\s+BB\d+[A-Z0-9\-]*/gi, '');
  t = t.replace(/\s*\|\s*/g, ' ').trim();

  if (/kolhapuri|puneri/i.test(t)) return 'Maharashtrian Ethnic Kolhapuri & Puneri Chappal';
  if (/sneaker|casual\s+shoe/i.test(t)) return 'Hybrid Streetwear Sneakers with Cushion Outsole';
  if (/doctor\s+sandal|velcro\s+strap/i.test(t)) return 'Super Soft Ortho-Friendly Adjustable Doctor Sandal';
  if (/diabetic|orthopedic\s+slipper|doctor\s+chappal/i.test(t)) return 'Extra Soft Diabetic & Orthopedic Doctor Slippers';
  if (/clog|mule|charms/i.test(t)) {
    if (/kids/i.test(t)) return 'Super Soft Kids Playtime Clogs with Back Strap';
    return 'Fashionable Lightweight Clogs with Cushioned Backstrap';
  }
  if (/flip[\s-]*flop|slipper/i.test(t)) return 'Ultra-Soft Cushioned Acupressure Flip-Flops';
  if (/sandal/i.test(t)) return 'Comfort Ortho Friendly Lightweight Walking Sandals';
  return t.length > 60 ? t.slice(0, 60) + '...' : t;
}

function getGender(raw, modelId) {
  if (/kids|playtime/i.test(raw) || modelId.startsWith('BBSAP')) return 'Kids';
  if (/women|girls|ladies/i.test(raw)) return 'Women';
  if (/men|boys/i.test(raw)) return 'Men';
  return 'Unisex';
}

function getCategory(raw) {
  if (/kolhapuri|puneri/i.test(raw)) return 'Kolhapuri & Puneri Chappal';
  if (/sneaker|casual\s+shoe/i.test(raw)) return 'Sneakers';
  if (/clog|crocs|mule/i.test(raw)) return 'Clogs';
  if (/sandal/i.test(raw)) return 'Sandals';
  if (/slide/i.test(raw)) return 'Slides';
  return 'Slippers';
}

function normalizeTokenToColorName(token, availableColorNames) {
  const t = token.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const av = availableColorNames.map(c => c.toUpperCase());

  // 1. Direct contains or match
  for (let i = 0; i < av.length; i++) {
    const c = av[i];
    if (c === t || c.replace(/[^A-Z0-9]/g, '') === t) return i;
  }

  // 2. Known abbreviations map
  const tokenMap = {
    'BK': ['BLACK', 'DARK BLACK', 'COAL BLACK', 'JET BLACK', 'RICH BLACK', 'CLASSIC'],
    'TAN': ['TAN', 'RUSTIC TAN', 'TAN BROWN', 'CAMEL TAN', 'TAN HIDE'],
    'TANHD': ['TAN HIDE', 'RUSTIC TAN', 'TAN'],
    'RDTAN': ['REDDISH TAN', 'CHERRY'],
    'SNWH': ['SNOW WHITE', 'WHITE'],
    'WH': ['WHITE', 'SNOW WHITE', 'WHITE SKY'],
    'BR': ['BROWN', 'DARK BROWN', 'BROWN BEIGE', 'MOCHA BROWN'],
    'WMGY': ['WARM GREY', 'GREY'],
    'DPBR': ['DEEP BROWN', 'DARK BROWN', 'COFFEE BROWN'],
    'BG': ['BEIGE', 'SAND BEIGE', 'OLIVE BEIGE', 'IVORY BEIGE', 'PALE BEIGE'],
    'CR': ['IVORY CREAM', 'CREAM'],
    'GY': ['GREY', 'GRAY', 'WARM GREY'],
    'DVGY': ['DOVE GREY', 'GREY'],
    'MNGY': ['MONSOON GREY', 'GREY'],
    'SUL': ['SULTAN', 'SULTAN GOLD'],
    'NYSKY': ['NAVY SKY', 'NAVY BLUE'],
    'WHSY': ['WHITE SKY', 'WHITE'],
    'AD': ['ALMOND', 'BROWN ALMOND'],
    'PNKBG': ['PINK BEIGE', 'PEACH'],
  };

  const cleanToken = t.replace(/\d+/g, '');
  if (tokenMap[cleanToken]) {
    for (const candidate of tokenMap[cleanToken]) {
      for (let i = 0; i < av.length; i++) {
        if (av[i] === candidate || av[i].includes(candidate)) return i;
      }
    }
  }

  for (let i = 0; i < av.length; i++) {
    if (av[i].includes(cleanToken)) return i;
  }

  return 0;
}

console.log('>>> [2/4] Assembling full product catalog...');
const finalProducts = [];

for (const row of wsProducts) {
  const skuCode = String(row['seller-sku'] || '').trim();
  const asin = String(row['asin1'] || '').trim();
  const rawTitle = String(row['item-name'] || '').trim();
  const price = Number(row['price']) || 899;
  const mrp = Number(row['maximum-retail-price']) || Math.round(price * 1.8);
  const link = String(row['LINKS'] || '').trim() || `https://www.amazon.in/dp/${asin}`;

  let modelId = skuCode.split('-')[0];
  if (modelId.startsWith('BBSAPPHIRE')) modelId = 'BBSAP-2';
  else if (modelId === 'BB147NEW') modelId = 'BB147';
  else if (modelId.startsWith('BBINDIGO')) modelId = modelId.replace('BBINDIGO', 'BB-INDIGO-');
  else if (modelId === 'BBSILK') modelId = 'BBSILK-11';

  const gender = getGender(rawTitle, modelId);
  const category = getCategory(rawTitle);
  const subtitle = cleanSubtitle(rawTitle);

  const pAsin = inputToParent[asin] || asin;
  const colorEntries = colorEntriesByParent[pAsin] || [];

  const colorVariants = [];
  const allGallery = [];

  for (let idx = 0; idx < colorEntries.length; idx++) {
    const ce = colorEntries[idx];
    const cName = ce.colour;
    const cHex = getHex(cName);
    const cImg = (ce.gallery && ce.gallery[0]) || ce.swatch_image;

    colorVariants.push({
      name: cName,
      hex: cHex,
      imageUrl: cImg,
      amazonUrl: ce.variant_link,
    });

    if (ce.gallery) {
      for (const g of ce.gallery) {
        if (!allGallery.includes(g)) {
          allGallery.push(g);
        }
      }
    }
  }

  if (colorVariants.length === 0) {
    const fallbackImg = `https://m.media-amazon.com/images/P/${asin}.01._SL1500_.jpg`;
    colorVariants.push({
      name: 'CLASSIC',
      hex: '#1A1A1A',
      imageUrl: fallbackImg,
      amazonUrl: link,
    });
    allGallery.push(fallbackImg);
  }

  const parts = skuCode.split('-');
  const skuColorToken = parts.length > 1 ? parts[1].toUpperCase() : '';
  const availableColorNames = colorVariants.map(cv => cv.name);
  const matchedIdx = normalizeTokenToColorName(skuColorToken, availableColorNames);

  if (matchedIdx > 0 && matchedIdx < colorVariants.length) {
    const matchCv = colorVariants.splice(matchedIdx, 1)[0];
    colorVariants.unshift(matchCv);
  }

  const primaryImage = colorVariants[0].imageUrl;
  const hoverImage = allGallery.length > 1 ? allGallery[1] : (colorVariants.length > 1 ? colorVariants[1].imageUrl : primaryImage);

  const rawSizesSet = sizesByParent[pAsin] || new Set();
  const sortedSizes = Array.from(rawSizesSet).sort((a, b) => {
    const na = parseFloat(a.replace(/[^\d.]/g, '')) || 99;
    const nb = parseFloat(b.replace(/[^\d.]/g, '')) || 99;
    return na - nb;
  });

  if (sortedSizes.length === 0) {
    if (gender === 'Kids') sortedSizes.push('UK 2', 'UK 3', 'UK 4', 'UK 5');
    else if (gender === 'Women') sortedSizes.push('UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8');
    else sortedSizes.push('UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10');
  }

  const sizeMap = sizeUrlsByParent[pAsin] || {};
  const sizeMarketplaceUrls = {};
  for (const sz of sortedSizes) {
    sizeMarketplaceUrls[sz] = {
      size: sz,
      amazonUrl: sizeMap[sz] || link,
      myntraUrl: '',
      flipkartUrl: '',
    };
  }

  const isBestseller = ['BB1017', 'BB1069', 'BB1080', 'BB155', 'BB147', 'BBSILK-11', 'BBSAP-2'].includes(modelId);

  finalProducts.push({
    id: modelId,
    title: modelId,
    subtitle: subtitle,
    gender: gender,
    category: category,
    price: price,
    originalPrice: mrp,
    imageUrl: primaryImage,
    hoverImageUrl: hoverImage,
    galleryImages: allGallery.length > 0 ? allGallery.slice(0, 8) : [primaryImage],
    amazonUrl: link,
    myntraUrl: '',
    flipkartUrl: '',
    officialUrl: '',
    features: [
      'High-Density Dual-Layer Memory Foam Footbed',
      'Anti-Skid Wave Traction Outsole for Indian Surfaces',
      'Featherlight Pressure-Relief Construction (<180g)',
      'Hand-Finished Durability Crafted in India',
    ],
    sizes: sortedSizes,
    colorVariants: colorVariants,
    sizeMarketplaceUrls: sizeMarketplaceUrls,
    rating: isBestseller ? 4.8 : 4.7,
    reviewCount: isBestseller ? 120 : 65,
    isNewArrival: true,
    isBestseller: isBestseller,
    createdAt: '2026-08-20T16:00:00.000Z',
    updatedAt: '2026-08-20T17:00:00.000Z',
  });

  console.log(`  [+] ${modelId.padEnd(12)} | ${String(colorVariants.length).padStart(2)} Colors | ${String(sortedSizes.length).padStart(2)} Sizes`);
}

const uniqueMap = {};
for (const p of finalProducts) {
  uniqueMap[p.id] = p;
}
const dedupedProducts = Object.values(uniqueMap);

console.log(`\n>>> [3/4] Updating local SSR initialSkus.ts with all ${dedupedProducts.length} articles...`);
const tsContent = `import { FootwearSKU } from './types';\n\nexport const INITIAL_SKUS: FootwearSKU[] = ${JSON.stringify(dedupedProducts, null, 2)};\n`;
fs.writeFileSync('src/lib/initialSkus.ts', tsContent, 'utf-8');
console.log('[OK] Updated src/lib/initialSkus.ts!');

console.log('\n>>> [4/4] Syncing products into Supabase Database...');

async function syncToSupabase() {
  let success = 0;
  for (const p of dedupedProducts) {
    const payload = {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      gender: p.gender,
      category: p.category,
      price: p.price,
      original_price: p.originalPrice,
      image_url: p.imageUrl,
      hover_image_url: p.hoverImageUrl,
      gallery_images: p.galleryImages,
      amazon_url: p.amazonUrl,
      myntra_url: p.myntraUrl,
      flipkart_url: p.flipkartUrl,
      official_url: p.officialUrl,
      features: p.features,
      sizes: p.sizes,
      color_variants: p.colorVariants,
      size_marketplace_urls: p.sizeMarketplaceUrls,
      rating: p.rating,
      review_count: p.reviewCount,
      is_new_arrival: p.isNewArrival,
      is_bestseller: p.isBestseller,
      updated_at: p.updatedAt,
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/skus`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        success++;
        console.log(`  [OK] [${success}/${dedupedProducts.length}] Database Updated: ${p.id}`);
      }
    } catch (e) {
      console.error(`  [FAIL] Error for ${p.id}:`, e.message);
    }
  }

  console.log('\n====================================================');
  console.log(`SUCCESS! ${success}/${dedupedProducts.length} products synced from ${excelPath}!`);
  console.log('====================================================');
}

syncToSupabase();
