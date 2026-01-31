// Shopping Cart functionality

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    setupEventListeners();
});

// Load cart items
function loadCart() {
    const cart = StorageManager.getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => createCartItem(item)).join('');
        cartItemsContainer.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        // Add event listeners to quantity inputs
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', function() {
                updateCartItemQuantity(this.dataset.productId, this.value);
            });
        });

        // Add event listeners to quantity buttons
        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                updateCartItemQuantity(input.dataset.productId, Math.max(1, parseInt(input.value) - 1));
            });
        });

        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                updateCartItemQuantity(input.dataset.productId, parseInt(input.value) + 1);
            });
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Remove this item from cart?')) {
                    removeFromCart(parseInt(this.dataset.productId));
                }
            });
        });

        updateCartSummary();
    }
}

// Create cart item HTML
function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
            <div class="cart-item-quantity">
                <button class="qty-decrease">-</button>
                <input type="number" value="${item.quantity}" min="1" data-product-id="${item.id}" readonly>
                <button class="qty-increase">+</button>
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Update cart summary
function updateCartSummary() {
    const cart = StorageManager.getCart();
    const DELIVERY_FEE = 3.99;
    const TAX_RATE = 0.08;

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    // Update summary display
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    // Store for checkout
    sessionStorage.setItem('cartSummary', JSON.stringify({
        subtotal,
        deliveryFee: DELIVERY_FEE,
        tax,
        total,
        items: cart
    }));
}

// Setup event listeners
function setupEventListeners() {
    const promoBtn = document.querySelector('.promo-code button');
    if (promoBtn) {
        promoBtn.addEventListener('click', applyPromoCode);
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;

    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showNotification('Please enter a promo code', 'warning');
        return;
    }

    const promo = promoCodes[code];

    if (!promo) {
        showNotification('Invalid promo code', 'error');
        promoInput.value = '';
        return;
    }

    const cart = StorageManager.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let DELIVERY_FEE = 3.99;

    if (promo.type === 'percentage') {
        discount = (subtotal * promo.discount) / 100;
    } else if (promo.type === 'flat') {
        discount = promo.discount;
    } else if (promo.type === 'delivery') {
        DELIVERY_FEE = 0;
        discount = promo.discount;
    }

    const TAX_RATE = 0.08;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + DELIVERY_FEE + tax;

    // Update display
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const deliveryEl = document.getElementById('deliveryFee');

    if (subtotalEl) {
        subtotalEl.innerHTML = `<span style="text-decoration: line-through; color: var(--gray-color);">${formatCurrency(subtotal)}</span> ${formatCurrency(discountedSubtotal)}`;
    }
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (deliveryEl) {
        deliveryEl.innerHTML = `<span style="text-decoration: line-through; color: var(--gray-color);">$3.99</span> ${formatCurrency(DELIVERY_FEE)}`;
    }

    // Store promo info
    sessionStorage.setItem('promoCode', code);
    sessionStorage.setItem('discount', discount);
    sessionStorage.setItem('deliveryFee', DELIVERY_FEE);

    showNotification(`Promo code applied! You saved ${formatCurrency(discount)}`, 'success');
    promoInput.value = '';
    promoInput.disabled = true;
}

// Proceed to checkout
function proceedToCheckout() {
    const user = StorageManager.getUser();
    
    if (!user) {
        showNotification('Please login to proceed', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }

    const cart = StorageManager.getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    window.location.href = 'checkout.html';
}

// Continue shopping
function continueShopping() {
    window.location.href = 'products.html';
}
