// TryFit Content Script for Trendyol Product Pages
(() => {
  const injectTryFitButton = () => {
    // Prevent duplicate button injections
    if (document.getElementById('tryfit-inject-btn')) return;

    // Find Trendyol "Sepete Ekle" button container
    const addToCartContainer = 
      document.querySelector('.add-to-basket-button-text')?.closest('button')?.parentElement ||
      document.querySelector('.product-button-container') ||
      document.querySelector('.add-to-basket');

    if (!addToCartContainer) return;

    // Extract product details
    const titleEl = document.querySelector('.pr-new-br span') || document.querySelector('.detail-name');
    const brandEl = document.querySelector('.product-brand-name') || document.querySelector('.pr-new-br a');
    const priceEl = document.querySelector('.prc-dsc') || document.querySelector('.product-price');
    const imageEl = document.querySelector('.base-product-image img') || document.querySelector('.detail-gallery-image img');

    const title = titleEl ? titleEl.textContent?.trim() : document.title;
    const brand = brandEl ? brandEl.textContent?.trim() : 'Trendyol';
    const price = priceEl ? priceEl.textContent?.trim() : '';
    const imageUrl = imageEl ? imageEl.src : '';
    const productUrl = window.location.href;

    // Create TryFit Button
    const btn = document.createElement('button');
    btn.id = 'tryfit-inject-btn';
    btn.type = 'button';
    btn.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      margin-top: 10px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #f27a1a 0%, #ff9800 100%);
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(242, 122, 26, 0.35);
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <span>TryFit ile 3D & AI Üzerimde Gör</span>
    `;

    btn.onmouseover = () => {
      btn.style.transform = 'translateY(-1px)';
      btn.style.boxShadow = '0 6px 18px rgba(242, 122, 26, 0.45)';
    };
    btn.onmouseout = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 4px 14px rgba(242, 122, 26, 0.35)';
    };

    btn.onclick = () => {
      // Save item to chrome storage for popup / web app
      const itemData = { title, brand, price, imageUrl, productUrl };
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ tryfit_active_product: itemData }, () => {
          window.open(`http://localhost:5173/?ref=extension&url=${encodeURIComponent(productUrl)}`, '_blank');
        });
      } else {
        window.open(`http://localhost:5173/?ref=extension&url=${encodeURIComponent(productUrl)}`, '_blank');
      }
    };

    addToCartContainer.appendChild(btn);
  };

  // Run on load and observe DOM for SPA page changes
  injectTryFitButton();
  const observer = new MutationObserver(injectTryFitButton);
  observer.observe(document.body, { childList: true, subtree: true });
})();
