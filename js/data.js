// Sample product data
const products = [
    {
        id: 1,
        name: "Classic Margherita Pizza",
        category: "Pizza",
        price: 12.99,
        originalPrice: 14.99,
        image: "https://via.placeholder.com/300x200?text=Margherita+Pizza",
        description: "Fresh mozzarella, basil, and tomato sauce on crispy crust",
        rating: 4.8,
        reviews: 256,
        popular: true
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burgers",
        price: 10.99,
        originalPrice: 12.99,
        image: "https://via.placeholder.com/300x200?text=Cheese+Burger",
        description: "Juicy beef patty with melted cheese and fresh toppings",
        rating: 4.6,
        reviews: 189,
        popular: false
    },
    {
        id: 3,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 8.99,
        originalPrice: 10.99,
        image: "https://via.placeholder.com/300x200?text=Chocolate+Cake",
        description: "Rich and moist chocolate cake with cream frosting",
        rating: 4.9,
        reviews: 312,
        popular: true
    },
    {
        id: 4,
        name: "Iced Cola",
        category: "Beverages",
        price: 2.99,
        originalPrice: 3.99,
        image: "https://via.placeholder.com/300x200?text=Iced+Cola",
        description: "Refreshing cold cola drink",
        rating: 4.5,
        reviews: 78,
        popular: false
    },
    {
        id: 5,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 14.99,
        originalPrice: 16.99,
        image: "https://via.placeholder.com/300x200?text=Pepperoni+Pizza",
        description: "Spicy pepperoni with cheese on our special pizza base",
        rating: 4.7,
        reviews: 201,
        popular: true
    },
    {
        id: 6,
        name: "Bacon Burger",
        category: "Burgers",
        price: 13.99,
        originalPrice: 15.99,
        image: "https://via.placeholder.com/300x200?text=Bacon+Burger",
        description: "Double patty with crispy bacon and special sauce",
        rating: 4.8,
        reviews: 245,
        popular: false
    },
    {
        id: 7,
        name: "Strawberry Cheesecake",
        category: "Desserts",
        price: 9.99,
        originalPrice: 11.99,
        image: "https://via.placeholder.com/300x200?text=Strawberry+Cheesecake",
        description: "Creamy cheesecake with fresh strawberries",
        rating: 4.9,
        reviews: 289,
        popular: true
    },
    {
        id: 8,
        name: "Fresh Orange Juice",
        category: "Beverages",
        price: 4.99,
        originalPrice: 5.99,
        image: "https://via.placeholder.com/300x200?text=Orange+Juice",
        description: "100% pure fresh orange juice",
        rating: 4.6,
        reviews: 134,
        popular: false
    },
    {
        id: 9,
        name: "Vegetarian Pizza",
        category: "Pizza",
        price: 11.99,
        originalPrice: 13.99,
        image: "https://via.placeholder.com/300x200?text=Veggie+Pizza",
        description: "Fresh vegetables with mozzarella on thin crust",
        rating: 4.5,
        reviews: 167,
        popular: false
    },
    {
        id: 10,
        name: "Classic Burger",
        category: "Burgers",
        price: 9.99,
        originalPrice: 11.99,
        image: "https://via.placeholder.com/300x200?text=Classic+Burger",
        description: "Simple, delicious, and satisfying",
        rating: 4.4,
        reviews: 156,
        popular: false
    },
    {
        id: 11,
        name: "Vanilla Ice Cream",
        category: "Desserts",
        price: 5.99,
        originalPrice: 7.99,
        image: "https://via.placeholder.com/300x200?text=Vanilla+Ice+Cream",
        description: "Smooth and creamy vanilla ice cream",
        rating: 4.7,
        reviews: 223,
        popular: false
    },
    {
        id: 12,
        name: "Iced Coffee",
        category: "Beverages",
        price: 3.99,
        originalPrice: 4.99,
        image: "https://via.placeholder.com/300x200?text=Iced+Coffee",
        description: "Cold brew coffee with ice and cream",
        rating: 4.8,
        reviews: 198,
        popular: true
    }
];

// Promo codes
const promoCodes = {
    'SAVE10': { discount: 10, type: 'percentage' },
    'SAVE5': { discount: 5, type: 'flat' },
    'FREEDELIVER': { discount: 3.99, type: 'delivery' },
    'WELCOME': { discount: 15, type: 'percentage' }
};

// Function to format currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

// Function to generate stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="stars">★</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="stars">☆</span>';
    }
    
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        stars += '<span style="color: #ddd;">★</span>';
    }
    
    return stars;
}

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.popular ? '<span class="product-badge">Popular</span>' : ''}
                ${product.originalPrice > product.price ? '<span class="product-badge" style="left: auto; right: 10px; background: #4CAF50;">-' + Math.round((1 - product.price/product.originalPrice) * 100) + '%</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="product-card-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Local Storage Management
class StorageManager {
    static getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    }

    static saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    static getAllUsers() {
        const users = localStorage.getItem('allUsers');
        return users ? JSON.parse(users) : [];
    }

    static saveAllUsers(users) {
        localStorage.setItem('allUsers', JSON.stringify(users));
    }
}
