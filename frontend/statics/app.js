// Nykaa Clone Core Application JS

class NykaaApp {
  constructor() {
    // 1. Initial State
    this.state = {
      cart: [],
      wishlist: [],
      user: JSON.parse(localStorage.getItem('nykaa_user')) || { isLoggedIn: false, name: null },
      activeView: 'home',
      selectedProductId: null,
      
      // Filter State
      filters: {
        search: null,
        category: [],
        subcategory: null,
        brand: [],
        price: [],
        rating: null
      },
      sort: 'popularity',
      couponApplied: null,
      
      // Checkout State
      checkoutStep: 1,
      checkoutAddress: null,
      selectedPayment: 'card'
    };

    // Hero Banner Slider Data
    this.heroBanners = [
      {
        id: "banner-1",
        title: "MAC Gold Takeover",
        subtitle: "Flat 15% Off on Iconic Lipsticks & Foundations",
        desc: "Grab Best Seller Ruby Woo & Velvet Teddy, now available in premium combos with complimentary gift bags.",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop&q=80",
        btnText: "Shop MAC Cosmetics",
        target: { brand: "MAC" }
      },
      {
        id: "banner-2",
        title: "Dermatological Hydration",
        subtitle: "Explore Advanced Hydrating Serums & Cleansers",
        desc: "Get up to 20% Off on Minimalist, CeraVe, and The Ordinary. The ultimate barrier recovery products.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80",
        btnText: "Shop Skincare",
        target: { category: "skin" }
      },
      {
        id: "banner-3",
        title: "Salon Hair Rituals At Home",
        subtitle: "Professional Hair Care range starts at ₹799",
        desc: "Tame frizz, protect colored shafts, and prevent split ends with Olaplex & L'Oreal Professionnel.",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&auto=format&fit=crop&q=80",
        btnText: "Explore Hair Care",
        target: { category: "hair" }
      }
    ];

    // Carousel index tracker
    this.currentCarouselIndex = 0;
    this.carouselTimer = null;
  }

  // 2. Lifecycle Initialization
  init() {
    this.bindEvents();
    this.renderCategoryNav();
    this.renderBrandFilterOptions();
    
    // Check URL hash for routing
    this.handleHashRoute();
    window.addEventListener('hashchange', () => this.handleHashRoute());

    // Render Home Banners and Slides (they will load but will show only when view is active)
    this.renderHeroCarousel();
    this.renderPromosGrid();
    this.renderLuxeSpotlight();

    // Start auto carousel
    this.startCarouselAutoPlay();

    // Initial counter syncs
    this.updateBadges();
    this.renderCartDrawerItems();

    // Authenticated user check
    this.updateUserAuthState();
    if (this.state.user.isLoggedIn) this.loadUserState();
  }

  // 3. SPA Routing & View Controller
  handleHashRoute() {
    const hash = window.location.hash || '#home';
    const params = new URLSearchParams(hash.substring(hash.indexOf('?') + 1));
    const view = hash.split('?')[0].replace('#', '');
    
    const payload = {};
    if (params.has('category')) payload.category = params.get('category');
    if (params.has('subcategory')) payload.subcategory = params.get('subcategory');
    if (params.has('brand')) payload.brand = params.get('brand');
    if (params.has('id')) payload.id = params.get('id');
    if (params.has('q')) payload.q = params.get('q');

    this.navigateTo(view, payload, false);
  }

  navigateTo(view, payload = {}, updateHash = true) {
    this.state.activeView = view;

    // Reset filters when navigating to shop via main category links
    if (view === 'shop') {
      this.state.filters = {
        search: payload.q || null,
        category: payload.category && payload.category !== 'all' ? [payload.category] : [],
        subcategory: payload.subcategory || null,
        brand: payload.brand ? [payload.brand] : [],
        price: [],
        rating: null
      };
      
      // Update Search field in UI if search payload exists
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = payload.q || '';
      }
    }

    if (view === 'product' && payload.id) {
      this.state.selectedProductId = payload.id;
    }

    // Hash Update
    if (updateHash) {
      let hashString = `#${view}`;
      const queryParts = [];
      if (payload.category) queryParts.push(`category=${payload.category}`);
      if (payload.subcategory) queryParts.push(`subcategory=${payload.subcategory}`);
      if (payload.brand) queryParts.push(`brand=${payload.brand}`);
      if (payload.id) queryParts.push(`id=${payload.id}`);
      if (payload.q) queryParts.push(`q=${encodeURIComponent(payload.q)}`);

      if (queryParts.length > 0) {
        hashString += `?${queryParts.join('&')}`;
      }
      window.location.hash = hashString;
    }

    // Toggle Active Views
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });

    const activeSection = document.getElementById(`${view}-view`);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Trigger Specific Renders
    if (view === 'home') this.renderHome();
    if (view === 'shop') this.renderShop();
    if (view === 'product') this.renderProduct();
    if (view === 'wishlist') this.renderWishlist();

    // Scroll to Top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 4. UI Bindings
  bindEvents() {
    // Cart Drawer Toggles
    const cartDrawerBtn = document.getElementById('cart-drawer-btn');
    const cartDrawerCloseBtn = document.getElementById('cart-drawer-close-btn');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');

    cartDrawerBtn.addEventListener('click', () => this.showCartDrawer());
    cartDrawerCloseBtn.addEventListener('click', () => this.hideCartDrawer());
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) this.hideCartDrawer();
    });

    // Login Modal Toggles
    const loginModalBtn = document.getElementById('login-modal-btn');
    const userDropdown = document.getElementById('user-dropdown');
    loginModalBtn.addEventListener('click', (e) => {
      if (!this.state.user.isLoggedIn) {
        this.showAuthModal();
      } else {
        e.stopPropagation();
        if (userDropdown) {
          userDropdown.classList.toggle('active');
        }
      }
    });

    // Search Suggestions and Search triggers
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      this.handleSearchSuggestions(val);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim();
        searchSuggestions.classList.remove('active');
        if (val) {
          this.navigateTo('shop', { q: val });
        }
      }
    });

    // Close suggestions and user dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchSuggestions.classList.remove('active');
      }
      if (userDropdown && !e.target.closest('#user-menu-wrapper')) {
        userDropdown.classList.remove('active');
      } else if (userDropdown && e.target.closest('.user-dropdown-item')) {
        userDropdown.classList.remove('active');
      }
    });

    // Hero Carousel Arrows
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        this.stopCarouselAutoPlay();
        this.slideHeroCarousel('prev');
        this.startCarouselAutoPlay();
      });
      nextBtn.addEventListener('click', () => {
        this.stopCarouselAutoPlay();
        this.slideHeroCarousel('next');
        this.startCarouselAutoPlay();
      });
    }

    // Close checkout modal when overlay is clicked (but not on content container)
    const checkoutOverlay = document.getElementById('checkout-modal-overlay');
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) this.closeCheckoutModal();
    });

    // Close auth modal when overlay is clicked
    const authOverlay = document.getElementById('auth-modal-overlay');
    authOverlay.addEventListener('click', (e) => {
      if (e.target === authOverlay) this.closeAuthModal();
    });

    const ordersOverlay = document.getElementById('orders-modal-overlay');
    ordersOverlay.addEventListener('click', (e) => {
      if (e.target === ordersOverlay) this.closeOrdersModal();
    });
  }

  // 5. Dynamic Page Renderers
  renderHome() {
    this.renderHomeSliders();
  }

  // Home Page Product lists sliders
  renderHomeSliders() {
    // Trending Sliders (Trending tag or highest review count)
    const trendingProducts = PRODUCTS.filter(p => p.trending || (p.tags && p.tags.includes('Trending')));
    const trendingContainer = document.getElementById('trending-slider');
    
    if (trendingContainer) {
      trendingContainer.innerHTML = '';
      trendingProducts.forEach(product => {
        trendingContainer.appendChild(this.createProductCard(product));
      });
    }

    // Best Seller Sliders
    const bestsellerProducts = PRODUCTS.filter(p => p.bestSeller || (p.tags && p.tags.includes('Best Seller')));
    const bestsellerContainer = document.getElementById('bestseller-slider');

    if (bestsellerContainer) {
      bestsellerContainer.innerHTML = '';
      bestsellerProducts.forEach(product => {
        bestsellerContainer.appendChild(this.createProductCard(product));
      });
    }
  }

  // Render Category Menu Bar dynamically
  renderCategoryNav() {
    // Category bar logic is mostly static in HTML, but we hook elements.
  }

  // Render PLP filters brand list dynamically
  renderBrandFilterOptions() {
    const brandOptionsContainer = document.getElementById('filter-brand-options');
    if (!brandOptionsContainer) return;

    // Get unique list of brands
    const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();

    brandOptionsContainer.innerHTML = '';
    brands.forEach(brand => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `
        <input type="checkbox" value="${brand}" onchange="app.handleFilterChange('brand', '${brand}')"> ${brand}
      `;
      brandOptionsContainer.appendChild(label);
    });
  }

  // PLP Filters State Synchronizer
  syncFilterInputs() {
    // Category check
    document.querySelectorAll('#filter-category-options input').forEach(input => {
      input.checked = this.state.filters.category.includes(input.value);
    });

    // Brand check
    document.querySelectorAll('#filter-brand-options input').forEach(input => {
      input.checked = this.state.filters.brand.includes(input.value);
    });

    // Price check
    document.querySelectorAll('input[onchange*="price"]').forEach(input => {
      const val = input.value;
      input.checked = this.state.filters.price.includes(val);
    });

    // Rating check
    document.querySelectorAll('input[onchange*="rating"]').forEach(input => {
      const val = parseFloat(input.value);
      input.checked = this.state.filters.rating === val;
    });
  }

  // Filter Selection Event
  handleFilterChange(type, value) {
    if (type === 'category') {
      const idx = this.state.filters.category.indexOf(value);
      if (idx > -1) {
        this.state.filters.category.splice(idx, 1);
      } else {
        this.state.filters.category.push(value);
      }
    } else if (type === 'brand') {
      const idx = this.state.filters.brand.indexOf(value);
      if (idx > -1) {
        this.state.filters.brand.splice(idx, 1);
      } else {
        this.state.filters.brand.push(value);
      }
    } else if (type === 'price') {
      const idx = this.state.filters.price.indexOf(value);
      if (idx > -1) {
        this.state.filters.price.splice(idx, 1);
      } else {
        this.state.filters.price.push(value);
      }
    } else if (type === 'rating') {
      const val = parseFloat(value);
      if (this.state.filters.rating === val) {
        this.state.filters.rating = null;
      } else {
        this.state.filters.rating = val;
      }
      // Force uncheck other rating filters
      document.querySelectorAll('input[onchange*="rating"]').forEach(input => {
        if (parseFloat(input.value) !== val) input.checked = false;
      });
    }

    this.renderShop();
  }

  handleSortChange(val) {
    this.state.sort = val;
    this.renderShop();
  }

  clearFilters() {
    this.state.filters = {
      search: null,
      category: [],
      subcategory: null,
      brand: [],
      price: [],
      rating: null
    };
    
    // Reset search UI input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    this.syncFilterInputs();
    this.renderShop();
  }

  // Render Product Listing Page (PLP)
  renderShop() {
    this.syncFilterInputs();
    const plpGrid = document.getElementById('plp-grid');
    const resultsCountText = document.getElementById('results-count');
    if (!plpGrid) return;

    // Apply Filter Logic
    let filtered = PRODUCTS.filter(product => {
      // 1. Search Query
      if (this.state.filters.search) {
        const query = this.state.filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSubCat = product.subcategory.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSubCat) return false;
      }

      // 2. Category
      if (this.state.filters.category.length > 0) {
        if (!this.state.filters.category.includes(product.category)) return false;
      }

      // 3. Subcategory
      if (this.state.filters.subcategory) {
        if (product.subcategory !== this.state.filters.subcategory) return false;
      }

      // 4. Brand
      if (this.state.filters.brand.length > 0) {
        if (!this.state.filters.brand.includes(product.brand)) return false;
      }

      // 5. Rating
      if (this.state.filters.rating) {
        if (product.rating < this.state.filters.rating) return false;
      }

      // 6. Price range
      if (this.state.filters.price.length > 0) {
        let inRange = false;
        this.state.filters.price.forEach(range => {
          if (range === '0-500' && product.price <= 500) inRange = true;
          if (range === '500-1500' && product.price > 500 && product.price <= 1500) inRange = true;
          if (range === '1500-3000' && product.price > 1500 && product.price <= 3000) inRange = true;
          if (range === '3000-above' && product.price > 3000) inRange = true;
        });
        if (!inRange) return false;
      }

      return true;
    });

    // Apply Sorting Logic
    if (this.state.sort === 'popularity') {
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (this.state.sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.state.sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.state.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.state.sort === 'discount') {
      filtered.sort((a, b) => b.discount - a.discount);
    }

    // Render Grid
    plpGrid.innerHTML = '';
    resultsCountText.innerText = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
      plpGrid.innerHTML = `
        <div class="plp-empty-state">
          <i class="fa-solid fa-face-meh"></i>
          <h3>No products match your filters</h3>
          <p>Try resetting the category options or widening your search criteria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      plpGrid.appendChild(this.createProductCard(product));
    });
  }

  // Create Product Card element
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const productImage = this.getProductImage(product);

    const isWishlisted = this.state.wishlist.includes(product.id);
    const badgeHTML = product.discount > 12 
      ? `<div class="card-badge discount">${product.discount}% OFF</div>` 
      : product.bestSeller 
        ? `<div class="card-badge">BEST SELLER</div>` 
        : '';

    card.innerHTML = `
      ${badgeHTML}
      <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleWishlist('${product.id}')">
        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <div class="product-image-wrap" onclick="app.navigateTo('product', { id: '${product.id}' })">
        <img src="${productImage}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${product.brand}', '${product.name}')">
      </div>
      <div class="product-info-wrap">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name" onclick="app.navigateTo('product', { id: '${product.id}' })">${product.name}</div>
        <div class="product-ratings">
          <span>${product.rating} <i class="fa-solid fa-star"></i></span>
          <span class="ratings-count">(${product.reviewsCount})</span>
        </div>
        <div class="product-price-row">
          <span class="selling-price">₹${product.price}</span>
          ${product.discount > 0 ? `<span class="mrp-price">₹${product.mrp}</span>` : ''}
          ${product.discount > 0 ? `<span class="discount-percent">${product.discount}% Off</span>` : ''}
        </div>
        <button class="add-bag-btn" onclick="event.stopPropagation(); app.handleDirectAddBag('${product.id}')">
          <i class="fa-solid fa-bag-shopping"></i> Add to Bag
        </button>
      </div>
    `;

    return card;
  }

  getProductImage(product) {
    return product.images && product.images.length > 0
      ? product.images[0]
      : this.getProductFallbackImage(product.brand, product.name);
  }

  getProductFallbackImage(brand = 'Nykaa', name = 'Beauty Product') {
    const safeBrand = String(brand).replace(/[<>&"']/g, '');
    const safeName = String(name).replace(/[<>&"']/g, '');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#fff6fa"/>
            <stop offset="1" stop-color="#f5f7fb"/>
          </linearGradient>
          <linearGradient id="pink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#fc2779"/>
            <stop offset="1" stop-color="#e80071"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bg)"/>
        <circle cx="460" cy="120" r="92" fill="#ffe2ef"/>
        <circle cx="120" cy="470" r="105" fill="#eceff6"/>
        <rect x="240" y="130" width="120" height="300" rx="42" fill="#07182a"/>
        <rect x="260" y="95" width="80" height="70" rx="18" fill="url(#pink)"/>
        <rect x="270" y="150" width="60" height="250" rx="26" fill="#13263a"/>
        <path d="M210 442c58 24 124 25 181 0" fill="none" stroke="#fc2779" stroke-width="18" stroke-linecap="round"/>
        <text x="300" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#001325">${safeBrand}</text>
        <text x="300" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#5a6e7f">${safeName.slice(0, 34)}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Render Product Details Page (PDP)
  renderProduct() {
    const container = document.getElementById('pdp-container');
    if (!container) return;

    const product = PRODUCTS.find(p => p.id === this.state.selectedProductId);
    if (!product) {
      container.innerHTML = '<h3>Product not found.</h3>';
      return;
    }

    const isWishlisted = this.state.wishlist.includes(product.id);

    // Initial swatch selection
    let activeShadeName = product.shades && product.shades.length > 0 ? product.shades[0].name : null;
    let activeSizeName = product.sizes && product.sizes.length > 0 ? product.sizes[0].name : null;
    
    // Selected states
    this.pdpState = {
      selectedShade: activeShadeName,
      selectedSize: activeSizeName,
      activePrice: product.price,
      activeMrp: product.mrp,
      activeImage: this.getProductImage(product),
      activeImageIndex: 0
    };

    // Shades swatch UI
    let shadesHTML = '';
    if (product.shades && product.shades.length > 0) {
      shadesHTML = `
        <div class="pdp-selector-section">
          <div class="selector-title">Selected Shade: <span id="pdp-shade-label">${activeShadeName}</span></div>
          <div class="swatches-grid">
            ${product.shades.map((shade, idx) => `
              <button class="swatch-color-btn ${idx === 0 ? 'active' : ''}" 
                      style="background-color: ${shade.colorCode};" 
                      title="${shade.name}" 
                      onclick="app.handleShadeSelect(this, '${shade.name}')">
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Sizes swatch UI
    let sizesHTML = '';
    if (product.sizes && product.sizes.length > 0) {
      sizesHTML = `
        <div class="pdp-selector-section">
          <div class="selector-title">Available Sizes:</div>
          <div class="swatches-grid">
            ${product.sizes.map((sz, idx) => `
              <button class="swatch-size-btn ${idx === 0 ? 'active' : ''}" 
                      onclick="app.handleSizeSelect(this, '${sz.name}', ${sz.price}, ${sz.mrp})">
                ${sz.name}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Aggregate score stars width
    const scorePct = (product.rating / 5) * 100;

    container.innerHTML = `
      <div class="pdp-grid">
        <!-- Gallery Column -->
        <div class="pdp-image-gallery">
          <div class="pdp-thumbnails">
            ${(product.images && product.images.length ? product.images : [this.getProductFallbackImage(product.brand, product.name)]).map((img, idx) => `
              <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="app.handlePDPThumbClick(this, '${img}', ${idx})">
                <img src="${img}" alt="${product.name} thumb" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${product.brand}', '${product.name}')">
              </div>
            `).join('')}
          </div>
          <div class="pdp-main-image">
            <img id="pdp-large-image" src="${this.getProductImage(product)}" alt="${product.name}" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${product.brand}', '${product.name}')">
          </div>
        </div>

        <!-- Details Column -->
        <div class="pdp-details-info">
          <div class="pdp-brand-title">${product.brand}</div>
          <h1 class="pdp-name-title">${product.name}</h1>
          
          <div class="pdp-meta-row">
            <div class="pdp-stars">
              <span>${product.rating} <i class="fa-solid fa-star" style="font-size: 11px;"></i></span>
            </div>
            <span class="pdp-reviews-count">${product.reviewsCount} verified reviews</span>
          </div>

          <div class="pdp-price-section">
            <span class="pdp-price" id="pdp-price-display">₹${this.pdpState.activePrice}</span>
            ${product.discount > 0 ? `<span class="pdp-mrp" id="pdp-mrp-display">₹${this.pdpState.activeMrp}</span>` : ''}
            ${product.discount > 0 ? `<span class="pdp-discount" id="pdp-discount-display">${product.discount}% Off</span>` : ''}
          </div>

          <!-- Selectors -->
          ${shadesHTML}
          ${sizesHTML}

          <!-- Actions -->
          <div class="pdp-actions-row">
            <button class="pdp-add-bag" onclick="app.handlePdpAddBag('${product.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
            <button class="pdp-wishlist ${isWishlisted ? 'active' : ''}" id="pdp-wishlist-btn" onclick="app.handlePdpWishlistToggle('${product.id}')">
              <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          <!-- Specs Accordions / Tabs -->
          <div class="pdp-tabs">
            <div class="tabs-nav">
              <button class="tab-btn active" onclick="app.switchPDPTab(this, 'tab-desc')">Description</button>
              <button class="tab-btn" onclick="app.switchPDPTab(this, 'tab-ingredients')">Ingredients</button>
              <button class="tab-btn" onclick="app.switchPDPTab(this, 'tab-how')">How To Use</button>
            </div>
            <div id="tab-desc" class="tab-pane active">
              <p>${product.description}</p>
              <p style="margin-top: 10px;"><strong>Category:</strong> ${product.category.toUpperCase()} - ${product.subcategory.toUpperCase()}</p>
            </div>
            <div id="tab-ingredients" class="tab-pane">
              <p>Aqua (Water), Glycerin, Niacinamide, Zinc PCA, Hyaluronic Acid, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin, Citric Acid, Disodium EDTA.</p>
            </div>
            <div id="tab-how" class="tab-pane">
              <p>Apply 2-3 drops onto clean, damp skin of the face and neck daily. Gently press with fingers until fully absorbed. Follow up with your favorite moisturizer and broad-spectrum sunscreen in the day time.</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <div class="section-header">
          <div class="section-title-wrap">
            <h3>Customer Reviews</h3>
            <p>What our real customers say about this formulation</p>
          </div>
        </div>

        <div class="reviews-summary-grid">
          <div class="reviews-aggregate">
            <div class="aggregate-score">${product.rating}</div>
            <div class="aggregate-stars">
              ${this.generateStarsHTML(product.rating)}
            </div>
            <div class="aggregate-count">Based on ${product.reviewsCount} ratings</div>
          </div>
          
          <!-- Submit Review Form -->
          <div class="review-form-wrapper">
            <h4>Write a review</h4>
            <div class="review-form">
              <div class="rating-select-stars" id="rating-form-stars">
                <i class="fa-regular fa-star" data-rating="1" onclick="app.setReviewFormRating(1)"></i>
                <i class="fa-regular fa-star" data-rating="2" onclick="app.setReviewFormRating(2)"></i>
                <i class="fa-regular fa-star" data-rating="3" onclick="app.setReviewFormRating(3)"></i>
                <i class="fa-regular fa-star" data-rating="4" onclick="app.setReviewFormRating(4)"></i>
                <i class="fa-regular fa-star" data-rating="5" onclick="app.setReviewFormRating(5)"></i>
              </div>
              <input type="text" id="review-user-input" placeholder="Your Name" required>
              <textarea id="review-comment-input" rows="3" placeholder="Tell us about your experience..." required></textarea>
              <button class="submit-review-btn" onclick="app.submitPdpReview('${product.id}')">Submit Review</button>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list-container" id="pdp-reviews-list">
          ${product.reviews.map(rev => `
            <div class="review-item">
              <div class="review-user-row">
                <span class="review-user-name">${rev.user}</span>
                <span class="review-date">${rev.date}</span>
              </div>
              <div class="review-stars">
                ${this.generateStarsHTML(rev.rating)}
              </div>
              <div class="review-comment">${rev.comment}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Reset Review Form State
    this.reviewFormRating = 0;
  }

  // Handle PDP interactions
  handleShadeSelect(btn, shadeName) {
    document.querySelectorAll('.swatch-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    this.pdpState.selectedShade = shadeName;
    document.getElementById('pdp-shade-label').innerText = shadeName;
  }

  handleSizeSelect(btn, sizeName, price, mrp) {
    document.querySelectorAll('.swatch-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    this.pdpState.selectedSize = sizeName;
    this.pdpState.activePrice = price;
    this.pdpState.activeMrp = mrp;

    // Update displays
    document.getElementById('pdp-price-display').innerText = `₹${price}`;
    const mrpDisp = document.getElementById('pdp-mrp-display');
    if (mrpDisp) {
      mrpDisp.innerText = `₹${mrp}`;
    }
  }

  handlePDPThumbClick(thumb, imgUrl, index) {
    document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    const largeImg = document.getElementById('pdp-large-image');
    largeImg.src = imgUrl;

    this.pdpState.activeImage = imgUrl;
    this.pdpState.activeImageIndex = index;
  }

  switchPDPTab(btn, paneId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(paneId).classList.add('active');
  }

  // PDP Review form helpers
  setReviewFormRating(rating) {
    this.reviewFormRating = rating;
    const stars = document.querySelectorAll('#rating-form-stars i');
    stars.forEach((star, idx) => {
      if (idx < rating) {
        star.className = 'fa-solid fa-star active';
      } else {
        star.className = 'fa-regular fa-star';
      }
    });
  }

  submitPdpReview(productId) {
    const userVal = document.getElementById('review-user-input').value.trim();
    const commentVal = document.getElementById('review-comment-input').value.trim();

    if (this.reviewFormRating === 0) {
      this.showToast('Please select a star rating', 'info');
      return;
    }
    if (!userVal) {
      this.showToast('Please enter your name', 'info');
      return;
    }
    if (!commentVal) {
      this.showToast('Please write a comment', 'info');
      return;
    }

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Create review object
    const dateObj = new Date();
    const formattedDate = dateObj.toISOString().split('T')[0];

    const newReview = {
      user: userVal,
      rating: this.reviewFormRating,
      date: formattedDate,
      comment: commentVal
    };

    // Push into product data (lives in memory during session)
    product.reviews.unshift(newReview);
    // Update aggregates
    const oldTotal = product.reviewsCount * product.rating;
    product.reviewsCount += 1;
    product.rating = parseFloat(((oldTotal + this.reviewFormRating) / product.reviewsCount).toFixed(1));

    // Re-render PDP view
    this.renderProduct();
    this.showToast('Review submitted successfully!');
  }

  // Helper star generator
  generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fa-solid fa-star"></i>';
    if (halfStar) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < emptyStars; i++) html += '<i class="fa-regular fa-star"></i>';
    return html;
  }

  // Render Wishlist Page
  renderWishlist() {
    const container = document.getElementById('wishlist-content');
    if (!container) return;

    const wishlistProducts = PRODUCTS.filter(p => this.state.wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
      container.innerHTML = `
        <div class="wishlist-empty">
          <i class="fa-regular fa-heart"></i>
          <h3>Your wishlist is empty</h3>
          <p>Add items you love to your wishlist. They will be saved here so you can purchase them anytime.</p>
          <a href="#" class="shop-now-btn" onclick="app.navigateTo('shop'); return false;">Shop Cosmetics</a>
        </div>
      `;
      return;
    }

    container.innerHTML = '<div class="wishlist-grid" id="wishlist-grid"></div>';
    const grid = document.getElementById('wishlist-grid');

    wishlistProducts.forEach(product => {
      grid.appendChild(this.createProductCard(product));
    });
  }

  // 6. Global State Managers (Cart & Wishlist)
  // Direct Quick Add from Card
  handleDirectAddBag(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const shade = product.shades && product.shades.length > 0 ? product.shades[0].name : null;
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0].name : null;
    const price = product.sizes && product.sizes.length > 0 ? product.sizes[0].price : product.price;
    const mrp = product.sizes && product.sizes.length > 0 ? product.sizes[0].mrp : product.mrp;

    this.addToCart(productId, 1, shade, size, price, mrp);
  }

  // Add from PDP
  handlePdpAddBag(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.addToCart(
      productId,
      1,
      this.pdpState.selectedShade,
      this.pdpState.selectedSize,
      this.pdpState.activePrice,
      this.pdpState.activeMrp
    );
  }

  addToCart(productId, qty = 1, shade = null, size = null, price = null, mrp = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Check duplicate in cart (matching shade and size)
    const existingIndex = this.state.cart.findIndex(item => 
      item.productId === productId && 
      item.shade === shade && 
      item.size === size
    );

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += qty;
    } else {
      this.state.cart.push({
        productId,
        name: product.name,
        brand: product.brand,
        image: this.getProductImage(product),
        shade,
        size,
        price: price || product.price,
        mrp: mrp || product.mrp,
        quantity: qty
      });
    }

    // Save
    this.saveCart();
    this.updateBadges();
    this.renderCartDrawerItems();
    
    // Animate Badge count
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.remove('active');
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('active');
    }

    this.showToast('Item added to Bag successfully!');
    this.showCartDrawer();
  }

  updateCartQuantity(idx, change) {
    this.state.cart[idx].quantity += change;

    if (this.state.cart[idx].quantity <= 0) {
      this.state.cart.splice(idx, 1);
      this.showToast('Item removed from Bag');
    }

    this.saveCart();
    this.updateBadges();
    this.renderCartDrawerItems();
  }

  removeFromCart(idx) {
    this.state.cart.splice(idx, 1);
    this.saveCart();
    this.updateBadges();
    this.renderCartDrawerItems();
    this.showToast('Item removed from Bag');
  }

  saveCart() {
    this.saveUserState();
  }

  getAuthHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('access_token');
    return token ? { ...extraHeaders, Authorization: `Bearer ${token}` } : extraHeaders;
  }

  loadUserState(mergeCurrent = false) {
    const token = localStorage.getItem('access_token');
    if (!token) return Promise.resolve();

    const currentCart = [...this.state.cart];
    const currentWishlist = [...this.state.wishlist];

    return fetch('/user-state', {
      headers: this.getAuthHeaders()
    })
    .then(response => {
      if (!response.ok) throw new Error('Unable to load user state');
      return response.json();
    })
    .then(data => {
      const savedCart = Array.isArray(data.cart) ? data.cart : [];
      const savedWishlist = Array.isArray(data.wishlist) ? data.wishlist : [];

      this.state.cart = mergeCurrent ? this.mergeCartItems(savedCart, currentCart) : savedCart;
      this.state.wishlist = mergeCurrent ? [...new Set([...savedWishlist, ...currentWishlist])] : savedWishlist;
      this.updateBadges();
      this.renderCartDrawerItems();

      if (this.state.activeView === 'wishlist') this.renderWishlist();
      if (this.state.activeView === 'shop') this.renderShop();
      if (this.state.activeView === 'home') this.renderHome();

      if (mergeCurrent) this.saveUserState();
    })
    .catch(error => {
      console.error('User state load failed:', error);
    });
  }

  mergeCartItems(savedCart, currentCart) {
    const merged = [...savedCart];

    currentCart.forEach(currentItem => {
      const existingIndex = merged.findIndex(item =>
        item.productId === currentItem.productId &&
        item.shade === currentItem.shade &&
        item.size === currentItem.size
      );

      if (existingIndex > -1) {
        merged[existingIndex].quantity += currentItem.quantity;
      } else {
        merged.push(currentItem);
      }
    });

    return merged;
  }

  saveUserState() {
    const token = localStorage.getItem('access_token');
    if (!this.state.user.isLoggedIn || !token) return;

    fetch('/user-state', {
      method: 'PUT',
      headers: this.getAuthHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        cart: this.state.cart,
        wishlist: this.state.wishlist
      })
    }).catch(error => {
      console.error('User state save failed:', error);
    });
  }

  toggleWishlist(productId) {
    const idx = this.state.wishlist.indexOf(productId);
    
    if (idx > -1) {
      this.state.wishlist.splice(idx, 1);
      this.showToast('Item removed from Wishlist', 'info');
    } else {
      this.state.wishlist.push(productId);
      this.showToast('Item added to Wishlist!');
    }

    this.saveUserState();
    this.updateBadges();

    // Re-render current view if wishlist/shop
    if (this.state.activeView === 'wishlist') this.renderWishlist();
    if (this.state.activeView === 'shop') this.renderShop();
    if (this.state.activeView === 'home') this.renderHome();
  }

  handlePdpWishlistToggle(productId) {
    this.toggleWishlist(productId);
    
    // Sync PDP button UI active state
    const btn = document.getElementById('pdp-wishlist-btn');
    if (btn) {
      const isWishlisted = this.state.wishlist.includes(productId);
      btn.className = `pdp-wishlist ${isWishlisted ? 'active' : ''}`;
      btn.innerHTML = `<i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}`;
    }
  }

  updateBadges() {
    // Cart Badge
    const cartCount = this.state.cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const cartBadge = document.getElementById('cart-badge');
    const drawerCount = document.getElementById('cart-items-count');

    if (cartBadge) {
      cartBadge.innerText = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    if (drawerCount) {
      drawerCount.innerText = cartCount;
    }

    // Wishlist Badge
    const wishCount = this.state.wishlist.length;
    const wishBadge = document.getElementById('wishlist-badge');

    if (wishBadge) {
      wishBadge.innerText = wishCount;
      wishBadge.style.display = wishCount > 0 ? 'flex' : 'none';
    }
  }

  // 7. Cart Drawer Render Logic
  renderCartDrawerItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bag-shopping"></i>
          <h4>Your bag is empty</h4>
          <p>Add beauty products and complete your glow ritual.</p>
        </div>
      `;
      // Clear Coupon code UI
      this.state.couponApplied = null;
      document.getElementById('coupon-code-input').value = '';
      document.getElementById('coupon-message').className = 'coupon-message';
      document.getElementById('coupon-message').innerText = '';

      this.calculateCartTotals();
      return;
    }

    container.innerHTML = '';
    this.state.cart.forEach((item, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';

      let variantHTML = '';
      if (item.shade) {
        const prod = PRODUCTS.find(p => p.id === item.productId);
        const colCode = prod?.shades?.find(s => s.name === item.shade)?.colorCode || '#ddd';
        variantHTML += `<span class="variant-dot" style="background-color: ${colCode};"></span> Shade: ${item.shade}`;
      }
      if (item.size) {
        variantHTML += `${variantHTML ? ' | ' : ''}Size: ${item.size}`;
      }

      itemEl.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${item.brand}', '${item.name}')">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-brand">${item.brand}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">${variantHTML}</div>
          <div class="cart-item-price-qty">
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="app.updateCartQuantity(${idx}, -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="app.updateCartQuantity(${idx}, 1)">+</button>
            </div>
            <div class="cart-item-price">₹${item.price * item.quantity}</div>
          </div>
        </div>
        <button class="cart-item-delete" onclick="app.removeFromCart(${idx})"><i class="fa-solid fa-trash-can"></i></button>
      `;

      container.appendChild(itemEl);
    });

    this.calculateCartTotals();
  }

  calculateCartTotals() {
    const subtotal = this.state.cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    let shipping = subtotal >= 499 || subtotal === 0 ? 0 : 40;
    let discount = 0;

    if (this.state.couponApplied === 'NYKAA20') {
      discount = Math.round(subtotal * 0.2); // 20% Off
    } else if (this.state.couponApplied === 'FREESHIP') {
      shipping = 0;
    }

    const grandTotal = subtotal + shipping - discount;

    // Update UIs
    document.getElementById('cart-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('cart-shipping').innerText = shipping === 0 ? 'Free' : `₹${shipping}`;
    document.getElementById('cart-grand-total').innerText = `₹${grandTotal}`;

    // Coupon UI displays
    const coupRow = document.getElementById('cart-coupon-row');
    const coupName = document.getElementById('cart-coupon-name');
    const coupDisc = document.getElementById('cart-coupon-discount');

    if (discount > 0) {
      coupRow.style.display = 'flex';
      coupName.innerText = this.state.couponApplied;
      coupDisc.innerText = `-₹${discount}`;
    } else {
      coupRow.style.display = 'none';
    }

    // Save final totals globally for checkout use
    this.cartTotals = { subtotal, shipping, discount, grandTotal };
  }

  // Cart Coupon Application
  applyCouponCode() {
    const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
    const msgEl = document.getElementById('coupon-message');

    if (this.state.cart.length === 0) {
      this.showToast('Add items to Bag first', 'info');
      return;
    }

    if (!code) {
      msgEl.className = 'coupon-message error';
      msgEl.innerText = 'Please enter a code';
      return;
    }

    if (code === 'NYKAA20') {
      this.state.couponApplied = 'NYKAA20';
      msgEl.className = 'coupon-message success';
      msgEl.innerText = 'Coupon NYKAA20 applied! 20% discount added.';
      this.showToast('Coupon code applied!');
    } else if (code === 'FREESHIP') {
      this.state.couponApplied = 'FREESHIP';
      msgEl.className = 'coupon-message success';
      msgEl.innerText = 'Coupon FREESHIP applied! Shipping charges removed.';
      this.showToast('Coupon code applied!');
    } else {
      this.state.couponApplied = null;
      msgEl.className = 'coupon-message error';
      msgEl.innerText = 'Invalid coupon code. Try NYKAA20';
      this.showToast('Invalid Coupon Code', 'info');
    }

    this.calculateCartTotals();
  }

  // Drawers and Modal controls
  showCartDrawer() {
    document.getElementById('cart-drawer-overlay').classList.add('active');
    document.body.classList.add('no-scroll');
  }

  hideCartDrawer() {
    document.getElementById('cart-drawer-overlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // 8. Auth Manager Mock
  showAuthModal(onSuccessCallback = null) {
    this.authSuccessCallback = onSuccessCallback;
    document.getElementById('auth-modal-overlay').classList.add('active');
    document.getElementById('auth-step-login').style.display = 'block';
    document.getElementById('auth-step-signup').style.display = 'none';
    document.body.classList.add('no-scroll');
  }

  closeAuthModal() {
    document.getElementById('auth-modal-overlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  switchAuthScreen(screen) {
    if (screen === 'signup') {
      document.getElementById('auth-step-login').style.display = 'none';
      document.getElementById('auth-step-signup').style.display = 'block';
    } else {
      document.getElementById('auth-step-login').style.display = 'block';
      document.getElementById('auth-step-signup').style.display = 'none';
    }
  }

  handleLoginSubmit() {
    const inputVal = document.getElementById('login-email-phone').value.trim();
    const passVal = document.getElementById('login-password').value.trim();

    if (!inputVal) {
      this.showToast('Please enter your email or phone number', 'info');
      return;
    }
    if (!passVal) {
      this.showToast('Please enter your password', 'info');
      return;
    }

    // Call backend API for login
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: inputVal,
        password: passVal
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        // Store token and user info
        localStorage.setItem('access_token', data.access_token);
        
        const userName = data.name || 'User';
        this.state.user = { isLoggedIn: true, name: userName };
        localStorage.setItem('nykaa_user', JSON.stringify(this.state.user));
        
        this.updateUserAuthState();
        this.loadUserState(true);
        this.closeAuthModal();
        this.showToast(`Welcome back, ${userName}!`);

        document.getElementById('login-email-phone').value = '';
        document.getElementById('login-password').value = '';

        if (this.authSuccessCallback) {
          this.authSuccessCallback();
          this.authSuccessCallback = null;
        }
      } else {
        this.showToast(data.detail || 'Login failed', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.showToast('Connection error. Please try again.', 'error');
    });
  }

  handleSignupSubmit() {
    const nameVal = document.getElementById('signup-name').value.trim();
    const phoneVal = document.getElementById('signup-phone').value.trim();
    const emailVal = document.getElementById('signup-email').value.trim();
    const passVal = document.getElementById('signup-password').value.trim();

    if (!nameVal || !phoneVal || !emailVal || !passVal) {
      this.showToast('Please fill all sign up details', 'info');
      return;
    }
    if (phoneVal.length !== 10 || isNaN(phoneVal)) {
      this.showToast('Please enter a valid 10-digit phone number', 'info');
      return;
    }
    if (!emailVal.includes('@')) {
      this.showToast('Please enter a valid email address', 'info');
      return;
    }

    const signupData = new FormData();
    signupData.append('name', nameVal);
    signupData.append('phone', phoneVal);
    signupData.append('mail', emailVal);
    signupData.append('password', passVal);

    // Call backend API for registration
    fetch('/register', {
      method: 'POST',
      body: signupData
    })
    .then(response => response.json())
    .then(data => {
      if (data.Message && data.Message.includes('Register Successfully')) {
        return fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail: emailVal,
            password: passVal
          })
        })
        .then(response => response.json())
        .then(loginData => {
          if (loginData.access_token) {
            localStorage.setItem('access_token', loginData.access_token);
          }

          this.state.user = { isLoggedIn: true, name: loginData.name || nameVal };
          localStorage.setItem('nykaa_user', JSON.stringify(this.state.user));

          this.updateUserAuthState();
          this.loadUserState(true);
          this.closeAuthModal();
          this.showToast(`Account created! Welcome, ${nameVal}!`);

          document.getElementById('signup-name').value = '';
          document.getElementById('signup-phone').value = '';
          document.getElementById('signup-email').value = '';
          document.getElementById('signup-password').value = '';

          if (this.authSuccessCallback) {
            this.authSuccessCallback();
            this.authSuccessCallback = null;
          }
        });
      } else if (data.detail) {
        this.showToast(data.detail, 'error');
      } else {
        this.showToast('Registration failed. Please try again.', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.showToast('Connection error. Please check if backend is running.', 'error');
    });
  }

  logout() {
    this.state.user = { isLoggedIn: false, name: null };
    this.state.cart = [];
    this.state.wishlist = [];
    localStorage.removeItem('nykaa_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('nykaa_cart');
    localStorage.removeItem('nykaa_wishlist');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    this.updateBadges();
    this.renderCartDrawerItems();
    if (this.state.activeView === 'wishlist') this.renderWishlist();
    if (this.state.activeView === 'shop') this.renderShop();
    if (this.state.activeView === 'home') this.renderHome();
    this.updateUserAuthState();
    this.showToast('Logged out successfully');
  }

  updateUserAuthState() {
    const wrapper = document.getElementById('user-menu-wrapper');
    const signinBtn = document.getElementById('login-modal-btn');
    const dropdown = document.getElementById('user-dropdown');

    if (this.state.user.isLoggedIn) {
      signinBtn.innerText = `Hi, ${this.state.user.name.split(' ')[0]}`;
      signinBtn.style.backgroundColor = 'transparent';
      signinBtn.style.color = 'var(--text-main)';
      signinBtn.style.border = '1px solid var(--border-color)';
      signinBtn.classList.remove('signin-btn');
      signinBtn.classList.add('nav-btn');
      // Hover bindings done in CSS for user-menu-wrapper
    } else {
      signinBtn.innerText = 'Login';
      signinBtn.style.backgroundColor = 'var(--nykaa-pink)';
      signinBtn.style.color = 'var(--bg-white)';
      signinBtn.style.border = 'none';
      signinBtn.classList.remove('nav-btn');
      signinBtn.classList.add('signin-btn');
    }
  }

  showOrders() {
    if (!this.state.user.isLoggedIn) {
      this.showToast('Please login to view your orders', 'info');
      this.showAuthModal(() => this.showOrders());
      return;
    }

    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.remove('active');

    const overlay = document.getElementById('orders-modal-overlay');
    const list = document.getElementById('orders-list');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    list.innerHTML = '<div class="orders-empty">Loading orders...</div>';

    fetch('/orders', {
      headers: this.getAuthHeaders()
    })
    .then(response => {
      if (!response.ok) throw new Error('Unable to load orders');
      return response.json();
    })
    .then(orders => this.renderOrders(orders))
    .catch(error => {
      console.error('Orders load failed:', error);
      list.innerHTML = '<div class="orders-empty">Unable to load orders right now.</div>';
    });
  }

  closeOrdersModal() {
    document.getElementById('orders-modal-overlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  renderOrders(orders) {
    const list = document.getElementById('orders-list');

    if (!Array.isArray(orders) || orders.length === 0) {
      list.innerHTML = `
        <div class="orders-empty">
          <i class="fa-solid fa-box-open"></i>
          <h4>No orders yet</h4>
          <p>Your completed orders will appear here.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    orders.forEach(order => {
      const orderDate = new Date(order.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      const total = order.totals?.grandTotal ?? 0;
      const items = Array.isArray(order.items) ? order.items : [];

      const card = document.createElement('div');
      card.className = 'order-card';
      card.innerHTML = `
        <div class="order-card-header">
          <div>
            <strong>${order.order_id}</strong>
            <span>${orderDate}</span>
          </div>
          <div class="order-card-total">₹${total}</div>
        </div>
        <div class="order-card-items">
          ${items.map(item => `
            <div class="order-card-item">
              <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${item.brand}', '${item.name}')">
              <div>
                <strong>${item.name}</strong>
                <span>${item.brand || ''} ${item.quantity ? `&middot; Qty ${item.quantity}` : ''}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="order-card-address">
          Delivered to ${order.address?.name || 'Customer'}, ${order.address?.city || ''}
        </div>
      `;
      list.appendChild(card);
    });
  }

  // 9. Checkout Flow Controller
  handleCheckoutTrigger() {
    if (this.state.cart.length === 0) {
      this.showToast('Your cart is empty', 'info');
      return;
    }

    this.hideCartDrawer();

    if (!this.state.user.isLoggedIn) {
      // Prompt sign in, and trigger checkout on success
      this.showToast('Please login to complete checkout', 'info');
      this.showAuthModal(() => this.openCheckoutFlow());
    } else {
      this.openCheckoutFlow();
    }
  }

  openCheckoutFlow() {
    document.getElementById('checkout-modal-overlay').classList.add('active');
    document.body.classList.add('no-scroll');

    // Reset steps
    this.state.checkoutStep = 1;
    this.updateCheckoutStepUI();
  }

  closeCheckoutModal() {
    document.getElementById('checkout-modal-overlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  updateCheckoutStepUI() {
    // Toggle active content divs
    document.querySelectorAll('.checkout-step-content').forEach((el, idx) => {
      el.classList.toggle('active', idx + 1 === this.state.checkoutStep);
    });

    // Handle indicators active / completed states
    for (let step = 1; step <= 3; step++) {
      const ind = document.getElementById(`step-ind-${step}`);
      if (ind) {
        ind.className = `step-indicator ${step === this.state.checkoutStep ? 'active' : step < this.state.checkoutStep ? 'completed' : ''}`;
      }
    }

    if (this.state.checkoutStep === 2) {
      // Render checkout summary values
      document.getElementById('chk-grand-total').innerText = `₹${this.cartTotals.grandTotal}`;
      document.getElementById('chk-delivery-addr-preview').innerText = `${this.state.checkoutAddress.address}, ${this.state.checkoutAddress.city}`;
    }
  }

  handleAddressSubmit() {
    const name = document.getElementById('chk-name').value.trim();
    const address = document.getElementById('chk-address').value.trim();
    const pincode = document.getElementById('chk-pincode').value.trim();
    const city = document.getElementById('chk-city').value.trim();
    const phone = document.getElementById('chk-phone').value.trim();

    if (!name || !address || !pincode || !city || !phone) {
      this.showToast('Please fill all required details', 'info');
      return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      this.showToast('Please enter a valid 10-digit mobile number', 'info');
      return;
    }

    this.state.checkoutAddress = { name, address, pincode, city, phone };
    this.state.checkoutStep = 2;
    this.updateCheckoutStepUI();
  }

  selectPaymentOption(opt) {
    this.state.selectedPayment = opt;
    
    // Toggle active layout border
    const cards = document.querySelectorAll('.payment-option-card');
    cards.forEach(c => c.classList.remove('active'));

    const activeRadio = document.getElementById(`pay-${opt}`);
    activeRadio.checked = true;
    activeRadio.closest('.payment-option-card').classList.add('active');
  }

  async handlePaymentSubmit() {
    // Generate order success variables
    const orderId = 'NYK-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('chk-order-id').innerText = orderId;
    const orderItems = this.state.cart.map(item => ({ ...item }));
    const orderTotals = { ...this.cartTotals };

    try {
      const response = await fetch('/orders', {
        method: 'POST',
        headers: this.getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          order_id: orderId,
          items: orderItems,
          address: this.state.checkoutAddress,
          totals: orderTotals,
          payment_method: this.state.selectedPayment
        })
      });

      if (!response.ok) throw new Error('Order save failed');
    } catch (error) {
      console.error('Order save failed:', error);
      this.showToast('Order could not be saved. Please try again.', 'error');
      return;
    }

    // Render items list inside success summary
    const listEl = document.getElementById('chk-success-items-list');
    listEl.innerHTML = '';
    orderItems.forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.style.display = 'flex';
      itemRow.style.justify = 'space-between';
      itemRow.style.fontSize = '12px';
      itemRow.innerHTML = `
        <span style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name} (${item.quantity})</span>
        <strong>₹${item.price * item.quantity}</strong>
      `;
      listEl.appendChild(itemRow);
    });

    // Transition to success screen
    this.state.checkoutStep = 3;
    this.updateCheckoutStepUI();

    // Clear cart state completely
    this.state.cart = [];
    this.saveCart();
    this.updateBadges();
    this.renderCartDrawerItems();

    this.showToast('Order placed successfully!');
  }

  // 10. Horizontal Sliders Scrolling Helpers
  scrollProductSlider(sliderId, dir) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const scrollAmount = slider.offsetWidth * 0.8;
    slider.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  }

  // 11. Hero Banner Slider render
  renderHeroCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track || !dotsContainer) return;

    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    this.heroBanners.forEach((banner, idx) => {
      // Create Slide
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.style.backgroundImage = `url('${banner.image}')`;
      
      slide.innerHTML = `
        <div class="carousel-content">
          <span>Nykaa Featured</span>
          <h2>${banner.title}</h2>
          <p>${banner.subtitle}</p>
          <a href="#" class="carousel-btn" onclick="app.handleBannerClick(${idx}); return false;">${banner.btnText}</a>
        </div>
      `;
      track.appendChild(slide);

      // Create Dot
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.onclick = () => {
        this.stopCarouselAutoPlay();
        this.currentCarouselIndex = idx;
        this.updateCarouselDisplay();
        this.startCarouselAutoPlay();
      };
      dotsContainer.appendChild(dot);
    });
  }

  slideHeroCarousel(dir) {
    const len = this.heroBanners.length;
    if (dir === 'next') {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % len;
    } else {
      this.currentCarouselIndex = (this.currentCarouselIndex - 1 + len) % len;
    }
    this.updateCarouselDisplay();
  }

  updateCarouselDisplay() {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track) return;

    track.style.transform = `translateX(-${this.currentCarouselIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentCarouselIndex);
    });
  }

  startCarouselAutoPlay() {
    this.carouselTimer = setInterval(() => {
      this.slideHeroCarousel('next');
    }, 5000);
  }

  stopCarouselAutoPlay() {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  handleBannerClick(idx) {
    const banner = this.heroBanners[idx];
    if (banner.target.brand) {
      this.navigateTo('shop', { brand: banner.target.brand });
    } else if (banner.target.category) {
      this.navigateTo('shop', { category: banner.target.category });
    }
  }

  // 12. Promotional Mid banners rendering
  renderPromosGrid() {
    const container = document.getElementById('promos-grid');
    if (!container) return;

    const promos = [
      {
        title: "Clean Skincare Routine",
        sub: "Minimalist marks up to 35% Off",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        target: { category: "skin" }
      },
      {
        title: "Bold Lip Collection",
        sub: "Maybelline SuperStay Ink 14% Off",
        img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        target: { category: "makeup", subcat: "lips" }
      },
      {
        title: "Elegant Body Mists",
        sub: "Sweet Vanilla & Hawaii Mists 22% Off",
        img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
        target: { category: "fragrance" }
      }
    ];

    container.innerHTML = '';
    promos.forEach(pr => {
      const el = document.createElement('div');
      el.className = 'promo-banner';
      el.style.backgroundImage = `url('${pr.img}')`;
      el.onclick = () => {
        if (pr.target.subcat) {
          this.navigateTo('shop', { category: pr.target.category, subcategory: pr.target.subcat });
        } else {
          this.navigateTo('shop', { category: pr.target.category });
        }
      };

      el.innerHTML = `
        <span>Hurry Up!</span>
        <h4>${pr.title}</h4>
        <p>${pr.sub}</p>
        <button class="luxe-btn" style="border-color: white; color: white;">Shop Now</button>
      `;
      container.appendChild(el);
    });
  }

  // Luxe spotlight render
  renderLuxeSpotlight() {
    const container = document.getElementById('luxe-grid');
    if (!container) return;

    const luxeItems = PRODUCTS.filter(p => p.tags.includes('Luxe')).slice(0, 4);

    container.innerHTML = '';
    luxeItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'luxe-card';
      el.innerHTML = `
        <div class="luxe-image" onclick="app.navigateTo('product', { id: '${item.id}' })" style="cursor: pointer;">
          <img src="${this.getProductImage(item)}" alt="${item.name}" onerror="this.onerror=null; this.src=app.getProductFallbackImage('${item.brand}', '${item.name}')">
        </div>
        <div class="luxe-info">
          <h4>${item.brand}</h4>
          <p>${item.name}</p>
          <button class="luxe-btn" onclick="app.navigateTo('product', { id: '${item.id}' })">Discover</button>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // Instant search input suggestion render
  handleSearchSuggestions(query) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!suggestionsBox) return;

    if (!query) {
      suggestionsBox.classList.remove('active');
      suggestionsBox.innerHTML = '';
      return;
    }

    const queryLower = query.toLowerCase();
    
    // Look up in products name, brand, category, subcategory
    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.brand.toLowerCase().includes(queryLower) ||
      p.subcategory.toLowerCase().includes(queryLower)
    ).slice(0, 5);

    if (matches.length === 0) {
      suggestionsBox.innerHTML = `
        <div class="suggestion-item" style="color: var(--text-muted); cursor: default;">
          <i class="fa-solid fa-circle-question"></i> No matches for "${query}"
        </div>
      `;
      suggestionsBox.classList.add('active');
      return;
    }

    suggestionsBox.innerHTML = '';
    matches.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'suggestion-item';
      itemEl.innerHTML = `
        <i class="fa-solid fa-magnifying-glass"></i>
        <div>
          <strong style="color: var(--text-main); font-size: 13px;">${item.brand}</strong> - ${item.name}
        </div>
      `;
      itemEl.onclick = () => {
        suggestionsBox.classList.remove('active');
        this.navigateTo('product', { id: item.id });
      };
      suggestionsBox.appendChild(itemEl);
    });

    suggestionsBox.classList.add('active');
  }

  // Toast System Alerts
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check success' : 'fa-circle-info info'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto delete after animation finishes
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Instantiate App globally
const app = new NykaaApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app = app;
  app.init();
});
