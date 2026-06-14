document.addEventListener('DOMContentLoaded', () => {
    // Check Auth State
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    const authBtn = document.getElementById('nav-auth');
    if (user && window.api.getToken()) {
        authBtn.textContent = 'Logout';
        authBtn.classList.remove('btn-primary');
        authBtn.classList.add('btn-danger');
        authBtn.href = '#';
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.api.logout();
        });
    }

    const cartContent = document.getElementById('cart-content');
    const alertBox = document.getElementById('cart-alert');

    const showAlert = (message, isError = false) => {
        alertBox.textContent = message;
        alertBox.className = `alert ${isError ? 'error' : 'success'}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 4000);
    };

    const renderCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="glass-panel" style="padding: 3rem; text-align: center;">
                    <h3 style="margin-bottom: 1rem;">Your cart is empty</h3>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartContent.innerHTML = `
            <div class="cart-list">
                ${cart.map((item, index) => `
                    <div class="cart-item glass-panel">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                        </div>
                        <div class="cart-item-actions" style="display: flex; gap: 1rem; align-items: center;">
                            <span style="font-weight: 500;">Qty: ${item.quantity}</span>
                            <button class="btn btn-danger" onclick="removeFromCart(${index})" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="cart-summary glass-panel">
                <div class="cart-total">Total: $${total.toFixed(2)}</div>
                <button id="checkout-btn" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.8rem 2rem;">Proceed to Checkout</button>
            </div>
        `;

        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    };

    window.removeFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const handleCheckout = async () => {
        if (!window.api.getToken()) {
            showAlert('You must be logged in to checkout. Please login first.', true);
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;

        try {
            // Add all items in the local cart to the backend cart
            for (const item of cart) {
                const productId = item.id || item.productId;
                if (!productId) {
                    throw new Error("Invalid item in cart. Please clear your cart and try again.");
                }
                await window.api.addToCart(productId, item.quantity);
            }
            
            // Trigger the checkout process on the backend
            await window.api.checkoutOrder();
            
            localStorage.removeItem('cart');
            
            cartContent.innerHTML = `
                <div class="glass-panel" style="padding: 3rem; text-align: center; color: #10b981;">
                    <h2>Order Placed Successfully!</h2>
                    <p style="margin: 1rem 0; color: var(--text-secondary);">Thank you for your purchase.</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        } catch (error) {
            showAlert('Checkout failed: ' + error.message, true);
            checkoutBtn.textContent = 'Proceed to Checkout';
            checkoutBtn.disabled = false;
        }
    };

    renderCart();
});
