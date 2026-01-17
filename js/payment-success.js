// Payment Success Page
document.addEventListener('DOMContentLoaded', function() {
    const orderData = localStorage.getItem('completed_order') || localStorage.getItem('pending_order');
    const orderSummary = document.getElementById('orderSummary');

    if (orderData) {
        try {
            const order = JSON.parse(orderData);
            renderOrderSummary(order, orderSummary);
            
            // Save order to user history if logged in (if auth is loaded)
            if (window.auth && window.auth.isLoggedIn() && order.items) {
                window.auth.saveOrder({
                    items: order.items,
                    total: order.total || 0,
                    deliveryInfo: order.delivery || {}
                });
            }
            
            // Clear pending order after displaying
            if (localStorage.getItem('pending_order')) {
                localStorage.removeItem('pending_order');
            }
        } catch (e) {
            console.error('Error parsing order data:', e);
            orderSummary.innerHTML = '<p>Merci pour votre commande !</p>';
        }
    } else {
        orderSummary.innerHTML = '<p>Merci pour votre commande !</p>';
    }
});

function renderOrderSummary(order, container) {
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <span>${item.quantity}x ${item.name}</span>
            <span>€${(parseFloat(item.price.replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');

    const total = order.items.reduce((sum, item) => {
        return sum + (parseFloat(item.price.replace(',', '.')) * item.quantity);
    }, 0);

    container.innerHTML = `
        <div class="order-details">
            <h3>Récapitulatif de votre commande</h3>
            <div class="order-items">
                ${itemsHtml}
            </div>
            <div class="order-total">
                <strong>Total: €${total.toFixed(2).replace('.', ',')}</strong>
            </div>
            ${order.delivery ? `
                <div class="delivery-info">
                    <h4>Livraison à:</h4>
                    <p>${order.delivery.name}<br>
                    ${order.delivery.address}<br>
                    ${order.delivery.postal} ${order.delivery.city}<br>
                    Tél: ${order.delivery.phone}</p>
                </div>
            ` : ''}
        </div>
    `;
}

// Add CSS for payment success page
const style = document.createElement('style');
style.textContent = `
    .payment-result-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        padding: 2rem;
    }
    
    .payment-result-content {
        background: white;
        border-radius: 20px;
        padding: 3rem;
        max-width: 600px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
    
    .payment-success-icon {
        width: 100px;
        height: 100px;
        background: var(--halal-green);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        margin: 0 auto 2rem;
        animation: scaleIn 0.5s ease;
    }
    
    @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
    }
    
    .payment-result-content h1 {
        color: var(--secondary-color);
        margin-bottom: 1rem;
    }
    
    .payment-result-content > p {
        color: var(--text-light);
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    
    .order-summary {
        background: var(--bg-light);
        border-radius: 12px;
        padding: 2rem;
        margin: 2rem 0;
        text-align: left;
    }
    
    .order-details h3 {
        color: var(--secondary-color);
        margin-bottom: 1rem;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .order-item:last-child {
        border-bottom: none;
    }
    
    .order-total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid var(--border-color);
        font-size: 1.3rem;
        color: var(--accent-color);
    }
    
    .delivery-info {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }
    
    .delivery-info h4 {
        color: var(--secondary-color);
        margin-bottom: 0.5rem;
    }
    
    .payment-result-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
`;
document.head.appendChild(style);
