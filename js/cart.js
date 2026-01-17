// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        const savedCart = localStorage.getItem('delicorner_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('delicorner_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }
        
        this.saveCart();
        this.showCartNotification();
        return this.cart;
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
    }

    updateQuantity(itemId, quantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.price.replace(',', '.')) * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCount = this.getItemCount();
        const cartCountEl = document.getElementById('cartCount');
        
        if (cartCountEl) {
            cartCountEl.textContent = cartCount;
            cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    }

    showCartNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-content">
                <span class="cart-notification-icon">✓</span>
                <span>Article ajouté au panier !</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Make cart globally available
window.delicornerCart = cart;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}
