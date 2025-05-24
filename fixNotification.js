// Fix for notification system to ensure OK button works with a single click
(function() {
  // Store original alert function
  const originalAlert = window.alert;
  
  // Override the default alert with our custom implementation
  window.alert = function(message) {
    // Create custom notification that works with a single click
    createSingleClickNotification(message);
  };
  
  // Custom notification function
  function createSingleClickNotification(message) {
    // Create container if it doesn't exist
    let container = document.getElementById('notification-fix-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-fix-container';
      container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; pointer-events: auto;';
      document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = 'background-color: #222; color: white; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 10px; width: 300px; overflow: hidden;';
    
    // Create unique ID for the button
    const buttonId = 'ok-button-' + Date.now();
    
    // Add notification content
    notification.innerHTML = `
      <div style="padding: 15px;">
        <div style="margin-bottom: 8px; font-weight: 600; color: #eee;">127.0.0.1:5504 says</div>
        <div style="margin-bottom: 15px;">${message}</div>
        <div style="text-align: right;">
          <button id="${buttonId}" style="background-color: #e2e2e2; color: #333; border: none; padding: 6px 20px; border-radius: 4px; font-weight: 500; cursor: pointer;">OK</button>
        </div>
      </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Get the button by its unique ID
    const button = document.getElementById(buttonId);
    
    // Function to close notification
    const closeNotification = function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    };
    
    // Add multiple event handlers to ensure it works with a single click
    if (button) {
      // Direct onclick property
      button.onclick = closeNotification;
      
      // Standard event listener
      button.addEventListener('click', closeNotification, {once: true});
      
      // Mousedown event (fires before click)
      button.addEventListener('mousedown', closeNotification, {once: true});
    }
    
    // Auto remove after 10 seconds
    setTimeout(closeNotification, 10000);
  }
  
  console.log("Notification system fixed - OK button now works with a single click");
})();
