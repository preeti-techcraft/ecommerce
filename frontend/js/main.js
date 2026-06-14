document.addEventListener('DOMContentLoaded', async () => {
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

        if (user.role === 'ADMIN') {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'nav-item';
            adminLink.textContent = 'Admin Dashboard';
            authBtn.parentNode.insertBefore(adminLink, authBtn);
        }
    }

    // Update Cart Count
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('nav-cart').textContent = `Cart (${count})`;
    };
    updateCartCount();

    // Load Products
    const productGrid = document.getElementById('product-grid');
    const alertBox = document.getElementById('alert-box');

    const showAlert = (message, isError = false) => {
        alertBox.textContent = message;
        alertBox.className = `alert ${isError ? 'error' : 'success'}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 3000);
    };

    const loadProducts = async (params = {}) => {
        try {
            productGrid.innerHTML = '<p style="color: var(--text-secondary);">Loading products...</p>';
            const response = await window.api.getProducts(params);
            const products = response.content || [];
            
            if (products.length === 0) {
                productGrid.innerHTML = '<p>No products available matching your criteria.</p>';
                return;
            }

            productGrid.innerHTML = products.map(product => `
                <div class="product-card glass-panel">
                    <div class="product-image-placeholder">
                        ${product.name.charAt(0)}
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    <p class="product-desc">${product.description || 'Premium quality item.'}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        Add to Cart
                    </button>
                </div>
            `).join('');

        } catch (error) {
            productGrid.innerHTML = '<p style="color: var(--accent-danger)">Failed to load products. Ensure the backend is running.</p>';
            console.error('Error fetching products:', error);
        }
    };

    // Initial load
    loadProducts();

    // Search and Filter Logic
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    searchBtn.addEventListener('click', () => {
        const name = document.getElementById('search-name').value;
        const minPrice = document.getElementById('search-min').value;
        const maxPrice = document.getElementById('search-max').value;
        
        loadProducts({ name, minPrice, maxPrice });
    });
    
    clearBtn.addEventListener('click', () => {
        document.getElementById('search-name').value = '';
        document.getElementById('search-min').value = '';
        document.getElementById('search-max').value = '';
        loadProducts();
    });

    // Add to Cart Function
    window.addToCart = (id, name, price) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId: id, name, price, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showAlert(`${name} added to cart!`);
    };
});
