document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth State and Role
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    if (!user || !window.api.getToken() || user.role !== 'ADMIN') {
        alert('Access Denied. Admins only.');
        window.location.href = 'index.html';
        return;
    }

    const authBtn = document.getElementById('nav-auth');
    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.api.logout();
    });

    const tableBody = document.getElementById('orders-table-body');
    const alertBox = document.getElementById('alert-box');

    const showAlert = (message, isError = false) => {
        alertBox.textContent = message;
        alertBox.className = `alert ${isError ? 'error' : 'success'}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 4000);
    };

    const loadOrders = async () => {
        try {
            const orders = await window.api.getOrdersAdmin();
            
            if (!orders || orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="padding: 1rem; text-align: center;">No orders found.</td></tr>';
                return;
            }

            tableBody.innerHTML = orders.map(order => `
                <tr style="border-bottom: 1px solid var(--glass-border);">
                    <td style="padding: 1rem;">#${order.id}</td>
                    <td style="padding: 1rem;">${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td style="padding: 1rem;">${order.user.username}</td>
                    <td style="padding: 1rem;">$${parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td style="padding: 1rem;">
                        <span style="padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; background: ${getStatusColor(order.status)}; color: white;">
                            ${order.status}
                        </span>
                    </td>
                    <td style="padding: 1rem;">
                        <select class="form-control" style="width: auto; display: inline-block; padding: 0.3rem;" onchange="updateStatus(${order.id}, this.value)">
                            <option value="">Update...</option>
                            <option value="PENDING" ${order.status === 'PENDING' ? 'disabled' : ''}>Pending</option>
                            <option value="SHIPPED" ${order.status === 'SHIPPED' ? 'disabled' : ''}>Shipped</option>
                            <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'disabled' : ''}>Delivered</option>
                            <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'disabled' : ''}>Cancelled</option>
                        </select>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error(error);
            showAlert('Failed to load orders.', true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#f59e0b'; // warning
            case 'SHIPPED': return '#3b82f6'; // info
            case 'DELIVERED': return '#10b981'; // success
            case 'CANCELLED': return '#ef4444'; // danger
            default: return 'gray';
        }
    };

    window.updateStatus = async (orderId, newStatus) => {
        if (!newStatus) return;
        try {
            await window.api.updateOrderStatus(orderId, newStatus);
            showAlert(`Order #${orderId} marked as ${newStatus}`);
            loadOrders();
        } catch (error) {
            showAlert(`Failed to update order: ${error.message}`, true);
        }
    };

    // Init
    loadOrders();
});
