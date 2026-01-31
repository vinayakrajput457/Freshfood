# Admin Dashboard Guide

## Quick Start

### Admin Login Credentials
- **Email:** `admin@freshfood.com`
- **Password:** `admin123`

### Access Admin Panel
1. From any page, click the user icon in the top-right
2. If logged in as admin, you'll see **"Admin Panel"** option
3. Click to access the admin dashboard

Alternatively, navigate directly to `admin.html`

---

## Admin Dashboard Features

### 1. **Dashboard (Home)**
View real-time business statistics:
- **Total Products:** Number of items in catalog
- **Total Orders:** All orders placed
- **Total Users:** Registered customers
- **Total Revenue:** Total earnings from orders

View recent orders with quick actions to view details or update status.

---

### 2. **Products Management**
Manage your food product catalog.

#### Add New Product
Fill the "Add Product" form with:
- **Product Name:** Name of the food item
- **Category:** Select from available categories
  - Appetizers
  - Main Course
  - Desserts
  - Beverages
  - Specials
- **Price:** Current selling price
- **Original Price:** Original/regular price (for discounts)
- **Description:** Product details and ingredients
- **Rating:** Product rating (1-5 stars)
- **Mark as Popular:** Checkbox to feature on homepage

Click **"Add Product"** to save.

#### Edit Product
1. Click **"Edit"** button next to any product in the table
2. Form fields will populate with current data
3. Make your changes
4. Click **"Add Product"** to save updates

#### Delete Product
1. Click **"Delete"** button next to any product
2. Confirm deletion when prompted
3. Product will be removed from catalog

---

### 3. **Orders Management**
Track and manage all customer orders.

#### View All Orders
See complete order history with:
- Order ID
- Customer name and email
- Number of items
- Total amount
- Current status (Confirmed, Pending, Delivered)
- Order date

#### View Order Details
Click **"View"** button to see:
- Order and customer information
- Complete delivery address
- Itemized product list with quantities
- Order summary (subtotal, delivery, tax, total)

#### Update Order Status
1. Click **"Update"** button next to an order
2. Select new status:
   - **Confirmed:** Order accepted and being prepared
   - **Pending:** Order received, processing
   - **Delivered:** Order delivered to customer
3. Status updates immediately

---

### 4. **Users Management**
Manage customer accounts.

#### View User List
See all registered users with:
- User ID
- Full name
- Email address
- Phone number
- Total orders placed
- Action buttons

#### View User Details
Click **"View"** to see:
- Complete user information
- Address details
- Total orders placed
- Total amount spent

#### Delete User
1. Click **"Delete"** next to a user
2. User account and all their orders will be removed
3. Confirm when prompted

---

### 5. **Settings**
Configure system-wide settings.

#### System Configuration
Adjust business parameters:
- **Delivery Fee:** Shipping cost in rupees
- **Tax Rate:** Percentage of tax applied to orders
- **Business Name:** Your restaurant name
- **Contact Email:** Customer support email
- **Contact Phone:** Customer support phone number

Click **"Save Settings"** to apply changes.

#### Data Management
- **Export Data:** Download all business data as JSON backup file
  - Includes: Products, Orders, Users
  - Saves with timestamp for version control
  - Use for backup or migration
- **Reset All Data:** Clear entire database
  - ⚠️ WARNING: Irreversible action
  - Deletes all products, orders, and users
  - Use only for complete restart

---

## Common Tasks

### Adding a New Food Item
1. Go to **Products** section
2. Fill in product details in the form
3. Click **"Add Product"** button
4. New item appears in products table

### Tracking a Customer Order
1. Go to **Orders** section
2. Find customer's order in the table
3. Click **"View"** to see full details including:
   - Items ordered
   - Delivery address
   - Total paid
4. Click **"Update"** to change order status

### Adjusting Delivery Charges
1. Go to **Settings** section
2. Change **Delivery Fee** value
3. Click **"Save Settings"**
4. Applies to all future orders

### Viewing Customer Profile
1. Go to **Users** section
2. Click **"View"** next to customer name
3. See their information and order history

---

## Session Management

### Staying Logged In
- Admin sessions persist during your browser session
- Closing the browser ends the session
- Reopening admin.html will require re-login

### Logging Out
1. Click sidebar **"Logout"** option
2. Confirm logout when prompted
3. Returns to admin login screen

---

## Tips & Best Practices

✓ **Backup Regularly:** Export data weekly for safety  
✓ **Update Orders:** Keep order statuses current for customer satisfaction  
✓ **Monitor Metrics:** Check dashboard daily for sales trends  
✓ **Manage Inventory:** Add/remove products based on availability  
✓ **Review Settings:** Adjust delivery fee and tax rates as needed  

---

## Troubleshooting

### Forgot Admin Password?
Contact system administrator or reset database and reconfigure admin credentials.

### Data Not Saving?
- Ensure browser allows LocalStorage
- Check browser storage isn't full
- Try clearing browser cache

### Can't Access Admin Panel?
- Ensure you're logged in with admin email
- Admin email must be: `admin@freshfood.com`
- Try logging out and logging in again

### Orders Not Showing?
- Check if orders were placed and completed checkout
- Try refreshing the page
- Export data to verify orders exist in database

---

## Demo Features

The admin dashboard comes pre-configured with demo data:
- 12 sample food products
- Sample customer accounts
- Sample orders (if any were placed)
- Default settings (delivery fee: ₹50, tax: 5%)

Feel free to modify, add, or delete this demo data!

---

**Version:** 1.0  
**Last Updated:** 2024  
**Support:** admin@freshfood.com
