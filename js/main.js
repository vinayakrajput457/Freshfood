// Main application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    setupEventListeners();
});

// Load featured products on home page
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;

    // Get popular products
    const featured = products.filter(p => p.popular).slice(0, 6);

    featuredProductsContainer.innerHTML = featured.map(product => 
        createProductCard(product)
    ).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Filter products by category
function filterByCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

// Scroll to top button functionality
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Create scroll to top button
function createScrollTopButton() {
    if (!document.getElementById('scrollTop')) {
        const btn = document.createElement('button');
        btn.id = 'scrollTop';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            display: none;
            z-index: 99;
            transition: all 0.3s ease;
        `;
        btn.onmouseover = function() {
            this.style.backgroundColor = '#e55a2b';
            this.style.transform = 'scale(1.1)';
        };
        btn.onmouseout = function() {
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.transform = 'scale(1)';
        };
        btn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        document.body.appendChild(btn);
    }
}

createScrollTopButton();
