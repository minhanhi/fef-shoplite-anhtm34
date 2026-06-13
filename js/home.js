/**
 * ShopLite Home Page Controller
 * Deals with catalog retrieval, category rendering, sorting, searching, and adding to cart
 * Implements client-side pagination (8 items per page) with smooth view scroll transitions
 * Uses Event Delegation for cart/detail triggers
 */

// Local page state
let currentProducts = []; // Stores the active product list for the selected category
let currentPage = 1;      // Current active catalog page
const itemsPerPage = 8;   // Number of products displayed per page (Adjusted to 8 per user request)

// DOM Element References
const productGrid = document.getElementById('productGrid');
const categoryFilterContainer = document.getElementById('categoryFilterContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const errorAlert = document.getElementById('errorAlert');
const emptyResults = document.getElementById('emptyResults');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const paginationContainer = document.getElementById('paginationContainer');

/**
 * Generates skeleton placeholder cards during loading state
 * @param {number} count - Number of skeleton cards to render
 */
function renderSkeletons(count = 6) {
  productGrid.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-short"></div>
      <div class="skeleton skeleton-price"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  `).join('');
}

/**
 * Fetch and render product catalog based on target category selection
 * @param {string} category - Category name or 'all'
 */
async function loadProducts(category = 'all') {
  errorAlert.classList.add('d-none');
  emptyResults.classList.add('d-none');
  if (paginationContainer) paginationContainer.innerHTML = '';
  renderSkeletons();

  try {
    if (category === 'all') {
      currentProducts = await API.getProducts();
    } else {
      currentProducts = await API.getProductsByCategory(category);
    }
    
    // Reset search input and sort selection when changing categories
    searchInput.value = '';
    sortSelect.value = 'default';
    currentPage = 1;
    
    applyFiltersAndSort();
  } catch (error) {
    productGrid.innerHTML = '';
    errorAlert.classList.remove('d-none');
  }
}

/**
 * Fetch and build the list of categories pills dynamically
 */
async function loadCategories() {
  try {
    const categories = await API.getCategories();
    
    // Keep 'All Products' pill and append loaded category pills
    const pillsHTML = categories.map(category => `
      <button class="filter-pill" data-category="${category}">${category}</button>
    `).join('');
    
    categoryFilterContainer.innerHTML += pillsHTML;
  } catch (error) {
    console.error('Failed to load categories list:', error);
  }
}

/**
 * Filter products in memory by search term, sort them, apply pagination, and render
 */
function applyFiltersAndSort() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const sortType = sortSelect.value;
  
  // 1. Apply Search Filter
  let filtered = currentProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );

  // 2. Apply Sort
  if (sortType === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // 3. Paginate Results
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Safety check to prevent page out of bounds
  if (currentPage > totalPages) {
    currentPage = Math.max(1, totalPages);
  }
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = filtered.slice(start, end);

  // 4. Render catalog and pagination elements
  renderProducts(paginatedItems);
  renderPagination(totalPages);
}

/**
 * Injects product HTML cards into DOM grid container
 * @param {Array} products - List of products to render
 */
function renderProducts(products) {
  productGrid.innerHTML = '';
  
  if (products.length === 0) {
    emptyResults.classList.remove('d-none');
    return;
  }
  
  emptyResults.classList.add('d-none');

  const cardsHTML = products.map(product => `
    <div class="product-card">
      <div class="product-card-img-container">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}" class="product-card-img" loading="lazy">
        </a>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${product.category}</span>
        <h3 class="product-card-title" title="${product.title}">${product.title}</h3>
        
        <div class="product-card-price-row">
          <span class="product-card-price">$${product.price.toFixed(2)}</span>
          <div class="d-flex align-items-center">
            <i class="bi bi-star-fill text-warning me-1 small"></i>
            <span class="small text-muted fw-bold">${product.rating ? product.rating.rate : '0.0'}</span>
          </div>
        </div>
        
        <div class="product-card-actions">
          <a href="product.html?id=${product.id}" class="btn btn-outline-custom btn-sm">
            <i class="bi bi-eye"></i> Details
          </a>
          <!-- Event delegation target with data-id attribute -->
          <button class="btn btn-primary-custom btn-sm btn-add-to-cart" data-id="${product.id}">
            <i class="bi bi-cart-plus"></i> + Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');

  productGrid.innerHTML = cardsHTML;
}

/**
 * Renders the pagination navigation list dynamically based on total pages count
 * @param {number} totalPages - Calculated total page count
 */
function renderPagination(totalPages) {
  if (!paginationContainer) return;
  
  // If there's 1 page or fewer, hide the pagination bar
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous Button
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
        <i class="bi bi-chevron-left"></i> Prev
      </a>
    </li>
  `;
  
  // Numeric Page Links
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }
  
  // Next Button
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
        Next <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;
  
  paginationContainer.innerHTML = html;
}

/**
 * Handle Add to Cart action inside the product grid container (Event Delegation)
 * @param {Event} e - Click Event
 */
function handleProductGridClick(e) {
  const addToCartBtn = e.target.closest('.btn-add-to-cart');
  
  if (addToCartBtn) {
    e.preventDefault();
    const productId = parseInt(addToCartBtn.getAttribute('data-id'), 10);
    // Find the product in the local array to pass down to Cart
    const product = currentProducts.find(p => p.id === productId);
    
    if (product) {
      Cart.addItem(product, 1);
    }
  }
}

/**
 * Sets up all event listeners on the Home page
 */
function setupEventListeners() {
  // Event delegation on category pills wrapper
  categoryFilterContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (pill) {
      document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
      pill.classList.add('active');
      
      const category = pill.getAttribute('data-category');
      loadProducts(category);
    }
  });

  // Search input listener (resets to page 1)
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    applyFiltersAndSort();
  });

  // Sorting selection listener (resets to page 1)
  sortSelect.addEventListener('change', () => {
    currentPage = 1;
    applyFiltersAndSort();
  });

  // Reset filters button listener
  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    sortSelect.value = 'default';
    currentPage = 1;
    applyFiltersAndSort();
  });

  // Event Delegation: Catalog cards click events (Add to Cart)
  productGrid.addEventListener('click', handleProductGridClick);

  // Event Delegation: Pagination links click events
  if (paginationContainer) {
    paginationContainer.addEventListener('click', (e) => {
      e.preventDefault();
      const pageLink = e.target.closest('.page-link');
      if (pageLink) {
        const parentLi = pageLink.parentElement;
        
        if (parentLi.classList.contains('disabled') || parentLi.classList.contains('active')) {
          return;
        }
        
        const targetPage = parseInt(pageLink.getAttribute('data-page'), 10);
        if (!isNaN(targetPage)) {
          currentPage = targetPage;
          
          const catalogEl = document.getElementById('catalog');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
          
          applyFiltersAndSort();
        }
      }
    });
  }
}

// Initializer execution
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadCategories();
  loadProducts('all');
});
