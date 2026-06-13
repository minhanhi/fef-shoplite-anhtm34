/**
 * ShopLite Cart Manager
 * Manages cart state inside localStorage and shares operations.
 * Syncs global navigation cart badge, and handles cart page (cart.html) rendering & operations.
 */

const CART_STORAGE_KEY = 'shoplite_cart';

const Cart = {
  /**
   * Retrieves the current cart array from localStorage
   * @returns {Array<Object>} Cart items
   */
  getItems() {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return [];
    }
  },

  /**
   * Saves the cart array state back to localStorage
   * @param {Array<Object>} items - Array of cart items
   */
  saveItems(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      this.updateBadge();
      
      // If we are currently on the cart page, re-render it to show live updates
      if (document.getElementById('cartItemsContainer')) {
        this.renderCartPage();
      }
    } catch (error) {
      console.error('Error saving cart data to localStorage:', error);
    }
  },

  /**
   * Add a product to the cart or increments its quantity if it exists
   * @param {Object} product - Product detail object from API
   * @param {number} quantity - Quantity to add (default 1)
   */
  addItem(product, quantity = 1) {
    const items = this.getItems();
    const existingItem = items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Save minimal necessary properties to prevent bloat
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    this.saveItems(items);
    this.showNotification(`Added "${product.title}" to cart!`);
  },

  /**
   * Adjusts the quantity of a specific item in the cart
   * @param {number|string} productId - ID of the product
   * @param {number} newQuantity - Target quantity count
   */
  updateQuantity(productId, newQuantity) {
    let items = this.getItems();
    const targetItem = items.find(item => item.id == productId);

    if (targetItem) {
      targetItem.quantity = Math.max(1, newQuantity); // Minimum quantity is 1
      this.saveItems(items);
    }
  },

  /**
   * Removes a product completely from the cart
   * @param {number|string} productId - ID of the product
   */
  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id != productId);
    this.saveItems(items);
    this.showNotification("Item removed from cart");
  },

  /**
   * Calculates total items count currently in the cart
   * @returns {number} Sum of item quantities
   */
  getTotalCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Calculates subtotal price of all items in the cart
   * @returns {number} Subtotal monetary amount
   */
  getSubtotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  /**
   * Updates the HTML badge elements with the current total cart item count
   */
  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = this.getTotalCount();
    }
  },

  /**
   * Simple non-obstructive visual toast message
   * @param {string} message - Message text
   */
  showNotification(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        zIndex: '2000',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        transform: 'translateY(100px)',
        opacity: '0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        pointerEvents: 'none'
      });
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> ${message}`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 2500);
  },

  /**
   * UI Renderer for cart.html
   * Generates cart rows, sums calculations, and controls visibility structures
   */
  renderCartPage() {
    const itemsContainer = document.getElementById('cartItemsContainer');
    const orderSummary = document.getElementById('orderSummarySection');
    const cartLayout = document.getElementById('cartLayoutContainer');
    const emptyState = document.getElementById('cartEmptyState');

    // If these elements do not exist, we are not on the cart page
    if (!itemsContainer) return;

    const items = this.getItems();

    if (items.length === 0) {
      // Show empty state, hide layout
      cartLayout.classList.add('d-none');
      emptyState.classList.remove('d-none');
      return;
    }

    // Show layout, hide empty state
    emptyState.classList.add('d-none');
    cartLayout.classList.remove('d-none');
    orderSummary.classList.remove('d-none');

    // Render HTML row list for each items
    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item-row d-flex align-items-center flex-column flex-md-row gap-3">
        <!-- Item image -->
        <div class="flex-shrink-0" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 6px; border: 1px solid #e2e8f0; padding: 5px;">
          <img src="${item.image}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        
        <!-- Title & category -->
        <div class="flex-grow-1 text-center text-md-start">
          <span class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">${item.category}</span>
          <h4 class="h6 text-secondary mb-1 text-truncate" style="max-width: 250px;" title="${item.title}">${item.title}</h4>
          <span class="text-primary fw-bold">$${item.price.toFixed(2)}</span>
        </div>
        
        <!-- Quantity steppers and controls -->
        <div class="d-flex align-items-center border rounded-2" style="background: white;">
          <button type="button" class="btn border-0 px-2 btn-qty-adjust" data-id="${item.id}" data-action="minus" aria-label="Decrease quantity">
            <i class="bi bi-dash fs-7"></i>
          </button>
          <input type="number" class="form-control border-0 text-center fw-bold bg-transparent p-0 input-qty-direct" data-id="${item.id}" value="${item.quantity}" min="1" max="20" style="width: 35px; box-shadow: none; font-size: 0.9rem;">
          <button type="button" class="btn border-0 px-2 btn-qty-adjust" data-id="${item.id}" data-action="plus" aria-label="Increase quantity">
            <i class="bi bi-plus fs-7"></i>
          </button>
        </div>

        <!-- Total Price for item -->
        <div class="text-end fw-bold text-secondary" style="min-width: 80px;">
          $${(item.price * item.quantity).toFixed(2)}
        </div>

        <!-- Remove button -->
        <div>
          <button type="button" class="btn btn-link text-danger p-1 btn-remove-item" data-id="${item.id}" aria-label="Remove item">
            <i class="bi bi-trash fs-5"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Update Summary panel prices
    const subtotal = this.getSubtotal();
    const tax = subtotal * 0.10; // 10% tax rate
    const total = subtotal + tax;

    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
  },

  /**
   * Bind event delegation handlers for interactive elements on cart page
   */
  setupCartPageListeners() {
    const itemsContainer = document.getElementById('cartItemsContainer');
    if (!itemsContainer) return;

    // Event Delegation: listen to clicks inside itemsContainer
    itemsContainer.addEventListener('click', (e) => {
      // Check for quantity adjustments (+ or -)
      const qtyAdjustBtn = e.target.closest('.btn-qty-adjust');
      if (qtyAdjustBtn) {
        const id = parseInt(qtyAdjustBtn.getAttribute('data-id'), 10);
        const action = qtyAdjustBtn.getAttribute('data-action');
        const items = this.getItems();
        const item = items.find(item => item.id === id);
        
        if (item) {
          const newQty = action === 'plus' ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(id, newQty);
        }
        return;
      }

      // Check for item removal
      const removeBtn = e.target.closest('.btn-remove-item');
      if (removeBtn) {
        const id = parseInt(removeBtn.getAttribute('data-id'), 10);
        this.removeItem(id);
        return;
      }
    });

    // Event Delegation: listen to direct input changes
    itemsContainer.addEventListener('change', (e) => {
      const input = e.target.closest('.input-qty-direct');
      if (input) {
        const id = parseInt(input.getAttribute('data-id'), 10);
        let val = parseInt(input.value, 10);
        
        if (isNaN(val) || val < 1) {
          val = 1;
        } else if (val > 20) {
          val = 20;
        }
        
        this.updateQuantity(id, val);
      }
    });

    // Setup checkout action
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => {
        alert('Thank you for shopping at ShopLite! This is a course simulation checkout process.');
        localStorage.removeItem(CART_STORAGE_KEY);
        this.saveItems([]);
        window.location.href = 'index.html';
      });
    }
  }
};

// Initial sync and page setups on page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  Cart.renderCartPage();
  Cart.setupCartPageListeners();
});
