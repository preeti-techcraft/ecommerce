document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to home
    if (window.api.getToken()) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'ADMIN') {
                window.location.href = 'admin.html';
                return;
            }
        } catch(e) {}
        window.location.href = 'index.html';
        return;
    }

    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const alertBox = document.getElementById('auth-alert');

    const showAlert = (message, isError = false) => {
        alertBox.textContent = message;
        alertBox.className = `alert ${isError ? 'error' : 'success'}`;
        alertBox.style.display = 'block';
    };

    // Toggle forms
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        alertBox.style.display = 'none';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
        alertBox.style.display = 'none';
    });

    // Login Form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        const btn = e.target.querySelector('button');
        
        try {
            btn.textContent = 'Signing in...';
            btn.disabled = true;
            const data = await window.api.login(user, pass);
            if (data.role === 'ADMIN') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } catch (err) {
            showAlert(err.message, true);
            btn.textContent = 'Sign In';
            btn.disabled = false;
        }
    });

    // Register Form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const isAdmin = document.getElementById('reg-admin').checked;
        const role = isAdmin ? 'ADMIN' : 'USER';
        const btn = e.target.querySelector('button');
        
        try {
            btn.textContent = 'Registering...';
            btn.disabled = true;
            await window.api.register(user, email, pass, role);
            showAlert('Registration successful! Please sign in.');
            showLoginBtn.click();
        } catch (err) {
            showAlert(err.message, true);
        } finally {
            btn.textContent = 'Register';
            btn.disabled = false;
        }
    });
});
