// ===== DEFAULT PRODUCTS (used if localStorage is empty) =====
const defaultProducts = [
    {
        id: 3,
        title: "MDF Table Calendar",
        category: "customized-gifts",
        price: 650,
        originalPrice: 900,
        discount: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        badge: "28% OFF"
    },
    {
        id: 5,
        title: "Name Print Decorated MDF",
        category: "customized-gifts",
        price: 1100,
        originalPrice: 1400,
        discount: 21,
        image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400&h=400&fit=crop",
        badge: "21% OFF"
    },
    {
        id: 8,
        title: "Christoph Baby Frame",
        category: "customized-gifts",
        price: 800,
        originalPrice: 1200,
        discount: 33,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        badge: "33% OFF"
    },
    {
        id: 9,
        title: "Custom Wall Clock",
        category: "wall-clocks",
        price: 999,
        originalPrice: 1500,
        discount: 33,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop",
        badge: "33% OFF"
    },
    {
        id: 11,
        title: "Couple Name Plate",
        category: "name-plates",
        price: 899,
        originalPrice: 1200,
        discount: 25,
        image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400&h=400&fit=crop",
        badge: "25% OFF"
    },
    {
        id: 13,
        title: "Classic Men's Watch",
        category: "mens-watches",
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
        badge: "35% OFF"
    },
    {
        id: 14,
        title: "Elegant Women's Watch",
        category: "womens-watches",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
        badge: "40% OFF"
    },
    {
        id: 15,
        title: "Silver Chain Watch",
        category: "mens-watches",
        price: 1899,
        originalPrice: 2999,
        discount: 36,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop",
        badge: "36% OFF"
    },
    {
        id: 16,
        title: "Rose Gold Ladies Watch",
        category: "womens-watches",
        price: 2199,
        originalPrice: 3500,
        discount: 37,
        image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=400&h=400&fit=crop",
        badge: "37% OFF"
    }
];

// ===== INITIALIZE PRODUCTS IN LOCALSTORAGE =====
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    } else {
        // Migration: Ensure categories match updated IDs
        try {
            let products = JSON.parse(localStorage.getItem('products'));
            let modified = false;
            products = products.map(p => {
                if (p.category === 'clocks') {
                    p.category = 'wall-clocks';
                    modified = true;
                }
                return p;
            });
            if (modified) {
                localStorage.setItem('products', JSON.stringify(products));
            }
        } catch (e) {
            console.error('Error migrating products:', e);
        }
    }
}

// ===== DEFAULT CATEGORIES =====
const defaultCategories = [
    { id: 'mens-watches', name: "Men's Watches" },
    { id: 'womens-watches', name: "Women's Watches" },
    { id: 'wall-clocks', name: "Wall Clocks" },
    { id: 'customized-gifts', name: "Customized Gifts" },
    { id: 'photo-frames', name: "Photo Frames" }
];

// Mapping category IDs to their dedicated HTML pages
const categoryPageMapping = {
    'mens-watches': 'watches.html',
    'womens-watches': 'watches.html',
    'wall-clocks': 'clocks.html',
    'customized-gifts': 'gifts.html',
    'photo-frames': 'frames.html'
};

// Keyword synonyms for common categories
const searchSynonyms = {
    'watch': 'mens-watches',
    'watches': 'mens-watches',
    'clock': 'wall-clocks',
    'clocks': 'wall-clocks',
    'gift': 'customized-gifts',
    'gifts': 'customized-gifts',
    'frame': 'photo-frames',
    'frames': 'photo-frames'
};

// ===== GET CATEGORIES =====
function getCategories() {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    return JSON.parse(localStorage.getItem('categories'));
}

// ===== GET PRODUCTS FROM LOCALSTORAGE =====
function getProducts() {
    initializeProducts();
    return JSON.parse(localStorage.getItem('products')) || defaultProducts;
}

// ===== CART STATE =====
// ===== CART STATE REMOVED =====

// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
// Cart elements removed
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');

// Search Elements
const headerSearchInput = document.getElementById('headerSearchInput');
const headerSearchBtn = document.getElementById('headerSearchBtn');
const modalSearchInput = document.getElementById('searchInput');
const modalSearchBtn = document.querySelector('.search-submit');
const contactForm = document.getElementById('contactForm');
const categoryCards = document.querySelectorAll('.category-card');

// Modal Elements (assigned dynamically)
let productModal, closeProductModal, modalMainImage, modalThumbnails, modalTitle, modalCategory, modalPrice, modalOriginalPrice, modalBadge, modalBuyNow, prevImageBtn, nextImageBtn;

let currentProductImages = [];
let currentImageIndex = 0;

// ===== INJECT PRODUCT MODAL HTML =====
function injectProductModal() {
    if (document.getElementById('productModal')) return;

    const modalHtml = `
    <!-- Product Details Modal -->
    <div class="product-modal" id="productModal">
        <div class="product-modal-content">
            <button class="close-modal" id="closeProductModal">
                <i class="fas fa-times"></i>
            </button>
            <div class="product-modal-body">
                <div class="product-modal-gallery">
                    <div class="main-image-container">
                        <img id="modalMainImage" src="" alt="Product">
                        <button class="gallery-nav prev" id="prevImage"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-nav next" id="nextImage"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <div class="thumbnails-container" id="modalThumbnails">
                        <!-- Thumbnails will be loaded here -->
                    </div>
                </div>
                <div class="product-modal-info">
                    <div class="modal-badge-container">
                        <span class="modal-badge" id="modalBadge"></span>
                    </div>
                    <h2 class="modal-title" id="modalTitle"></h2>
                    <p class="modal-category" id="modalCategory"></p>
                    <div class="modal-price">
                        <span class="modal-price-current" id="modalPrice"></span>
                        <span class="modal-price-original" id="modalOriginalPrice"></span>
                    </div>
                    <div class="modal-description">
                        <p>High-quality customized product made with premium materials. Perfect for gifting and personal use.</p>
                    </div>
                    <div class="modal-actions">
                        <button class="buy-now-btn btn-full" id="modalBuyNow">
                            <i class="fab fa-whatsapp"></i> Order on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function initModalElements() {
    productModal = document.getElementById('productModal');
    closeProductModal = document.getElementById('closeProductModal');
    modalMainImage = document.getElementById('modalMainImage');
    modalThumbnails = document.getElementById('modalThumbnails');
    modalTitle = document.getElementById('modalTitle');
    modalCategory = document.getElementById('modalCategory');
    modalPrice = document.getElementById('modalPrice');
    modalOriginalPrice = document.getElementById('modalOriginalPrice');
    modalBadge = document.getElementById('modalBadge');
    modalBuyNow = document.getElementById('modalBuyNow');
    prevImageBtn = document.getElementById('prevImage');
    nextImageBtn = document.getElementById('nextImage');
}

// ===== INJECT LIGHTBOX HTML =====
function injectLightbox() {
    if (document.getElementById('imageLightbox')) return;

    const lightboxHtml = `
    <div class="image-lightbox" id="imageLightbox">
        <button class="close-lightbox" id="closeLightbox">
            <i class="fas fa-times"></i>
        </button>
        <div class="lightbox-content" id="lightboxContent">
            <img id="lightboxImage" src="" alt="Zoomed Product">
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', lightboxHtml);

    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('closeLightbox');

    // Handle Open
    const mainImg = document.getElementById('modalMainImage');
    if (mainImg) {
        mainImg.addEventListener('click', () => {
            lightboxImg.src = mainImg.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Handle Zoom
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.id === 'closeLightbox' || e.target.closest('#closeLightbox')) {
            lightbox.classList.remove('active');
            lightbox.classList.remove('zoomed');
            document.body.style.overflow = '';
            if (productModal && productModal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            lightbox.classList.toggle('zoomed');
        }
    });

    // Handle Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            lightbox.classList.remove('zoomed');
            if (productModal && productModal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    });
}


// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Inject modal for product details
    injectProductModal();
    injectLightbox();
    initModalElements();

    // Determine which page we are on
    const path = window.location.pathname;

    // Check for specific pages and render appropriate content
    if (path.includes('watches.html')) {
        renderProducts('all-watches');
    } else if (path.includes('clocks.html')) {
        renderProducts('wall-clocks');
    } else if (path.includes('frames.html')) {
        renderProducts('photo-frames');
    } else if (path.includes('gifts.html')) {
        renderProducts('customized-gifts');
    } else if (path.includes('category.html')) {
        // Generic category page
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get('id');
        if (categoryId) {
            renderGenericCategory(categoryId);
            renderProducts(categoryId);
        }
    } else {
        // Default (Home Page)
        if (document.querySelector('.categories-grid')) {
            renderCategories();
        }
        renderProducts('all');
    }

    // Check for search parameter in URL (redirected from another page)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        // Populate search inputs
        if (headerSearchInput) headerSearchInput.value = searchQuery;
        if (modalSearchInput) modalSearchInput.value = searchQuery;

        handleSearch(searchQuery);
    }

    initScrollEffects();
    renderNavCategories();

    // Categories Dropdown Toggle
    const categoriesBtn = document.getElementById('categoriesBtn');
    const navDropdown = document.querySelector('.nav-dropdown');

    if (categoriesBtn && navDropdown) {
        categoriesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navDropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (navDropdown && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('active');
        }
    });

    // Modal Close Events
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Gallery Nav
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', () => {
            changeImage(currentImageIndex - 1);
        });
    }

    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', () => {
            changeImage(currentImageIndex + 1);
        });
    }

    // Header Search Logic
    if (headerSearchInput) {
        headerSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch(headerSearchInput.value);
            }
        });
    }

    if (headerSearchBtn) {
        headerSearchBtn.addEventListener('click', () => {
            handleSearch(headerSearchInput.value);
        });
    }

    // Modal Search Logic
    if (modalSearchInput) {
        modalSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch(modalSearchInput.value);
                if (searchModal) searchModal.classList.remove('active');
            }
        });
    }

    if (modalSearchBtn) {
        modalSearchBtn.addEventListener('click', () => {
            handleSearch(modalSearchInput.value);
            if (searchModal) searchModal.classList.remove('active');
        });
    }
});

// ===== RENDER PRODUCTS =====
function renderProducts(filter, searchQuery = '') {
    if (!productsGrid) return;
    const products = getProducts();

    let filteredProducts = products;

    // Filter by category
    if (filter === 'all') {
        filteredProducts = products;
    } else if (filter === 'all-watches') {
        filteredProducts = products.filter(product =>
            product.category === 'mens-watches' || product.category === 'womens-watches'
        );
    } else {
        filteredProducts = products.filter(product => product.category === filter);
    }

    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }

    // Handle no results
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Products Found</h3>
                <p>We couldn't find anything matching "${searchQuery}". Please try a different search term.</p>
                <button class="btn btn-primary" onclick="renderProducts('all')">View All Products</button>
            </div>
        `;
        productsGrid.style.gridTemplateColumns = '1fr';
        return 0;
    }

    // Reset grid layout
    productsGrid.style.gridTemplateColumns = '';

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <span class="product-badge">${product.badge}</span>
                <button class="product-wishlist" onclick="event.stopPropagation(); toggleWishlist(this)" aria-label="Add to wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="price-current">₹${product.price}</span>
                    <span class="price-original">₹${product.originalPrice}</span>
                </div>
                <button class="buy-now-btn" onclick="event.stopPropagation(); buyNow(${product.id})">
                    <i class="fab fa-whatsapp"></i> Buy Now
                </button>
            </div>
        </div>
    `).join('');

    // Add animation
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });

    return filteredProducts.length;
}

// ===== CATEGORY UTILS =====
const getCategoryIcon = (id) => {
    if (id.includes('watch')) return 'fa-clock';
    if (id.includes('clock')) return 'fa-stopwatch';
    if (id.includes('frame')) return 'fa-image';
    if (id.includes('gift')) return 'fa-gift';
    return 'fa-tag'; // Default icon
};

const getCategoryLink = (id) => {
    if (id === 'mens-watches' || id === 'womens-watches') return 'watches.html';
    if (id === 'wall-clocks') return 'clocks.html';
    if (id === 'photo-frames') return 'frames.html';
    if (id === 'customized-gifts') return 'gifts.html';
    return `category.html?id=${id}`;
};

// ===== RENDER NAV CATEGORIES =====
function renderNavCategories() {
    const categories = getCategories();
    const navCategories = document.getElementById('navCategories');
    if (!navCategories) return;

    navCategories.innerHTML = categories.map(cat => {
        const link = getCategoryLink(cat.id);
        return `<li><a href="${link}">${cat.name}</a></li>`;
    }).join('');
}

// ===== RENDER CATEGORIES (HOMEPAGE) =====
function renderCategories() {
    const container = document.querySelector('.categories-grid');
    if (!container) return;

    const categories = getCategories();
    const products = getProducts();

    container.innerHTML = categories.map(cat => {
        const count = products.filter(p => p.category === cat.id).length;
        const icon = getCategoryIcon(cat.id);
        const link = getCategoryLink(cat.id);

        return `
            <a href="${link}" class="category-card">
                <div class="category-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <h3>${cat.name}</h3>
                <p>${count} Products</p>
            </a>
        `;
    }).join('');
}

// ===== RENDER GENERIC CATEGORY PAGE =====
function renderGenericCategory(categoryId) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (category) {
        document.title = `${category.name} - Abinaya Times & Gift Shop`;
        const titleEl = document.getElementById('pageTitle');
        const subtitleEl = document.getElementById('pageSubtitle');

        if (titleEl) titleEl.textContent = category.name;
        if (subtitleEl) subtitleEl.textContent = 'Explore our collection';
    }
}




// ===== FILTER PRODUCTS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ===== CATEGORY CARDS =====
// ===== HANDLE SEARCH =====
function handleSearch(query) {
    if (!query || !query.trim()) {
        renderProducts('all');
        return;
    }

    const q = query.toLowerCase().trim();

    // Check for admin keyword
    if (q === 'yogikabaddi') {
        window.location.href = 'admin.html';
        return;
    }
    const products = getProducts();
    const categories = getCategories();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    let targetCategoryId = null;

    // 1. Check for synonyms
    for (const [kw, catId] of Object.entries(searchSynonyms)) {
        if (q.includes(kw)) {
            targetCategoryId = catId;
            break;
        }
    }

    // 2. Check all categories dynamically (including admin-added ones)
    if (!targetCategoryId) {
        const matchingCategory = categories.find(cat =>
            cat.name.toLowerCase().includes(q) ||
            cat.id.toLowerCase().includes(q)
        );
        if (matchingCategory) {
            targetCategoryId = matchingCategory.id;
        }
    }

    // 3. Check for product matches -> get their category
    if (!targetCategoryId) {
        const matchingProduct = products.find(p => p.title.toLowerCase().includes(q));
        if (matchingProduct) {
            targetCategoryId = matchingProduct.category;
        }
    }

    // 4. Determine Redirection URL
    if (targetCategoryId) {
        let targetUrl = '';
        if (categoryPageMapping[targetCategoryId]) {
            targetUrl = categoryPageMapping[targetCategoryId];
        } else {
            // Generic category page for admin-added categories
            targetUrl = `category.html?id=${targetCategoryId}`;
        }

        // Redirect if not already on the target page
        // Use a more robust check for current page
        const isCurrentPage = window.location.pathname.includes(targetUrl) ||
            (targetUrl === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')));

        if (!isCurrentPage) {
            window.location.href = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}search=${encodeURIComponent(q)}`;
            return;
        }
    }

    // 5. Fallback: Local filtering on current page
    const productsSection = document.getElementById('products') || document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Deactivate all filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));

    // Render with search and check result count
    const resultCount = renderProducts('all', q);

    if (resultCount === 0) {
        showNotification(`Invalid search! No products found for "${query}"`, 'error');
    } else {
        showNotification(`Searching for: "${query}"`);
    }
}

// ===== CATEGORY CARDS =====
categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Only run this logic if it's NOT a link (optional, for backward compatibility)
        if (!card.getAttribute('href')) {
            const category = card.dataset.category;
            if (category && document.getElementById('products')) {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    filterBtns.forEach(btn => {
                        if (btn.dataset.filter === category) {
                            btn.click();
                        }
                    });
                }, 500);
            }
        }
    });
});

// ===== BUY NOW (WHATSAPP) =====
function buyNow(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const message = `Hello, I want to buy this product:\n\n*${product.title}*\nPrice: ₹${product.price}\nCategory: ${product.category}\n\nLink: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/919043715876?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
}

// ===== PRODUCT MODAL LOGIC =====
function openProductModal(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Set product info
    modalTitle.textContent = product.title;
    modalCategory.textContent = product.category.replace('-', ' ');
    modalPrice.textContent = `₹${product.price}`;
    modalOriginalPrice.textContent = `₹${product.originalPrice}`;
    modalBadge.textContent = product.badge;

    // Setup WhatsApp button
    modalBuyNow.onclick = () => buyNow(product.id);

    // Setup Gallery
    currentProductImages = product.images || [product.image];
    currentImageIndex = 0;

    renderThumbnails();
    updateModalImage();

    // Show modal
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderThumbnails() {
    modalThumbnails.innerHTML = currentProductImages.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="${img}" alt="Thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/80?text=Error'">
        </div>
    `).join('');
}

function changeImage(index) {
    if (index < 0 || index >= currentProductImages.length) return;

    currentImageIndex = index;
    updateModalImage();

    // Update active thumbnail
    const thumbnails = modalThumbnails.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) thumb.classList.add('active');
        else thumb.classList.remove('active');
    });
}

function updateModalImage() {
    modalMainImage.style.opacity = '0';
    setTimeout(() => {
        modalMainImage.src = currentProductImages[currentImageIndex];
        modalMainImage.style.opacity = '1';
    }, 200);

    // Update nav buttons
    prevImageBtn.disabled = currentImageIndex === 0;
    nextImageBtn.disabled = currentImageIndex === currentProductImages.length - 1;

    // Hide nav if only one image
    if (currentProductImages.length <= 1) {
        prevImageBtn.style.display = 'none';
        nextImageBtn.style.display = 'none';
        modalThumbnails.style.display = 'none';
    } else {
        prevImageBtn.style.display = 'flex';
        nextImageBtn.style.display = 'flex';
        modalThumbnails.style.display = 'flex';
    }
}

// ===== UPDATE CART COUNT REMOVED =====

// ===== TOGGLE WISHLIST =====
function toggleWishlist(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');

    if (btn.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Added to wishlist!');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Removed from wishlist');
    }
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    const bg = type === 'error' ? '#e74c3c' : '#1a1a1a';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${bg};
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===== MOBILE MENU =====
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');

        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Don't close if it's the categories button (handled by its own toggle)
        if (link.id === 'categoriesBtn') return;

        nav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ===== SEARCH MODAL =====
if (searchModal) {
    const handleSearchOpen = () => {
        searchModal.classList.add('active');
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearchOpen);
    if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', handleSearchOpen);
}

if (closeSearch && searchModal) {
    closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });
}

if (searchModal) {
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.classList.remove('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header shadow
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (currentScroll > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        lastScroll = currentScroll;
    });
}

// ===== BACK TO TOP =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function initNavLinks() {
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    });
}

// ===== CONTACT FORM =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple form validation feedback
    const formData = new FormData(contactForm);
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Show loading
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#28a745';

        showNotification('Thank you! We will contact you soon.');
        contactForm.reset();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    }, 1500);
});

// ===== CART BUTTON REMOVED =====

// ===== VIEW ALL BUTTON =====
document.getElementById('viewAllBtn').addEventListener('click', () => {
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) {
        allBtn.click();
    }
    showNotification('Showing all categories');
});

// ===== SMOOTH REVEAL ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.category-card, .feature-card, .contact-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== PRELOAD IMAGES =====
function preloadImages() {
    const products = getProducts();
    products.forEach(product => {
        const img = new Image();
        img.src = product.image;
    });
}

preloadImages();

console.log('🎁 Abinaya Times & Gift Shop - Website Loaded Successfully!');
