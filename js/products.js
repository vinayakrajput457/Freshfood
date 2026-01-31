// Products page functionality

let filteredProducts = [...products];
let currentSort = 'name';

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
});

// Load and display products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    const emptyCart = document.getElementById('emptyCart');

    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => 
            createProductCard(product)
        ).join('');
        productsGrid.style.display = 'grid';
        if (noProducts) noProducts.style.display = 'none';
    }
}

// Setup filter functionality
function setupFilters() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = e.target.value;
        });
    }

    // Check for category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        const checkbox = document.querySelector(`input[value="${categoryParam}"]`);
        if (checkbox) {
            checkbox.checked = true;
            applyFilters();
        }
    }
}

// Apply all filters
function applyFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox input:checked');
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    const maxPrice = parseFloat(document.getElementById('priceRange').value);

    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    // Re-apply current sort
    sortProducts();
    loadProducts();
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sortBy');
    
    if (sortBy) {
        currentSort = sortBy.value;
    }

    switch (currentSort) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }

    loadProducts();
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
        cb.checked = false;
    });
    
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange) {
        priceRange.value = 50;
        priceValue.textContent = 50;
    }

    filteredProducts = [...products];
    loadProducts();
}

// Search functionality
function searchProducts(query) {
    if (!query) {
        applyFilters();
        return;
    }

    const lowerQuery = query.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );

    loadProducts();
}

// Toggle filters sidebar on mobile
function toggleFiltersSidebar() {
    const sidebar = document.querySelector('.filters-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Add search bar to products page
function setupSearchBar() {
    const productsMain = document.querySelector('.products-main');
    if (!productsMain) return;

    const searchBar = document.createElement('div');
    searchBar.style.cssText = `
        margin-bottom: 25px;
        display: flex;
        gap: 10px;
    `;
    
    searchBar.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search products..." 
               style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px;">
        <button class="btn btn-primary" onclick="searchProducts(document.getElementById('searchInput').value)">
            <i class="fas fa-search"></i> Search
        </button>
        <button class="btn btn-secondary" onclick="toggleFiltersSidebar(); alert('Filters toggled on mobile');">
            <i class="fas fa-filter"></i> Filters
        </button>
    `;

    productsMain.insertBefore(searchBar, productsMain.firstChild);

    // Add Enter key support
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(e.target.value);
        }
    });
}

// Initialize search bar if on products page
if (window.location.pathname.includes('products.html')) {
    setTimeout(() => {
        setupSearchBar();
    }, 100);
}

// Product comparison feature
function compareProducts() {
    const cart = StorageManager.getCart();
    if (cart.length === 0) {
        alert('Add products to compare');
        return;
    }

    let comparison = 'Product Comparison:\n\n';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            comparison += `${product.name}\n`;
            comparison += `Price: ${formatCurrency(product.price)}\n`;
            comparison += `Category: ${product.category}\n`;
            comparison += `Rating: ${product.rating}/5 (${product.reviews} reviews)\n`;
            comparison += `---\n`;
        }
    });

    alert(comparison);
}
