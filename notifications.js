// Global notification system for the Summer Sale website
// This replaces all browser alerts with a custom notification that works with a single click

/**
 * Shows a custom notification that can be dismissed with a single click
 * @param {string} productName - The name of the product
 * @param {number} price - The price of the product
 * @param {string} [message] - Optional custom message (defaults to added to cart message)
 */
function showSingleClickNotification(productName, price, message) {
  // Create container if it doesn't exist
  let notificationContainer = document.getElementById('single-click-notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'single-click-notification-container';
    notificationContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.style.cssText = 'background-color: #222; color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 10px; width: 300px; overflow: hidden;';
  
  // Default message if not provided
  const displayMessage = message || `Added to cart: ${productName} - $${price.toFixed(2)}`;
  
  // Generate a unique ID for the button
  const buttonId = 'ok-btn-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  
  // Add notification content
  notification.innerHTML = `
    <div style="padding: 15px;">
      <div style="margin-bottom: 8px; font-weight: 600; color: #eee;">127.0.0.1:5504 says</div>
      <div style="margin-bottom: 15px;">${displayMessage}</div>
      <div style="text-align: right;">
        <button id="${buttonId}" style="background-color: #e2e2e2; color: #333; border: none; padding: 8px 20px; border-radius: 4px; font-weight: 500; cursor: pointer;">OK</button>
      </div>
    </div>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Define close function that works with a single click
  const closeNotification = function(event) {
    // Stop event propagation to prevent any other handlers
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Add slide out animation
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
    
    // Return false to prevent default action
    return false;
  };
  
  // Get button with unique ID to avoid conflicts
  const okButton = document.getElementById(buttonId);
  if (okButton) {
    // Multiple ways to ensure the click event works
    okButton.onclick = closeNotification;
    okButton.addEventListener('click', closeNotification, {once: true});
    okButton.addEventListener('mousedown', closeNotification, {once: true});
    
    // Add another event listener that stops propagation
    okButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, {capture: true, once: true});
  }
  
  // Add entrance animation
  notification.style.transition = 'all 0.3s ease-out';
  notification.style.transform = 'translateX(100%)';
  notification.style.opacity = '0';
  
  // Trigger animation after a tiny delay (required for the animation to work)
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Auto-remove after 8 seconds if not clicked
  setTimeout(() => {
    if (document.body.contains(notification)) {
      closeNotification();
    }
  }, 8000);
}
