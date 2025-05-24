// Simple product slider script
document.addEventListener('DOMContentLoaded', () => setupSliders());

// Setup all product category sliders
function setupSliders() {
  // Find all product categories by their headings
  document.querySelectorAll('h2.text-4xl.font-bold').forEach(category => {
    const container = category.parentElement;
    const productGrid = container.querySelector('div[class*="grid"]');
    if (!productGrid) return;

    // Get all product cards
    const products = productGrid.querySelectorAll('.card');
    if (products.length === 0) return;
    
    // Create slider with navigation
    createSimpleSlider(productGrid, products);
  });
}

// Create a simple product slider
function createSimpleSlider(productGrid, products) {
  // Create main container
  const slider = document.createElement('div');
  slider.className = 'product-slider';
  slider.style.cssText = 'position:relative;overflow:hidden;margin:2rem 0;';
  
  // Create container for products
  const track = document.createElement('div');
  track.style.cssText = 'display:flex;transition:transform 0.3s;';
  
  // Add products to slider
  products.forEach(product => {
    const clone = product.cloneNode(true);
    clone.style.cssText = 'flex:0 0 auto;width:50%;padding:0 8px;cursor:pointer;';
    
    // Add click handler
    clone.querySelector('.btn')?.addEventListener('click', () => {
      const name = clone.querySelector('h3')?.textContent || 'Product';
      const price = parseFloat(clone.querySelector('p')?.textContent?.replace('$', '') || '0');
      // Use custom notification instead of browser alert
      showSingleClickNotification(name, price);
    });
    
    track.appendChild(clone);
  });
  
  // Create navigation buttons
  const prevBtn = createNavButton('prev', '❮');
  const nextBtn = createNavButton('next', '❯');
  
  // Add elements to slider
  slider.appendChild(track);
  slider.appendChild(prevBtn);
  slider.appendChild(nextBtn);
  
  // Replace grid with slider
  productGrid.parentNode.insertBefore(slider, productGrid);
  productGrid.style.display = 'none';
  
  // Set up slider navigation
  let position = 0;
  const slides = track.children.length;
  
  // Next button functionality
  nextBtn.addEventListener('click', () => {
    position = position < slides - 2 ? position + 1 : 0;
    track.style.transform = `translateX(-${position * 50}%)`;
  });
  
  // Previous button functionality
  prevBtn.addEventListener('click', () => {
    position = position > 0 ? position - 1 : slides - 2;
    track.style.transform = `translateX(-${position * 50}%)`;
  });
  
  // Adjust for mobile
  handleResponsive(track);
  window.addEventListener('resize', () => handleResponsive(track));
}

// Create navigation button
function createNavButton(type, text) {
  const btn = document.createElement('button');
  btn.innerHTML = text;
  btn.style.cssText = `
    position:absolute;z-index:10;top:50%;transform:translateY(-50%);
    ${type === 'prev' ? 'left' : 'right'}:10px;
    background:#F11A7B;color:white;border:none;border-radius:50%;
    width:40px;height:40px;font-size:18px;cursor:pointer;
  `;
  return btn;
}

// Handle responsive behavior
function handleResponsive(track) {
  const isMobile = window.innerWidth < 768;
  Array.from(track.children).forEach(item => {
    item.style.width = isMobile ? '100%' : '50%';
  });
}
