// Menu Cart Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not already done
    if (!window.delicornerCart) {
        window.delicornerCart = new ShoppingCart();
    }

    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemId = this.getAttribute('data-id');
            const itemName = this.getAttribute('data-name');
            const itemPrice = this.getAttribute('data-price');
            
            // Get quantity from input
            const quantityInput = document.getElementById(`qty-${itemId}`);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            if (!itemId || !itemName || !itemPrice) {
                console.error('Missing item data');
                return;
            }
            
            // Add item multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                const item = {
                    id: itemId,
                    name: itemName,
                    price: itemPrice
                };
                window.delicornerCart.addItem(item);
            }
            
            // Visual feedback
            this.classList.add('added');
            const originalText = this.textContent;
            this.textContent = '✓ Ajouté !';
            
            setTimeout(() => {
                this.classList.remove('added');
                this.textContent = originalText;
            }, 2000);
        });
    });
});
