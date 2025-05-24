// Simple JS for Summer Sale website
document.addEventListener('DOMContentLoaded', () => {
  // Setup buy buttons
  setupBuyButtons();
  
  // Handle mobile menu
  document.querySelector('.md\\:hidden.p-2')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });
  
  // Setup carousel navigation
  setupCarousel();
});

// Setup all buy buttons
function setupBuyButtons() {
  // Add click events to all buy buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Get product info from closest card
      const card = btn.closest('.card');
      if (!card) return;
      
      const name = card.querySelector('h3')?.textContent || 'Product';
      const price = parseFloat(card.querySelector('p')?.textContent?.replace('$', '') || '0');
      
      // Use custom notification instead of browser alert
      showSingleClickNotification(name, price);
    });
  });
}

// Setup carousel functionality
function setupCarousel() {
  // Banner carousel
  const bannerLinks = document.querySelectorAll('.carousel-item a');
  bannerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({behavior: 'smooth'});
    });
  });
  
  // Customer reviews carousel
  const reviewLinks = document.querySelectorAll('#reviews-nav a');
  reviewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({behavior: 'smooth'});
    });
  });
}
