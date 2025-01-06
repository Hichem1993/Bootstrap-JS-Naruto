// cart.js - This goes in a separate file

// Cart state management
class CartManager {
    constructor() {
        this.cartItems = [];
        this.loadCart(); // Load existing cart data when initialized
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    // Add item to cart
    addItem(name, price) {
        // Check if item already exists
        const existingItem = this.cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            existingItem.totalPrice = existingItem.quantity * price;
        } else {
            this.cartItems.push({
                name: name,
                price: price,
                quantity: 1,
                totalPrice: price
            });
        }
        
        this.saveCart();
        this.updateDisplay();
    }

    // Calculate total
    getTotal() {
        return this.cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price), 0);
    }

    // Update cart display
    updateDisplay() {
        const cartSummary = document.querySelector('.cart-summary');
        if (!cartSummary) return;

        // Clear existing cart items
        const existingItemsContainer = cartSummary.querySelector('.cart-items');
        if (existingItemsContainer) {
            existingItemsContainer.remove();
        }

        // Create new cart items container
        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

        // Add each item to the display
        this.cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name} x${item.quantity || 1}</span>
                    <span>${(item.totalPrice || item.price).toFixed(2)} €</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Insert cart items before the total
        const totalElement = cartSummary.querySelector('h5:last-of-type');
        cartSummary.insertBefore(cartItemsContainer, totalElement);

        // Update total display
        totalElement.textContent = `TOTAL : ${this.getTotal().toFixed(2)} €`;
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all "Ajouter" buttons
    const addButtons = document.querySelectorAll('.card .btn-danger');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('.card-title').textContent;
            const priceText = card.querySelector('.card-text').textContent;
            const price = parseFloat(priceText.replace('€', '').trim());
            
            cartManager.addItem(productName, price);
        });
    });
});
