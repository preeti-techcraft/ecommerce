const API_BASE_URL = 'http://localhost:8082/api';

const api = {
    // Helper to get auth token
    getToken: () => localStorage.getItem('token'),
    
    // Helper for headers
    getHeaders: () => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Handle API Response
    handleResponse: async (response) => {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    // Authentication
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await api.handleResponse(response);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
        }
        return data;
    },

    register: async (username, email, password, role) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        return api.handleResponse(response);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Products
    getProducts: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.name) queryParams.append('name', params.name);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/products${queryString}`);
        return api.handleResponse(response);
    },

    // Cart / Orders
    addToCart: async (productId, quantity) => {
        const response = await fetch(`${API_BASE_URL}/cart/add?productId=${productId}&quantity=${quantity}`, {
            method: 'POST',
            headers: api.getHeaders()
        });
        return api.handleResponse(response);
    },

    checkoutOrder: async () => {
        const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: api.getHeaders()
        });
        return api.handleResponse(response);
    },

    // Admin Features
    getOrdersAdmin: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders`, {
            method: 'GET',
            headers: api.getHeaders()
        });
        return api.handleResponse(response);
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?status=${status}`, {
            method: 'PUT',
            headers: api.getHeaders()
        });
        return api.handleResponse(response);
    }
};

// Expose API globally
window.api = api;
