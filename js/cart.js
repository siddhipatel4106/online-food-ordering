let cart = JSON.parse(localStorage.getItem('foodCart')) || [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartCount();
});

// Updated loadCartItems function with images
function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartItems) cartItems.innerHTML = '';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100/666666/FFFFFF?text=${encodeURIComponent(item.name.substring(0, 10))}'">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div style="font-weight: bold; min-width: 80px; text-align: right;">
                        ₹${itemTotal.toFixed(2)}
                    </div>
                    <button class="btn btn-outline" onclick="removeFromCart(${item.id})" style="padding: 8px 12px;">Remove</button>
                </div>
            </div>
        `;
    });
    
    if (cartItems) cartItems.innerHTML = itemsHTML;
    
    // Update summary
    const deliveryFee = 40;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    }
}

function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('foodCart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

function removeFromCart(itemId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('foodCart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('foodCart');
        loadCartItems();
        updateCartCount();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems > 0 ? `(${totalItems})` : '';
    });
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;