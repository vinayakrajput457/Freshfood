// Authentication and User Management

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    updateCartCount();
    setupUserMenuToggle();
    setupMobileMenu();
});

// Update navigation based on login status
function updateNavigation() {
    const user = StorageManager.getUser();
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const profileLink = document.getElementById('profileLink');
    const ordersLink = document.getElementById('ordersLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');

    if (user) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'block';
        if (ordersLink) ordersLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block';

        // Show admin link if user is admin
        if (adminLink) {
            adminLink.style.display = user.email === 'admin@freshfood.com' ? 'block' : 'none';
        }

        // Add click handlers
        if (profileLink) profileLink.onclick = (e) => {
            e.preventDefault();
            showProfile();
        };
        if (ordersLink) ordersLink.onclick = (e) => {
            e.preventDefault();
            showOrders();
        };
        if (logoutLink) logoutLink.onclick = (e) => {
            e.preventDefault();
            handleLogout();
        };
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (ordersLink) ordersLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }

    // Check if user exists
    const users = StorageManager.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    if (user.password !== password) {
        showNotification('Invalid password', 'error');
        return;
    }

    // Login successful
    StorageManager.saveUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        loginTime: new Date().toISOString()
    });

    showNotification('Login successful!', 'success');
    
    // Redirect after 1 second
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!fullname || !email || !phone || !address || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Check if user already exists
    const users = StorageManager.getAllUsers();
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: fullname,
        email: email,
        phone: phone,
        address: address,
        password: password,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    StorageManager.saveAllUsers(users);

    // Auto login
    StorageManager.saveUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        loginTime: new Date().toISOString()
    });

    showNotification('Account created successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Show Profile
function showProfile() {
    const user = StorageManager.getUser();
    if (user) {
        alert(`Profile Information:\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nAddress: ${user.address}`);
    }
}

// Show Orders
function showOrders() {
    const user = StorageManager.getUser();
    if (!user) {
        showNotification('Please login first', 'error');
        return;
    }

    const orders = StorageManager.getOrders();
    const userOrders = orders.filter(o => o.userId === user.id);

    if (userOrders.length === 0) {
        alert('You have no orders yet.');
        return;
    }

    let ordersList = 'Your Orders:\n\n';
    userOrders.forEach((order, index) => {
        ordersList += `Order ${index + 1}:\n`;
        ordersList += `ID: ${order.id}\n`;
        ordersList += `Date: ${new Date(order.date).toLocaleDateString()}\n`;
        ordersList += `Total: ${formatCurrency(order.total)}\n`;
        ordersList += `Status: ${order.status}\n\n`;
    });

    alert(ordersList);
}

// Setup user menu toggle
function setupUserMenuToggle() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Cart management
function updateCartCount() {
    const cart = StorageManager.getCart();
    const cartCounts = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = StorageManager.getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    StorageManager.saveCart(cart);
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    let cart = StorageManager.getCart();
    cart = cart.filter(item => item.id !== productId);
    StorageManager.saveCart(cart);
    updateCartCount();
    
    if (typeof loadCart === 'function') {
        loadCart();
    }
    if (typeof updateOrderSummary === 'function') {
        updateOrderSummary();
    }
}

function updateCartItemQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const cart = StorageManager.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = parseInt(quantity);
        StorageManager.saveCart(cart);
        updateCartCount();
        
        if (typeof loadCart === 'function') {
            loadCart();
        }
        if (typeof updateOrderSummary === 'function') {
            updateOrderSummary();
        }
    }
}

// Modal functions
let currentProductId = null;

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;

    const modal = document.getElementById('productModal');
    if (!modal) return;

    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalRating').innerHTML = generateStars(product.rating);
    document.getElementById('modalReviews').textContent = `(${product.reviews} reviews)`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalQty').value = 1;

    modal.classList.add('show');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function increaseQty() {
    const input = document.getElementById('modalQty');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('modalQty');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('modalQty').value);
    const product = products.find(p => p.id === currentProductId);

    if (!product) return;

    const cart = StorageManager.getCart();
    const existingItem = cart.find(item => item.id === currentProductId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    StorageManager.saveCart(cart);
    updateCartCount();
    closeProductModal();
    showNotification(`${product.name} (x${quantity}) added to cart!`, 'success');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (modal && e.target === modal) {
        closeProductModal();
    }
});

// Initialize sample users for demo (only on first visit)
if (!localStorage.getItem('initialized')) {
    const sampleUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-1234',
            address: '123 Main St, City, State',
            password: 'password123'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-5678',
            address: '456 Oak Ave, City, State',
            password: 'password456'
        }
    ];
    
    StorageManager.saveAllUsers(sampleUsers);
    localStorage.setItem('initialized', 'true');
}
