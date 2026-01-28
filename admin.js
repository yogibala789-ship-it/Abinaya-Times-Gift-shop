// ===== ADMIN CREDENTIALS =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ===== DEFAULT CATEGORIES =====
const defaultCategories = [
    { id: 'mens-watches', name: "Men's Watches" },
    { id: 'womens-watches', name: "Women's Watches" },
    { id: 'wall-clocks', name: "Wall Clocks" },
    { id: 'customized-gifts', name: "Customized Gifts" }
];

// ===== DEFAULT PRODUCTS =====
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
        category: "clocks",
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
    }
];

// ===== DOM ELEMENTS =====
const loginContainer = document.getElementById('loginContainer');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    checkAuth();
    setupEventListeners();
});

// ===== INITIALIZE PRODUCTS IN LOCALSTORAGE =====
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// ===== GET PRODUCTS =====
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// ===== SAVE PRODUCTS =====
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// ===== GET CATEGORIES =====
function getCategories() {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    return JSON.parse(localStorage.getItem('categories'));
}

// ===== SAVE CATEGORIES =====
function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// ===== CHECK AUTH =====
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

// ===== SHOW LOGIN =====
function showLogin() {
    loginContainer.style.display = 'flex';
    adminDashboard.classList.remove('active');
}

// ===== SHOW DASHBOARD =====
function showDashboard() {
    loginContainer.style.display = 'none';
    adminDashboard.classList.add('active');
    loadDashboard();
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Sidebar navigation
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    // Product form
    productForm.addEventListener('submit', handleProductSubmit);

    // Image preview
    document.getElementById('productImage').addEventListener('input', handleImagePreview);

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Search products
    document.getElementById('searchProducts').addEventListener('input', handleSearch);
}

// ===== HANDLE LOGIN =====
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showToast('Login successful! Welcome Admin');
    } else {
        loginError.textContent = 'Invalid username or password';
        loginError.classList.add('show');
        setTimeout(() => loginError.classList.remove('show'), 3000);
    }
}

// ===== HANDLE LOGOUT =====
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    showLogin();
    loginForm.reset();
}

// ===== SHOW SECTION =====
function showSection(sectionId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId + 'Section').classList.add('active');

    // Close mobile sidebar
    sidebar.classList.remove('active');

    // Load section data
    if (sectionId === 'products') {
        loadProductsTable();
    } else if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'categories') {
        loadCategories();
    } else if (sectionId === 'add-product') {
        resetForm();
    }
}

// Make showSection global for inline onclick
window.showSection = showSection;

// ===== LOAD DASHBOARD =====
function loadDashboard() {
    const products = getProducts();
    document.getElementById('totalProducts').textContent = products.length;
    loadProductsTable();
    loadCategories();
}

// ===== LOAD PRODUCTS TABLE =====
function loadProductsTable() {
    const products = getProducts();

    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.title}" class="product-thumb" 
                     onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            </td>
            <td class="product-name">${product.title}</td>
            <td><span class="category-badge">${formatCategory(product.category)}</span></td>
            <td>
                <strong>₹${product.price}</strong>
                <small style="color:#888; text-decoration: line-through; margin-left: 5px;">₹${product.originalPrice}</small>
            </td>
            <td><span class="discount-badge">${product.discount}% OFF</span></td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="confirmDelete(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== FORMAT CATEGORY =====
function formatCategory(categoryId) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// ===== LOAD CATEGORIES =====
function loadCategories() {
    const categories = getCategories();
    const products = getProducts();
    const container = document.querySelector('.categories-grid');

    if (!container) return;

    let html = `
        <div class="add-category-card">
            <h3>Add New Category</h3>
            <div class="form-group">
                <input type="text" id="newCategoryName" placeholder="Category Name">
            </div>
            <div class="form-group">
                <input type="text" id="newCategoryId" placeholder="ID (e.g., smart-watches)">
            </div>
            <button class="btn btn-primary btn-full" onclick="addCategory()">
                <i class="fas fa-plus"></i> Add Category
            </button>
        </div>
    `;

    categories.forEach(cat => {
        const count = products.filter(p => p.category === cat.id).length;
        // Use data-id attribute for robust deletion identification
        html += `
            <div class="category-stat-card">
                <div class="category-info">
                    <i class="fas fa-tag"></i>
                    <div>
                        <h3>${cat.name}</h3>
                        <p>${count} products</p>
                    </div>
                </div>
                <button class="delete-btn-sm category-delete-btn" data-id="${cat.id}" title="Delete Category">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners to delete buttons
    container.querySelectorAll('.category-delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            deleteCategory(id);
        });
    });
}

// ===== ADD CATEGORY =====
function addCategory() {
    const nameInput = document.getElementById('newCategoryName');
    const idInput = document.getElementById('newCategoryId');
    if (!nameInput || !idInput) return;

    const name = nameInput.value.trim();
    // Strictly sanitize ID: alphanumeric and hyphens only
    let id = idInput.value.trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove everything except alphanumeric, spaces, and hyphens
        .replace(/\s+/g, '-');        // Replace spaces with hyphens

    if (!name) {
        showToast('Please enter a category name');
        return;
    }

    if (!id) {
        id = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    }

    const categories = getCategories();

    if (categories.some(c => c.id === id)) {
        showToast('Category ID already exists');
        return;
    }

    categories.push({ id, name });
    saveCategories(categories);
    showToast('Category added successfully');
    loadCategories();

    // Refresh dropdowns if form is open (optional but good practice)
    populateCategoryDropdown();
}

// ===== DELETE CATEGORY =====
function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category? All products in this category will move to "Uncategorized" in the display.')) {
        const categories = getCategories();
        const newCategories = categories.filter(c => c.id !== id);

        if (categories.length === newCategories.length) {
            console.error('Category with ID not found:', id);
            return;
        }

        saveCategories(newCategories);
        loadCategories();
        showToast('Category deleted');
    }
}

// Make functions global
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;

// ===== HANDLE PRODUCT SUBMIT =====
function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const originalPrice = parseInt(document.getElementById('productOriginalPrice').value);
    const mainImage = document.getElementById('productImage').value;

    // Collect additional images
    const additionalImageInputs = document.querySelectorAll('.additional-image-url');
    const additionalImages = Array.from(additionalImageInputs)
        .map(input => input.value.trim())
        .filter(url => url !== '');

    const images = [mainImage, ...additionalImages];

    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    const products = getProducts();

    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                title,
                category,
                price,
                originalPrice,
                discount,
                image: mainImage, // Keep main image for backward compatibility
                images: images,  // Store all images in an array
                badge: discount + '% OFF'
            };
            showToast('Product updated successfully!');
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            title,
            category,
            price,
            originalPrice,
            discount,
            image: mainImage, // Keep main image for backward compatibility
            images: images,  // Store all images in an array
            badge: discount + '% OFF'
        });
        showToast('Product added successfully!');
    }

    saveProducts(products);
    resetForm();
    showSection('products');
    loadDashboard();
}

// ===== EDIT PRODUCT =====
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productTitle').value = product.title;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice;
        document.getElementById('productImage').value = product.image;

        // Populate additional images
        const container = document.getElementById('additionalImagesContainer');
        container.innerHTML = '';
        if (product.images && product.images.length > 1) {
            // Skip the first image as it's the main one
            for (let i = 1; i < product.images.length; i++) {
                addAdditionalImageInput(product.images[i]);
            }
        }

        document.getElementById('formTitle').textContent = 'Edit Product';

        // Ensure dropdown is populated before setting value
        populateCategoryDropdown();
        document.getElementById('productCategory').value = product.category;

        handleImagePreview();
        showSection('add-product');
    }
}

// ===== POPULATE CATEGORY DROPDOWN =====
function populateCategoryDropdown() {
    const categories = getCategories();
    const select = document.getElementById('productCategory');
    const currentValue = select.value;

    let html = '<option value="">Select Category</option>';
    categories.forEach(cat => {
        html += `<option value="${cat.id}">${cat.name}</option>`;
    });

    select.innerHTML = html;

    // Restore value if it still exists
    if (currentValue && categories.some(c => c.id === currentValue)) {
        select.value = currentValue;
    }
}

// Make editProduct global
window.editProduct = editProduct;

// ===== RESET FORM =====
function resetForm() {
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('additionalImagesContainer').innerHTML = '';
    document.getElementById('imagePreview').innerHTML = `
        <div class="preview-item">
            <i class="fas fa-image"></i>
            <p>Main Image</p>
        </div>
    `;
    populateCategoryDropdown();
}

// Make resetForm global
window.resetForm = resetForm;

// ===== HANDLE IMAGE PREVIEW =====
function handleImagePreview() {
    const mainImageUrl = document.getElementById('productImage').value;
    const additionalImageInputs = document.querySelectorAll('.additional-image-url');
    const preview = document.getElementById('imagePreview');

    let html = '';

    // Main image preview
    if (mainImageUrl) {
        html += `
            <div class="preview-item">
                <img src="${mainImageUrl}" alt="Main Preview" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-exclamation-triangle\\'></i><p>Invalid</p>'">
                <p>Main Image</p>
            </div>
        `;
    } else {
        html += `
            <div class="preview-item">
                <i class="fas fa-image"></i>
                <p>Main Image</p>
            </div>
        `;
    }

    // Additional images previews
    additionalImageInputs.forEach((input, index) => {
        const url = input.value.trim();
        if (url) {
            html += `
                <div class="preview-item">
                    <img src="${url}" alt="Preview ${index + 1}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-exclamation-triangle\\'></i><p>Invalid</p>'">
                    <p>Image ${index + 1}</p>
                </div>
            `;
        } else {
            html += `
                <div class="preview-item">
                    <i class="fas fa-image"></i>
                    <p>Image ${index + 1}</p>
                </div>
            `;
        }
    });

    preview.innerHTML = html;
}

// ===== DELETE PRODUCT =====
let deleteProductId = null;

function confirmDelete(id) {
    deleteProductId = id;
    deleteModal.classList.add('active');
}

// Make confirmDelete global
window.confirmDelete = confirmDelete;

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteProductId = null;
}

// Make closeDeleteModal global
window.closeDeleteModal = closeDeleteModal;

confirmDeleteBtn.addEventListener('click', () => {
    if (deleteProductId) {
        const products = getProducts();
        const filteredProducts = products.filter(p => p.id !== deleteProductId);
        saveProducts(filteredProducts);

        closeDeleteModal();
        loadProductsTable();
        loadDashboard();
        showToast('Product deleted successfully!');
    }
});

// ===== SEARCH PRODUCTS =====
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const products = getProducts();

    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    productsTableBody.innerHTML = filtered.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.title}" class="product-thumb" 
                     onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            </td>
            <td class="product-name">${product.title}</td>
            <td><span class="category-badge">${formatCategory(product.category)}</span></td>
            <td>
                <strong>₹${product.price}</strong>
                <small style="color:#888; text-decoration: line-through; margin-left: 5px;">₹${product.originalPrice}</small>
            </td>
            <td><span class="discount-badge">${product.discount}% OFF</span></td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="confirmDelete(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== SHOW TOAST =====
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

console.log('🔐 Admin Panel Loaded Successfully!');

// ===== MULTI-IMAGE HELPERS =====
function addAdditionalImageInput(value = '') {
    const container = document.getElementById('additionalImagesContainer');
    const div = document.createElement('div');
    div.className = 'image-input-row';
    div.innerHTML = `
        <input type="url" class="additional-image-url" placeholder="https://example.com/image.jpg" value="${value}">
        <button type="button" class="remove-img-btn" onclick="removeAdditionalImageInput(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(div);

    // Add event listener to the new input
    div.querySelector('input').addEventListener('input', handleImagePreview);

    handleImagePreview();
}

function removeAdditionalImageInput(btn) {
    btn.parentElement.remove();
    handleImagePreview();
}

window.addAdditionalImageInput = addAdditionalImageInput;
window.removeAdditionalImageInput = removeAdditionalImageInput;
