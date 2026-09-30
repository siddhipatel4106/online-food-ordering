# 🍕 QuickBite - Online Food Ordering Website

A simple and elegant online food ordering website built with **HTML, CSS, JavaScript, PHP, and MySQL**. Customers can register, browse food categories, add items to cart, and place orders with multiple payment options.

---

## ✨ Features

- 🔐 **User Authentication** - Register and login system with secure password hashing
- 🍽️ **Food Categories** - Browse Indian, Mexican, Italian, Chinese, and Beverages
- 🛒 **Shopping Cart** - Add, update quantity, and remove items
- 💳 **Multiple Payment Methods** - Cash on Delivery, Card, and UPI
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 💰 **Indian Currency (₹)** - Prices displayed in rupees with GST calculation
- 🎨 **Modern UI** - Clean and attractive interface
- ⚡ **AJAX Powered** - Smooth, no-reload experience
- 🚚 **Estimated Delivery Time** - Shows 20-30 minutes delivery estimate

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure |
| **CSS3** | Styling & Responsive Design |
| **JavaScript (ES6+)** | Client-side interactivity |
| **PHP 7+** | Server-side logic |
| **MySQL** | Database |
| **AJAX/Fetch API** | Asynchronous requests |
| **LocalStorage** | Cart persistence |

---

## 📁 Folder Structure

```
online-food-ordering/
│
├── index.html              # Homepage with categories & popular items
├── menu.html               # Full menu with category filters
├── cart.html               # Shopping cart
├── checkout.html           # Checkout & payment
├── order_success.html      # Order confirmation page
├── login.html              # User login
├── register.html           # User registration
│
├── css/
│   └── style.css           # Main stylesheet
│
├── js/
│   ├── script.js           # Main JavaScript (menu, categories)
│   └── cart.js             # Cart functionality
│
├── php/
│   ├── db_connect.php      # Database connection
│   ├── register_user.php   # User registration handler
│   ├── login_user.php      # User login handler
│   ├── fetch_categories.php # Returns all categories (JSON)
│   ├── fetch_food_items.php # Returns food items (JSON)
│   └── place_order.php     # Order placement handler
│
└── README.md
```

---

## 🚀 Installation Guide

### Prerequisites

- **MAMP** (or XAMPP/WAMP) installed
- **MySQL** running
- **PHP 7.0+**
- Modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/online-food-ordering.git
cd online-food-ordering
```

Or simply download and extract the ZIP file.

### Step 2: Move to MAMP htdocs

```bash
# For macOS MAMP
mv online-food-ordering /Applications/MAMP/htdocs/

# For Windows MAMP
move online-food-ordering C:\MAMP\htdocs\
```

### Step 3: Set Up the Database

1. Open **phpMyAdmin** at `http://localhost:8888/phpMyAdmin/`
2. Click on the **SQL** tab
3. Copy and paste the contents of `database.sql` (or the SQL code below)
4. Click **Go** to execute

### Step 4: Configure Database Connection

Open `php/db_connect.php` and update if needed:

```php
$host = 'localhost';
$username = 'root';
$password = 'root';       // MAMP default
$database = 'food_ordering';
$port = 8889;              // MAMP default port
```

### Step 5: Run the Website

Start MAMP servers and visit:

```
http://localhost:8888/online-food-ordering/
```

---

## 🗄️ Database Schema

```sql
CREATE DATABASE food_ordering;
USE food_ordering;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description TEXT
);

-- Food items table
CREATE TABLE food_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    is_available BOOLEAN DEFAULT TRUE,
    food_type ENUM('veg', 'non-veg', 'vegan') DEFAULT 'veg',
    preparation_time INT DEFAULT 20,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    payment_method VARCHAR(20),
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIME,
    instructions TEXT,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    food_item_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `php/register_user.php` | POST | Register a new user |
| `php/login_user.php` | POST | Login existing user |
| `php/fetch_categories.php` | GET | Get all food categories |
| `php/fetch_food_items.php` | GET | Get all food items (or filter by `?category_id=`) |
| `php/place_order.php` | POST | Place a new order |

---

## 🎯 How to Use

1. **Register** a new account at `register.html`
2. **Login** with your credentials
3. **Browse** categories and food items
4. **Add items** to cart by clicking "Add to Cart"
5. **View cart** and adjust quantities
6. **Proceed to checkout** and enter delivery details
7. **Select payment method** (COD/Card/UPI)
8. **Place order** and see the success message
9. **Wait for delivery** (20-30 minutes estimated)

---

## 🧪 Testing

### Test Database Connection
Create a file `test.php` in the root:

```php
<?php
include 'php/db_connect.php';
echo "Database connected successfully!<br>";

$result = $conn->query("SELECT COUNT(*) as count FROM categories");
$row = $result->fetch_assoc();
echo "Categories: " . $row['count'] . "<br>";

$result = $conn->query("SELECT COUNT(*) as count FROM food_items");
$row = $result->fetch_assoc();
echo "Food Items: " . $row['count'];
?>
```

Visit `http://localhost:8888/online-food-ordering/test.php`

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Database connection failed** | Check MAMP MySQL port (default 8889) and password ('root') |
| **Images not showing** | Ensure `images/` folder exists or use online image URLs |
| **Categories not loading** | Open browser console (F12) to check for JavaScript errors |
| **404 on PHP files** | Ensure you're accessing via `http://localhost:8888/` (not `file://`) |
| **Login not working** | Clear browser cache and try again |

---

## 🎨 Customization

### Change Theme Color
Edit `css/style.css`:

```css
:root {
    --primary-color: #e74c3c;   /* Change this */
    --primary-dark: #c0392b;
}
```

### Add New Category
Insert into `categories` table:

```sql
INSERT INTO categories (name, image, description) 
VALUES ('Thai', 'path/to/image.jpg', 'Delicious Thai cuisine');
```

### Add New Food Item
Insert into `food_items` table:

```sql
INSERT INTO food_items (name, description, price, image, category_id, food_type, preparation_time)
VALUES ('Pad Thai', 'Stir-fried rice noodles', 250, 'path/to/image.jpg', 6, 'veg', 20);
```

---

## 🔒 Security Features

- ✅ **Password Hashing** with `password_hash()`
- ✅ **SQL Injection Prevention** with `real_escape_string()`
- ✅ **Session Management** for authentication
- ✅ **Input Validation** on all forms
- ✅ **XSS Protection** with `htmlspecialchars()`

---

## 📈 Future Enhancements

- [ ] Order tracking with live status updates
- [ ] Admin panel for managing items
- [ ] Email notifications
- [ ] Razorpay/Stripe integration
- [ ] User profile & order history
- [ ] Coupon & discount system
- [ ] Ratings & reviews
- [ ] Real-time GPS delivery tracking

---
