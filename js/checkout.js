// Checkout functionality

let currentStep = 1;
const TOTAL_STEPS = 3;

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    setupPaymentMethodToggle();
    setupDeliveryTimeToggle();
    setupCardFormatting();
});

// Initialize checkout
function initializeCheckout() {
    const user = StorageManager.getUser();
    const cart = StorageManager.getCart();

    if (!user || cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Pre-fill user information
    document.getElementById('firstName').value = user.name.split(' ')[0] || '';
    document.getElementById('lastName').value = user.name.split(' ').slice(1).join(' ') || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';

    updateOrderSummary();
}

// Update order summary in sidebar
function updateOrderSummary() {
    const cart = StorageManager.getCart();
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDelivery = document.getElementById('summaryDelivery');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');

    if (!summaryItems) return;

    // Display items
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item-mini">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // Calculate totals
    const DELIVERY_FEE = 3.99;
    const TAX_RATE = 0.08;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    // Update display
    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(subtotal);
    if (summaryDelivery) summaryDelivery.textContent = formatCurrency(DELIVERY_FEE);
    if (summaryTax) summaryTax.textContent = formatCurrency(tax);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
    const radioButtons = document.querySelectorAll('input[name="paymentMethod"]');
    const cardPaymentDiv = document.getElementById('cardPayment');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const parent = this.closest('.payment-option');
            
            // Remove active class from all
            document.querySelectorAll('.payment-option').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to current
            if (parent) {
                parent.classList.add('active');
            }

            // Show/hide card payment fields
            if (cardPaymentDiv) {
                cardPaymentDiv.style.display = this.value === 'card' ? 'block' : 'none';
            }
        });
    });

    // Set initial state
    if (cardPaymentDiv) {
        cardPaymentDiv.style.display = 'block';
    }
}

// Setup delivery time toggle
function setupDeliveryTimeToggle() {
    const radioButtons = document.querySelectorAll('input[name="deliveryTime"]');
    const scheduledTimeInput = document.getElementById('scheduledTime');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (scheduledTimeInput) {
                scheduledTimeInput.style.display = this.value === 'scheduled' ? 'block' : 'none';
            }
        });
    });
}

// Setup card formatting
function setupCardFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// Move to next step
function nextStep() {
    if (currentStep === 1) {
        if (!validateDeliveryInfo()) return;
    } else if (currentStep === 2) {
        if (!validatePaymentInfo()) return;
    }

    currentStep++;
    if (currentStep > TOTAL_STEPS) currentStep = TOTAL_STEPS;

    updateStepDisplay();

    if (currentStep === 3) {
        updateReviewDisplay();
    }
}

// Move to previous step
function previousStep() {
    currentStep--;
    if (currentStep < 1) currentStep = 1;

    updateStepDisplay();
}

// Update step display
function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update step content
    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const stepEl = document.getElementById(`step${i}`);
        if (stepEl) {
            if (i === currentStep) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate delivery information
function validateDeliveryInfo() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zip = document.getElementById('zip').value.trim();

    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
        showNotification('Please fill in all delivery fields', 'error');
        return false;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }

    return true;
}

// Validate payment information
function validatePaymentInfo() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (paymentMethod === 'card') {
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardName || !cardNumber || !expiry || !cvv) {
            showNotification('Please fill in all card details', 'error');
            return false;
        }

        if (cardNumber.length !== 16) {
            showNotification('Card number must be 16 digits', 'error');
            return false;
        }

        if (cvv.length !== 3) {
            showNotification('CVV must be 3 digits', 'error');
            return false;
        }
    }

    return true;
}

// Update review display
function updateReviewDisplay() {
    // Delivery details
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const instructions = document.getElementById('instructions').value;
    const deliveryTime = document.querySelector('input[name="deliveryTime"]:checked').value;

    const reviewDelivery = document.getElementById('reviewDelivery');
    if (reviewDelivery) {
        reviewDelivery.innerHTML = `
            <p><strong>${firstName} ${lastName}</strong></p>
            <p>${address}, ${city}, ${state} ${zip}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Delivery: ${deliveryTime === 'asap' ? 'ASAP (30-45 mins)' : document.getElementById('scheduledTime').value}</p>
            ${instructions ? `<p>Instructions: ${instructions}</p>` : ''}
        `;
    }

    // Payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const reviewPayment = document.getElementById('reviewPayment');
    if (reviewPayment) {
        let paymentDisplay = '';
        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
            paymentDisplay = `<p>Credit Card ending in ${lastFour}</p>`;
        } else if (paymentMethod === 'paypal') {
            paymentDisplay = `<p>PayPal</p>`;
        } else if (paymentMethod === 'wallet') {
            paymentDisplay = `<p>Digital Wallet</p>`;
        } else if (paymentMethod === 'cod') {
            paymentDisplay = `<p>Cash on Delivery</p>`;
        }
        reviewPayment.innerHTML = paymentDisplay;
    }

    // Order items
    const cart = StorageManager.getCart();
    const reviewItems = document.getElementById('reviewItems');
    if (reviewItems) {
        reviewItems.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }
}

// Place order
function placeOrder() {
    const user = StorageManager.getUser();
    const cart = StorageManager.getCart();

    if (!user || cart.length === 0) {
        showNotification('Something went wrong', 'error');
        return;
    }

    // Create order
    const DELIVERY_FEE = 3.99;
    const TAX_RATE = 0.08;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    const order = {
        id: 'ORD-' + Date.now(),
        userId: user.id,
        items: cart,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        tax,
        total,
        deliveryInfo: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            instructions: document.getElementById('instructions').value,
            deliveryTime: document.querySelector('input[name="deliveryTime"]:checked').value
        },
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        date: new Date().toISOString(),
        status: 'Confirmed'
    };

    // Save order
    const orders = StorageManager.getOrders();
    orders.push(order);
    StorageManager.saveOrders(orders);

    // Clear cart
    StorageManager.saveCart([]);
    updateCartCount();

    showNotification('Order placed successfully!', 'success');

    // Show order confirmation modal
    setTimeout(() => {
        alert(`Order Confirmation\n\nOrder ID: ${order.id}\nTotal: ${formatCurrency(total)}\n\nThank you for your order! Your food will be delivered soon.`);
        window.location.href = 'index.html';
    }, 1000);
}
