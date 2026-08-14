/* ====================================================
   BLISS BALANCE.co - DYNAMIC CART ENGINE & APP LOGIC
   100% REAL BLISS BALANCE PRODUCTS & AUTHENTIC PHOTOS
   ==================================================== */

// Product Master Data (100% Authentic Bliss Balance Amazon Listings)
const PRODUCTS_DATA = [
  {
    id: 'prod-1',
    name: 'Doctor Memory Chappal',
    category: "MEN'S ORTHOPEDIC SLIPPERS",
    price: 806,
    mrp: 1499,
    rating: 4.9,
    reviews: 342,
    image: 'assets/images/flagship_chappal_pair.png',
    badge: 'BEST SELLER',
    description: 'Bliss Balance Doctor Slipper for Men - Orthotic Memory Foam Soft Chappal with Heel Pain Relief & Diabetic Care.',
    bullets: [
      'Engineered with premium MCP/MCR (Micro Cellular Polymer) memory foam for plush cushioning.',
      'Recommended by orthopedic doctors to relieve heel pain, plantar fasciitis, and calcaneal spurs.',
      'Wide Toe Box & side ventilation cutouts prevent bunions and keep feet cool.',
      'Anti-Skid Alphabounce rubberized sole for firm stability on wet tiles and marble.',
      'Adjustable Hook & Loop velcro strap for a customized, secure fit.'
    ]
  },
  {
    id: 'prod-4',
    name: 'Platform Charm Clog',
    category: "WOMEN'S SLIPPERS & SANDALS",
    price: 799,
    mrp: 1499,
    rating: 4.9,
    reviews: 98,
    image: 'assets/images/real_clogs_women.png',
    badge: 'NEW RELEASE',
    description: "Bliss Balance Women's Soft Platform Clogs - Elevated Cushion Slides with Gold & Pearl Designer Charms.",
    bullets: [
      'Chunky elevated platform sole with deep anatomical heel cup.',
      'Equipped with gold & pearl star, flower & heart designer charms.',
      'Molded EVA sole with embossed Bliss Balance logo footbed.'
    ]
  },
  {
    id: 'prod-3',
    name: 'Dual-Strap Buckle Sandal',
    category: "WOMEN'S SLIPPERS & SANDALS",
    price: 599,
    mrp: 1199,
    rating: 4.9,
    reviews: 215,
    image: 'assets/images/real_dualstrap_women.png',
    badge: 'HOT DEAL',
    description: "Bliss Balance Women's Comfort Orthopedic Buckle Sandals - Two Strap Soft Chappal for Heel Pain Relief.",
    bullets: [
      'Dual adjustable buckle straps for a customized instep fit.',
      'Calibrated orthopedic arch support footbed.',
      'Shock-absorbing sole designed for lower back pain relief.'
    ]
  },
  {
    id: 'prod-2',
    name: 'T-Strap Toe-Ring Sandal',
    category: "WOMEN'S SLIPPERS & SANDALS",
    price: 499,
    mrp: 999,
    rating: 4.8,
    reviews: 184,
    image: 'assets/images/real_tstrap_women.png',
    badge: 'POPULAR',
    description: "Bliss Balance Women's T-Strap Toe-Ring Sandal - Orthopedic Soft Cushioned Flat Slipper for Women.",
    bullets: [
      'Ultra-soft cushioned footbed engineered for all-day standing comfort.',
      'Ergonomic T-Strap with toe-ring loop for secure and elegant grip.',
      'Lightweight anti-skid rubberized outsole for indoors & outdoors.'
    ]
  }
];

// Cart State
let cartState = [
  { id: 'prod-1', size: 'UK 8', qty: 1 }
];

let giftWrapAdded = false;
let selectedModalSizeChoice = 'UK 8';
let activeModalProduct = PRODUCTS_DATA[0];

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initIntroLoader();
  initCarouselControls();
  updateCartUI();
});


/* ====================================================
   1. LOGO FLICKER INTRO LOADER
   ==================================================== */
function initIntroLoader() {
  const loaderEl = document.getElementById('comet-intro-loader');
  if (!loaderEl) return;

  setTimeout(() => {
    loaderEl.classList.add('dismissed');
  }, 2200);
}


/* ====================================================
   2. CATEGORY FILTERING & CAROUSEL CONTROLS
   ==================================================== */
function initCarouselControls() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const viewport = document.getElementById('carousel-viewport');

  if (prevBtn && nextBtn && viewport) {
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: -310, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: 310, behavior: 'smooth' });
    });
  }
}

function filterByCategory(categoryName) {
  const heading = document.getElementById('featured-section-heading');
  const viewport = document.getElementById('carousel-viewport');
  
  if (heading) {
    heading.textContent = categoryName.toUpperCase();
  }

  showToast(`Showing Collection: ${categoryName}`);

  if (viewport) {
    viewport.scrollIntoView({ behavior: 'smooth' });
  }
}

function switchCardImg(productId, newImgUrl, swatchBtn) {
  const imgEl = document.getElementById(`img-${productId}`);
  if (imgEl) {
    imgEl.style.opacity = '0.2';
    setTimeout(() => {
      imgEl.src = newImgUrl;
      imgEl.style.opacity = '1';
    }, 150);
  }

  const parent = swatchBtn.closest('.product-swatches');
  if (parent) {
    const swatches = parent.querySelectorAll('.swatch');
    swatches.forEach(s => s.classList.remove('active'));
    swatchBtn.classList.add('active');
  }
}


/* ====================================================
   3. DYNAMIC COMET CART DRAWER ENGINE
   ==================================================== */
function openCart() {
  const cartDrawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (cartDrawer && overlay) {
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
  }
}

function closeCart() {
  const cartDrawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (cartDrawer && overlay) {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function addToCart(productId, size = 'UK 8') {
  const existingIndex = cartState.findIndex(item => item.id === productId && item.size === size);
  const prod = PRODUCTS_DATA.find(p => p.id === productId);

  if (existingIndex > -1) {
    cartState[existingIndex].qty += 1;
  } else {
    cartState.push({ id: productId, size: size, qty: 1 });
  }

  updateCartUI();
  openCart();

  showToast(`Added ${prod ? prod.name : 'Footwear'} to Cart`);
}

function toggleGiftWrap() {
  giftWrapAdded = !giftWrapAdded;
  updateCartUI();
  if (giftWrapAdded) {
    showToast('Added Gift Wrap (+ ₹69)');
  }
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const badgeCountEl = document.getElementById('cart-badge-count');
  const supCountEl = document.getElementById('cart-sup-count');
  const subtotalEl = document.getElementById('cart-subtotal-val');

  if (!container) return;

  container.innerHTML = '';

  let totalCount = 0;
  let subtotal = 0;

  cartState.forEach(item => {
    totalCount += item.qty;
    const prod = PRODUCTS_DATA.find(p => p.id === item.id);
    if (prod) {
      subtotal += prod.price * item.qty;
    }
  });

  if (giftWrapAdded) {
    subtotal += 69;
    totalCount += 1;
  }

  if (badgeCountEl) badgeCountEl.textContent = totalCount;
  if (supCountEl) supCountEl.textContent = `(${totalCount})`;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

  // EMPTY CART STATE
  if (cartState.length === 0 && !giftWrapAdded) {
    container.innerHTML = `
      <div class="cart-empty-box">
        <div class="shoebox-icon-box">
          <img src="assets/Logo.svg" alt="Shoebox Logo" class="shoebox-logo-svg">
        </div>
        
        <h4 class="cart-empty-title">YOUR CART IS EMPTY</h4>
        <p class="cart-empty-sub">No pairs yet, let's fix that.</p>
        
        <button class="btn-get-started" onclick="closeCart()">GET STARTED</button>
        
        <p class="account-subtext">Already have an account? <a href="#" onclick="alert('Sign in to view saved cart')">Log in</a> to see a saved cart.</p>

        <div class="bestsellers-heading">OUR BESTSELLERS</div>
        <div class="bestsellers-row">
          ${PRODUCTS_DATA.map(prod => `
            <div class="bestseller-item-card" onclick="openQuickView('${prod.id}')">
              <img src="${prod.image}" alt="${prod.name}">
              <div class="bestseller-item-info">
                <div class="bestseller-item-title">${prod.name}</div>
                <div class="bestseller-item-price">₹${prod.price}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  // FILLED CART STATE
  cartState.forEach((item, index) => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.id);
    if (!prod) return;

    const trashSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item-row';
    itemRow.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
      <div class="cart-item-details">
        <div class="cart-item-top">
          <div>
            <h4 class="cart-item-name">${prod.name}</h4>
            <p class="cart-item-sub">${prod.category} | Size: ${item.size}</p>
          </div>
          <span class="cart-item-price">₹${(prod.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
        
        <div class="cart-item-actions">
          <div class="stepper-box">
            <button class="stepper-btn" onclick="changeCartQty(${index}, -1)" title="Decrease Quantity">
              ${item.qty === 1 ? trashSvg : '-'}
            </button>
            <span class="stepper-val">${item.qty}</span>
            <button class="stepper-btn" onclick="changeCartQty(${index}, 1)" title="Increase Quantity">+</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(itemRow);
  });

  // Gift Wrap Item Row if added
  if (giftWrapAdded) {
    const giftSvgBox = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-yellow)" stroke-width="1.8"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`;
    const trashSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

    const giftRow = document.createElement('div');
    giftRow.className = 'cart-item-row';
    giftRow.innerHTML = `
      <div style="width: 84px; height: 84px; background: #141619; border-radius: 6px; border: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: center;">
        ${giftSvgBox}
      </div>
      <div class="cart-item-details">
        <div class="cart-item-top">
          <div>
            <h4 class="cart-item-name">GIFT WRAP IT</h4>
            <p class="cart-item-sub">Signature Premium Packaging</p>
          </div>
          <span class="cart-item-price">₹69</span>
        </div>
        <div class="cart-item-actions">
          <button onclick="toggleGiftWrap()" style="color: var(--clr-text-muted); display: flex; align-items: center;" title="Remove Gift Wrap">
            ${trashSvg}
          </button>
        </div>
      </div>
    `;
    container.appendChild(giftRow);
  }

  // 4-Grid Feature Badges Row
  const truckSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
  const refreshSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
  const packageSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
  const userSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;

  const featuresRow = document.createElement('div');
  featuresRow.className = 'cart-features-4grid';
  featuresRow.innerHTML = `
    <div class="cart-feature-col">
      <span class="cart-feature-icon">${truckSvg}</span>
      <span class="cart-feature-title">FREE<br>SHIPPING</span>
    </div>
    <div class="cart-feature-col">
      <span class="cart-feature-icon">${refreshSvg}</span>
      <span class="cart-feature-title">7 DAY<br>RETURNS</span>
    </div>
    <div class="cart-feature-col">
      <span class="cart-feature-icon">${packageSvg}</span>
      <span class="cart-feature-title">3-5 DAY<br>DELIVERY</span>
    </div>
    <div class="cart-feature-col">
      <span class="cart-feature-icon">${userSvg}</span>
      <span class="cart-feature-title">4 LAKH+<br>CUSTOMERS</span>
    </div>
  `;
  container.appendChild(featuresRow);

  // Add Gift Wrap Box Toggle
  const giftSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`;

  const giftWrapBox = document.createElement('div');
  giftWrapBox.className = 'gift-wrap-box';
  giftWrapBox.innerHTML = `
    <div class="gift-wrap-left">
      <span>${giftSvg}</span>
      <span>${giftWrapAdded ? 'Gift Wrap Added!' : 'Add GIFT WRAP'}</span>
    </div>
    <button class="btn-add-gift" onclick="toggleGiftWrap()">
      ${giftWrapAdded ? 'REMOVE' : '+ ADD'}
    </button>
  `;
  container.appendChild(giftWrapBox);
}

function changeCartQty(index, change) {
  if (cartState[index]) {
    cartState[index].qty += change;
    if (cartState[index].qty <= 0) {
      cartState.splice(index, 1);
    }
    updateCartUI();
  }
}


/* ====================================================
   4. QUICK VIEW MODAL
   ==================================================== */
function openQuickView(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  activeModalProduct = prod;

  const modal = document.getElementById('quick-view-modal');
  const imgEl = document.getElementById('modal-img');
  const catEl = document.getElementById('modal-cat');
  const titleEl = document.getElementById('modal-title');
  const priceEl = document.getElementById('modal-price');
  const descEl = document.getElementById('modal-desc');
  const bulletsEl = document.getElementById('modal-bullets');

  if (imgEl) imgEl.src = prod.image;
  if (catEl) catEl.textContent = prod.category;
  if (titleEl) titleEl.textContent = prod.name;
  if (priceEl) priceEl.textContent = `₹${prod.price.toLocaleString('en-IN')}`;
  if (descEl) descEl.textContent = prod.description;

  if (bulletsEl && prod.bullets) {
    bulletsEl.innerHTML = prod.bullets.map(b => `<li>${b}</li>`).join('');
  }

  if (modal) modal.classList.add('active');
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('active');
}

function handleModalOverlay(e) {
  if (e.target.id === 'quick-view-modal') {
    closeQuickView();
  }
}

function selectModalSize(size, btnEl) {
  selectedModalSizeChoice = `UK ${size}`;
  const parent = btnEl.closest('.size-grid');
  if (parent) {
    const btns = parent.querySelectorAll('.size-btn');
    btns.forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
}

function addModalItemToCart() {
  if (activeModalProduct) {
    addToCart(activeModalProduct.id, selectedModalSizeChoice);
    closeQuickView();
  }
}


/* ====================================================
   5. SEARCH MODAL LOGIC
   ==================================================== */
function openSearchModal() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  if (modal) modal.classList.add('active');
  if (input) {
    input.value = '';
    input.focus();
    renderSearchResults('');
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('active');
}

function handleSearchOverlay(e) {
  if (e.target.id === 'search-modal') {
    closeSearchModal();
  }
}

function handleSearchInput(e) {
  renderSearchResults(e.target.value.toLowerCase().trim());
}

function renderSearchResults(query) {
  const box = document.getElementById('search-results-box');
  if (!box) return;

  box.innerHTML = '';

  const matches = PRODUCTS_DATA.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    box.innerHTML = `<p style="color: var(--clr-text-muted); font-size: 0.9rem; padding: 10px;">No matching footwear found for "${query}".</p>`;
  } else {
    matches.forEach(prod => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; align-items: center; gap: 14px; background: #18181E; padding: 10px; border-radius: 6px; margin-bottom: 8px; cursor: pointer;';
      item.innerHTML = `
        <img src="${prod.image}" width="44" height="44" style="object-fit: cover; border-radius: 4px;">
        <div>
          <h5 style="font-family: var(--ff-heading); font-weight: 800; color: #FFF;">${prod.name}</h5>
          <span style="font-family: var(--ff-heading); font-size: 0.75rem; color: var(--clr-yellow);">₹${prod.price} | ${prod.category}</span>
        </div>
      `;
      item.onclick = () => {
        closeSearchModal();
        openQuickView(prod.id);
      };
      box.appendChild(item);
    });
  }
}


/* ====================================================
   6. TOAST SYSTEM
   ==================================================== */
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
