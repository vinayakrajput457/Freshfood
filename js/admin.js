// Admin Dashboard Functionality

const ADMIN_CREDENTIALS = {
    email: 'admin@freshfood.com',
    password: 'admin123'
};

let adminLoggedIn = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminSession();
    loadSettingsForm();
});

// Load settings form with current values
function loadSettingsForm() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || {
        deliveryFee: 50,
        taxRate: 5,
        businessName: 'FreshFood',
        contactEmail: 'support@freshfood.com',
        contactPhone: '+1-234-567-8900'
    };

    document.getElementById('deliveryFee').value = settings.deliveryFee;
    document.getElementById('taxRate').value = settings.taxRate;
    document.getElementById('businessName').value = settings.businessName;
    document.getElementById('contactEmail').value = settings.contactEmail;
    document.getElementById('contactPhone').value = settings.contactPhone;
}

// Check if admin is already logged in
function checkAdminSession() {
    const adminSession = sessionStorage.getItem('adminSession');
    
    if (adminSession) {
        adminLoggedIn = true;
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

// Show admin login
function showAdminLogin() {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadDashboardData();
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    // Validate credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        showNotification('Invalid admin credentials', 'error');
        return;
    }

    // Set admin session
    sessionStorage.setItem('adminSession', JSON.stringify({
        email: email,
        loginTime: new Date().toISOString()
    }));

    adminLoggedIn = true;
    showAdminDashboard();
    showNotification('Admin login successful!', 'success');
}

// Logout admin
function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminSession');
        adminLoggedIn = false;
        document.getElementById('adminLoginForm').reset();
        showAdminLogin();
        showNotification('Logged out successfully', 'success');
    }
}

// Show dashboard section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked link
    event.target.closest('a').classList.add('active');

    // Load section-specific data
    if (sectionId === 'products') {
        loadProductsList();
    } else if (sectionId === 'orders') {
        loadOrdersList();
    } else if (sectionId === 'users') {
        loadUsersList();
    }
}

// Load dashboard data
function loadDashboardData() {
    const allProducts = products;
    const allOrders = StorageManager.getOrders();
    const allUsers = StorageManager.getAllUsers();

    // Update stats
    document.getElementById('totalProducts').textContent = allProducts.length;
    document.getElementById('totalOrders').textContent = allOrders.length;
    document.getElementById('totalUsers').textContent = allUsers.length;

    // Calculate total revenue
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

    // Load recent orders
    loadRecentOrders();
}

// Load recent orders
function loadRecentOrders() {
    const orders = StorageManager.getOrders().sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    ).slice(0, 5);

    const recentOrdersList = document.getElementById('recentOrdersList');
    recentOrdersList.innerHTML = orders.length === 0 
        ? '<tr><td colspan="6" style="text-align: center; padding: 20px;">No orders yet</td></tr>'
        : orders.map(order => {
            const user = StorageManager.getAllUsers().find(u => u.id === order.userId);
            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${user?.name || 'Unknown'}</td>
                    <td>${formatCurrency(order.total)}</td>
                    <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewOrderDetails('${order.id}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
}

// Load products list
function loadProductsList() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.rating} ⭐</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle add product
function handleAddProduct(e) {
    e.preventDefault();

    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value),
        image: 'https://via.placeholder.com/300x200?text=' + document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        rating: parseFloat(document.getElementById('productRating').value),
        reviews: 0,
        popular: document.getElementById('productPopular').checked
    };

    products.push(newProduct);
    document.getElementById('addProductForm').reset();
    loadProductsList();
    showNotification('Product added successfully!', 'success');
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productPopular').checked = product.popular;

        // Change form submit to update
        document.getElementById('addProductForm').onsubmit = (e) => {
            e.preventDefault();
            product.name = document.getElementById('productName').value;
            product.category = document.getElementById('productCategory').value;
            product.price = parseFloat(document.getElementById('productPrice').value);
            product.originalPrice = parseFloat(document.getElementById('productOriginalPrice').value);
            product.description = document.getElementById('productDescription').value;
            product.rating = parseFloat(document.getElementById('productRating').value);
            product.popular = document.getElementById('productPopular').checked;

            document.getElementById('addProductForm').onsubmit = handleAddProduct;
            document.getElementById('addProductForm').reset();
            loadProductsList();
            showNotification('Product updated successfully!', 'success');
        };
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index > -1) {
            products.splice(index, 1);
            loadProductsList();
            showNotification('Product deleted successfully!', 'success');
        }
    }
}

// Load orders list
function loadOrdersList() {
    const orders = StorageManager.getOrders().sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = orders.length === 0
        ? '<tr><td colspan="8" style="text-align: center; padding: 20px;">No orders yet</td></tr>'
        : orders.map(order => {
            const user = StorageManager.getAllUsers().find(u => u.id === order.userId);
            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${user?.name || 'Unknown'}</td>
                    <td>${user?.email || 'N/A'}</td>
                    <td>${order.items.length}</td>
                    <td>${formatCurrency(order.total)}</td>
                    <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewOrderDetails('${order.id}')">View</button>
                        <button class="action-btn btn-edit" onclick="updateOrderStatus('${order.id}')">Update</button>
                    </td>
                </tr>
            `;
        }).join('');
}

// Load users list
function loadUsersList() {
    const users = StorageManager.getAllUsers();
    const orders = StorageManager.getOrders();

    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.length === 0
        ? '<tr><td colspan="6" style="text-align: center; padding: 20px;">No users yet</td></tr>'
        : users.map(user => {
            const userOrders = orders.filter(o => o.userId === user.id);
            return `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${userOrders.length}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewUserDetails(${user.id})">View</button>
                        <button class="action-btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
}

// View order details
function viewOrderDetails(orderId) {
    const order = StorageManager.getOrders().find(o => o.id === orderId);
    const user = StorageManager.getAllUsers().find(u => u.id === order.userId);

    if (!order) return;

    let itemsHTML = order.items.map(item => `
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
            <strong>${item.name}</strong> x${item.quantity}
            <div style="color: var(--gray-color); font-size: 14px;">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');

    const modalBody = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">Order Information</h4>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
        </div>

        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">Customer Information</h4>
            <p><strong>Name:</strong> ${user?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${user?.phone || 'N/A'}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">Delivery Address</h4>
            <p>${order.deliveryInfo.address}</p>
            <p>${order.deliveryInfo.city}, ${order.deliveryInfo.state} ${order.deliveryInfo.zip}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">Order Items</h4>
            ${itemsHTML}
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: var(--light-color); border-radius: 8px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <strong>${formatCurrency(order.subtotal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Delivery:</span>
                <strong>${formatCurrency(order.deliveryFee)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax:</span>
                <strong>${formatCurrency(order.tax)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 2px solid var(--border-color); padding-top: 10px; margin-top: 10px;">
                <strong>Total:</strong>
                <strong style="color: var(--primary-color); font-size: 18px;">${formatCurrency(order.total)}</strong>
            </div>
        </div>

        <button class="btn btn-primary" onclick="closeOrderModal(); updateOrderStatus('${order.id}')">Update Status</button>
    `;

    document.getElementById('orderModalBody').innerHTML = modalBody;
    document.getElementById('orderModal').classList.add('show');
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

// Update order status
function updateOrderStatus(orderId) {
    const order = StorageManager.getOrders().find(o => o.id === orderId);
    if (!order) return;

    const newStatus = prompt('Update order status:\n1. Confirmed\n2. Pending\n3. Delivered\n\nEnter 1, 2, or 3:', order.status);
    
    if (newStatus) {
        const statusMap = { '1': 'Confirmed', '2': 'Pending', '3': 'Delivered' };
        if (statusMap[newStatus]) {
            order.status = statusMap[newStatus];
            loadOrdersList();
            closeOrderModal();
            showNotification('Order status updated!', 'success');
        }
    }
}

// View user details
function viewUserDetails(userId) {
    const user = StorageManager.getAllUsers().find(u => u.id === userId);
    const orders = StorageManager.getOrders().filter(o => o.userId === userId);

    if (user) {
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nAddress: ${user.address}\n\nTotal Orders: ${orders.length}\nTotal Spent: ${formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}`);
    }
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This will also remove their orders.')) {
        let users = StorageManager.getAllUsers();
        users = users.filter(u => u.id !== userId);
        StorageManager.saveAllUsers(users);

        let orders = StorageManager.getOrders();
        orders = orders.filter(o => o.userId !== userId);
        StorageManager.saveOrders(orders);

        loadUsersList();
        showNotification('User deleted successfully!', 'success');
    }
}

// Save settings
function saveSettings() {
    const settings = {
        deliveryFee: parseFloat(document.getElementById('deliveryFee').value),
        taxRate: parseFloat(document.getElementById('taxRate').value),
        businessName: document.getElementById('businessName').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value
    };

    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
}

// Export admin data
function exportAdminData() {
    const adminData = {
        products: products,
        orders: StorageManager.getOrders(),
        users: StorageManager.getAllUsers(),
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(adminData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freshfood-admin-backup-${new Date().getTime()}.json`;
    link.click();

    showNotification('Data exported successfully!', 'success');
}

// Reset all data
function resetAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL data including products, orders, and users!\n\nAre you absolutely sure?')) {
        if (confirm('Click OK to confirm deletion of all data.')) {
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        }
    }
}

// Protect admin page
function ensureAdminAuth() {
    if (!adminLoggedIn && !sessionStorage.getItem('adminSession')) {
        window.location.href = 'index.html';
    }
}

ensureAdminAuth();
