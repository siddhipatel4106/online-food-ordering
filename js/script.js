// Global cart variable
let cart = JSON.parse(localStorage.getItem('foodCart')) || [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing page');
    initializePage();
    updateCartCount();
});

// Enhanced initialization function
function initializePage() {
    console.log('Initializing page...');
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const item = {
                id: parseInt(button.dataset.id),
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            addToCart(item);
        }
    });

    // Load categories and food items
    if (document.getElementById('categoriesGrid')) {
        loadCategories();
    }
    if (document.getElementById('foodGrid')) {
        loadFoodItems();
    }
    
    // Check login status with delay to ensure DOM is ready
    setTimeout(() => {
        checkLoginStatus();
    }, 100);
    
    updateCartCount();
}

// Enhanced login status check
async function checkLoginStatus() {
    try {
        const response = await fetch('php/check_session.php');
        const result = await response.json();
        
        const loginLink = document.getElementById('loginLink');
        const loggedInUser = document.getElementById('loggedInUser');
        const userGreeting = document.getElementById('userGreeting');
        
        if (result.logged_in && result.user_name) {
            // User is logged in
            if (loginLink) loginLink.style.display = 'none';
            if (loggedInUser) {
                loggedInUser.style.display = 'flex';
                loggedInUser.style.alignItems = 'center';
                loggedInUser.style.gap = '10px';
            }
            if (userGreeting) {
                userGreeting.textContent = `Hi, ${result.user_name}`;
            }
        } else {
            // User is not logged in
            if (loginLink) loginLink.style.display = 'block';
            if (loggedInUser) loggedInUser.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        // Fallback to localStorage
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        
        if (isLoggedIn && userName) {
            const loginLink = document.getElementById('loginLink');
            const loggedInUser = document.getElementById('loggedInUser');
            const userGreeting = document.getElementById('userGreeting');
            
            if (loginLink) loginLink.style.display = 'none';
            if (loggedInUser) loggedInUser.style.display = 'flex';
            if (userGreeting) userGreeting.textContent = `Hi, ${userName}`;
        }
    }
}
// Cart functions
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('foodCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${item.name} added to cart!`, 'success');
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems > 0 ? `(${totalItems})` : '';
    });
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 10px; background: none; border: none; cursor: pointer; font-size: 18px;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Load categories from PHP
async function loadCategories() {
    try {
        const response = await fetch('php/fetch_categories.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        console.log('Categories loaded:', categories);
        
        const grid = document.getElementById('categoriesGrid');
        if (grid) {
            grid.innerHTML = categories.map(category => `
                <div class="category-card" onclick="loadCategoryItems(${category.id})" style="cursor: pointer;">
                    <img src="${category.image}" alt="${category.name}" class="category-image">
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load food items
// In js/script.js - add fallback for images
async function loadCategories() {
    try {
        const response = await fetch('php/fetch_categories.php');
        const categories = await response.json();
        
        const grid = document.getElementById('categoriesGrid');
        if (grid) {
            grid.innerHTML = categories.map(category => `
                <div class="category-card" onclick="loadCategoryItems(${category.id})" style="cursor: pointer;">
                    <img src="${category.image}" alt="${category.name}" class="category-image"
                         onerror="this.src='assets/images/default-categories.jpg'">
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadFoodItems(categoryId = null) {
    try {
        let url = 'php/fetch_food_items.php';
        if (categoryId) {
            url += `?category_id=${categoryId}`;
        }
        
        const response = await fetch(url);
        const items = await response.json();
        
        const grid = document.getElementById('foodGrid');
        if (grid) {
            grid.innerHTML = items.map(item => `
                <div class="food-card">
                    <img src="${item.image}" alt="${item.name}" class="food-image"
                         onerror="this.src='assets/images/default-food.jpg'">
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p class="food-description">${item.description}</p>
                        <div class="food-meta">
                            <span class="price">₹${item.price}</span>
                            <span class="food-type ${item.food_type}">${item.food_type.toUpperCase()}</span>
                        </div>
                        <p class="preparation-time">⏱️ ${item.preparation_time} mins</p>
                        <button class="btn btn-primary btn-block add-to-cart" 
                                data-id="${item.id}"
                                data-name="${item.name}"
                                data-price="${item.price}"
                                data-image="${item.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading food items:', error);
    }
}
function loadCategoryItems(categoryId) {
    console.log('Loading items for category:', categoryId);
    loadFoodItems(categoryId);
}
// Temporary debug - add this to loadCategories function
console.log('MEXICAN CATEGORY DATA:', categories.find(cat => cat.id === 2));

// Login success handler (call this after successful login)
function handleLoginSuccess(userData) {
    // Store user info
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', userData.user_name);
    
    // Update UI immediately
    checkLoginStatus();
    
    // Show welcome message
    showNotification(`Welcome back, ${userData.user_name}!`, 'success');
    
    // Use replace instead of href to prevent history issues
    setTimeout(() => {
        window.location.replace('index.html');
    }, 1000);
}

// Logout function
async function logoutUser() {
    try {
        const response = await fetch('php/logout.php');
        const result = await response.json();
        
        if (result.success) {
            // Clear local storage
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            localStorage.removeItem('foodCart');
            cart = [];
            
            // Update UI
            updateLoginUI();
            
            // Show logout message
            showNotification('Logged out successfully', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Force cleanup even if there's an error
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// Update login UI based on user status
function updateLoginUI() {
    const loginLink = document.getElementById('loginLink');
    const loggedInMenu = document.getElementById('loggedInMenu');
    const userGreeting = document.getElementById('userGreeting');
    
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    
    if (loginLink && loggedInMenu && userGreeting) {
        if (isLoggedIn && userName) {
            // User is logged in - show username and logout
            loginLink.style.display = 'none';
            loggedInMenu.style.display = 'block';
            userGreeting.textContent = `Hi, ${userName}`;
            userGreeting.style.color = '#2ecc71';
            userGreeting.style.fontWeight = 'bold';
            userGreeting.href = '#'; // Remove link behavior
        } else {
            // User is not logged in - show login link
            loginLink.style.display = 'block';
            loggedInMenu.style.display = 'none';
        }
    }
}

// Check user session on page load
async function checkUserSession() {
    try {
        const response = await fetch('php/check_session.php');
        const session = await response.json();
        
        if (session.logged_in) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userName', session.user_name);
            localStorage.setItem('userId', session.user_id);
        } else {
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
        }
        updateLoginUI();
    } catch (error) {
        console.error('Session check error:', error);
    }
}
// Make functions globally available
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.showNotification = showNotification;
window.loadCategoryItems = loadCategoryItems;
window.loadFoodItems = loadFoodItems;
window.logoutUser = logoutUser;
window.updateLoginUI = updateLoginUI;
window.handleLoginSuccess = handleLoginSuccess;
window.checkUserSession = checkUserSession;