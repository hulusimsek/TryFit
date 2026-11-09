// TryFit Popup JS
document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      if (targetId) {
        document.getElementById(targetId)?.classList.add('active');
      }
    });
  });

  // Load active product from Chrome storage if set by content script
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['tryfit_active_product'], (res) => {
      if (res.tryfit_active_product) {
        const p = res.tryfit_active_product;
        const titleEl = document.getElementById('product-title');
        const priceEl = document.getElementById('product-price');
        const imgEl = document.getElementById('product-img');

        if (titleEl && p.title) titleEl.textContent = p.title;
        if (priceEl && p.price) priceEl.textContent = p.price;
        if (imgEl && p.imageUrl) imgEl.src = p.imageUrl;
      }
    });
  }
});
