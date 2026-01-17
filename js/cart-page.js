// Cart Page Management
document.addEventListener('DOMContentLoaded', function() {
    if (!window.delicornerCart) {
        window.delicornerCart = new ShoppingCart();
    }

    const cart = window.delicornerCart;
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const checkoutSummary = document.getElementById('checkoutSummary');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutTotalEl = document.querySelector('.checkout-total');

    function renderCart() {
        const items = cart.cart;
        
        if (items.length === 0) {
            cartEmpty.style.display = 'block';
            checkoutSummary.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(cartEmpty);
            return;
        }

        cartEmpty.style.display = 'none';
        checkoutSummary.style.display = 'block';

        cartItemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const itemEl = createCartItemElement(item);
            cartItemsContainer.appendChild(itemEl);
        });

        updateTotals();
    }

    function createCartItemElement(item) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <span class="cart-item-price">€${item.price}</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                <button class="remove-item-btn" data-id="${item.id}" aria-label="Supprimer">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 5l10 10M15 5l-10 10"/>
                    </svg>
                </button>
            </div>
            <div class="cart-item-total">
                €${(parseFloat(item.price.replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}
            </div>
        `;

        // Add event listeners
        const decreaseBtn = div.querySelector('[data-action="decrease"]');
        const increaseBtn = div.querySelector('[data-action="increase"]');
        const removeBtn = div.querySelector('.remove-item-btn');

        decreaseBtn.addEventListener('click', () => {
            const newQuantity = item.quantity - 1;
            cart.updateQuantity(item.id, newQuantity);
            renderCart();
        });

        increaseBtn.addEventListener('click', () => {
            cart.updateQuantity(item.id, item.quantity + 1);
            renderCart();
        });

        removeBtn.addEventListener('click', () => {
            cart.removeItem(item.id);
            renderCart();
        });

        return div;
    }

    function updateTotals() {
        const total = cart.getTotal();
        const formattedTotal = total.toFixed(2).replace('.', ',');
        
        subtotalEl.textContent = `€${formattedTotal}`;
        totalEl.textContent = `€${formattedTotal}`;
        
        if (checkoutTotalEl) {
            checkoutTotalEl.textContent = `€${formattedTotal}`;
        }
    }

    // Initial render
    renderCart();

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.cart.length === 0) {
                alert('Votre panier est vide');
                return;
            }

            const formData = {
                items: cart.cart,
                total: cart.getTotal(),
                delivery: {
                    name: document.getElementById('deliveryName').value,
                    phone: document.getElementById('deliveryPhone').value,
                    address: document.getElementById('deliveryAddress').value,
                    postal: document.getElementById('deliveryPostal').value,
                    city: document.getElementById('deliveryCity').value,
                    notes: document.getElementById('deliveryNotes').value
                },
                payment_method: document.querySelector('input[name="payment_method"]:checked').value
            };

            // Process payment via Bancontact
            if (typeof processBancontactPayment === 'function') {
                processBancontactPayment(formData);
            } else {
                console.error('Bancontact payment handler not found');
                alert('Le système de paiement n\'est pas configuré. Veuillez contacter le support.');
            }
        });
    }
});
