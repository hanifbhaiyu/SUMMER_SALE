// Cart API Implementation for Summer Sale Website
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart state
  window.cartState = {
    items: [],
    couponCode: '',
    discount: 0,
    shippingMethod: { id: 'free', name: 'Free Shipping', price: 0 }
  };

  // Define shipping options
  window.shippingOptions = [
    { id: 'free', name: 'Free Shipping', price: 0 },
    { id: 'standard', name: 'Standard Shipping', price: 5 },
    { id: 'express', name: 'Express Shipping', price: 15 }
  ];

  // Cart API - provides methods for cart management
  window.cartAPI = {
    // Add item to cart
    addItem: function(product) {
      // Check if product already exists in cart
      const existingItem = cartState.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity
        existingItem.quantity += 1;
      } else {
        // Add new item with quantity 1
        cartState.items.push({
          ...product,
          quantity: 1
        });
      }
      
      // Update UI
      this.updateCartUI();
      return cartState.items;
    },
    
    // Remove item from cart
    removeItem: function(productId) {
      cartState.items = cartState.items.filter(item => item.id !== productId);
      this.updateCartUI();
      return cartState.items;
    },
    
    // Update item quantity
    updateQuantity: function(productId, quantity) {
      const item = cartState.items.find(item => item.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      this.updateCartUI();
      return cartState.items;
    },
    
    // Set shipping method
    setShippingMethod: function(shippingId) {
      const shipping = shippingOptions.find(option => option.id === shippingId);
      if (shipping) {
        cartState.shippingMethod = shipping;
        
        // Update shipping price display
        const shippingPriceEl = document.getElementById('shippingPrice');
        if (shippingPriceEl) {
          shippingPriceEl.textContent = shipping.price.toFixed(2);
        }
        
        // Recalculate total
        this.updateCartUI();
      }
      return cartState.shippingMethod;
    },
    
    // Apply coupon code
    applyCoupon: function(code) {
      code = code.toUpperCase().trim();
      const subtotal = this.calculateSubtotal();
      
      // Reset discount first
      cartState.discount = 0;
      cartState.couponCode = '';
      
      let message = '';
      let isSuccess = false;
      
      // Apply coupon logic
      if (code === 'SELL200' && subtotal >= 200) {
        // 20% discount
        cartState.discount = subtotal * 0.2;
        cartState.couponCode = code;
        message = '20% discount applied!';
        isSuccess = true;
      } else if (code === 'SUMMER50' && subtotal >= 100) {
        // 10% discount
        cartState.discount = subtotal * 0.1;
        cartState.couponCode = code;
        message = '10% discount applied!';
        isSuccess = true;
      } else if (code === 'SELL200' || code === 'SUMMER50') {
        message = 'You need to spend more to use this coupon.';
      } else {
        message = 'Invalid coupon code';
      }
      
      // Update discount display
      const discountPriceEl = document.getElementById('discountPrice');
      if (discountPriceEl) {
        discountPriceEl.textContent = cartState.discount.toFixed(2);
      }
      
      // Show message
      this.showCouponMessage(message, isSuccess);
      
      // Update total
      this.updateTotal();
      
      return { applied: isSuccess, message };
    },
    
    // Calculate subtotal
    calculateSubtotal: function() {
      return cartState.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    
    // Update total price
    updateTotal: function() {
      const subtotal = this.calculateSubtotal();
      const shipping = cartState.shippingMethod.price;
      const discount = cartState.discount;
      const total = Math.max(0, subtotal + shipping - discount);
      
      // Update UI elements
      const totalPriceEl = document.getElementById('totalPrice');
      const totalEl = document.getElementById('total');
      
      if (totalPriceEl) {
        totalPriceEl.textContent = subtotal.toFixed(2);
      }
      
      if (totalEl) {
        totalEl.textContent = total.toFixed(2);
      }
      
      return total;
    },
    
    // Show coupon message
    showCouponMessage: function(message, isSuccess) {
      const container = document.getElementById('coupon-container');
      if (!container) return;
      
      container.innerHTML = '';
      
      const messageEl = document.createElement('div');
      messageEl.className = isSuccess 
        ? 'bg-green-100 text-green-700 p-2 mb-2 rounded' 
        : 'bg-red-100 text-red-700 p-2 mb-2 rounded';
      messageEl.textContent = message;
      container.appendChild(messageEl);
      
      setTimeout(() => {
        messageEl.remove();
      }, 3000);
    },
    
    // Update cart UI
    updateCartUI: function() {
      const titleContainer = document.getElementById('title-container');
      if (!titleContainer) return;
      
      // Clear current items
      titleContainer.innerHTML = '';
      
      // Show cart items or empty cart message
      if (cartState.items.length === 0) {
        titleContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
      } else {
        // Create table for cart items
        const table = document.createElement('table');
        table.className = 'w-full';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr class="border-b">
            <th class="text-left py-2">Product</th>
            <th class="text-center py-2">Price</th>
            <th class="text-center py-2">Quantity</th>
            <th class="text-right py-2">Total</th>
            <th class="text-right py-2">Action</th>
          </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        cartState.items.forEach(item => {
          const tr = document.createElement('tr');
          tr.className = 'border-b';
          
          const itemTotal = item.price * item.quantity;
          
          tr.innerHTML = `
            <td class="py-3">
              <div class="flex items-center">
                <img src="${item.image || ''}" alt="${item.name}" class="w-12 h-12 object-cover mr-3">
                <span>${item.name}</span>
              </div>
            </td>
            <td class="text-center">$${item.price.toFixed(2)}</td>
            <td class="text-center">
              <div class="flex items-center justify-center">
                <button class="px-2 py-1 bg-gray-200 rounded-l" onclick="cartAPI.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="px-3">${item.quantity}</span>
                <button class="px-2 py-1 bg-gray-200 rounded-r" onclick="cartAPI.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
            </td>
            <td class="text-right">$${itemTotal.toFixed(2)}</td>
            <td class="text-right">
              <button class="text-red-500 hover:text-red-700" onclick="cartAPI.removeItem('${item.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          `;
          
          tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        titleContainer.appendChild(table);
      }
      
      // Update totals
      this.updateTotal();
    }
  };
  
  // Initialize cart UI on page load
  cartAPI.updateCartUI();
});

// Function to extract product info from card and add to cart
function addToCart(button) {
  // Get the card element
  const card = button.closest('.card');
  if (!card) return;
  
  // Extract product info
  const name = card.querySelector('h3')?.textContent || 'Product';
  const price = parseFloat(card.querySelector('p')?.textContent?.replace('$', '') || '0');
  const image = card.querySelector('img')?.src || '';
  
  // Generate a unique ID
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  // Add to cart
  cartAPI.addItem({
    id: id,
    name: name,
    price: price,
    image: image
  });
  
  // Use our global notification function
  showSingleClickNotification(name, price);
}

// Direct function to apply discount coupon
function applyDiscountCoupon() {
  const inputField = document.getElementById('input-field');
  if (!inputField) return;
  
  const couponCode = inputField.value.trim();
  if (!couponCode) {
    cartAPI.showCouponMessage('Please enter a coupon code', false);
    return;
  }
  
  cartAPI.applyCoupon(couponCode);
  
  // Clear input field
  inputField.value = '';
}
