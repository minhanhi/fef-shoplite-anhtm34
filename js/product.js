/**
 * ShopLite Product Detail Page Controller
 * Retrieves search parameter ID, fetches details from API, renders,
 * and enables quantity adjustment and addition to cart
 */

// Local page state
let activeProduct = null;

// DOM Element References
const productLoading = document.getElementById('productLoading');
const productError = document.getElementById('productError');
const productDetails = document.getElementById('productDetails');

const productImage = document.getElementById('productImage');
const productCategory = document.getElementById('productCategory');
const productTitle = document.getElementById('productTitle');
const starRating = document.getElementById('starRating');
const ratingText = document.getElementById('ratingText');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');

const btnQtyMinus = document.getElementById('btnQtyMinus');
const btnQtyPlus = document.getElementById('btnQtyPlus');
const qtyInput = document.getElementById('qtyInput');
const btnAddToCart = document.getElementById('btnAddToCart');

/**
 * Extracts and returns the product ID parameter from URL search query
 * @returns {string|null} Product ID or null if not found
 */
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Converts a numerical rate (0 to 5) into HTML star elements
 * @param {number} rate - Rating value out of 5
 * @returns {string} Bootstrap star icon markup
 */
function generateStarMarkup(rate) {
  const roundedRate = Math.round(rate);
  let markup = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRate) {
      markup += '<i class="bi bi-star-fill text-warning fs-5 me-1"></i>';
    } else {
      markup += '<i class="bi bi-star text-secondary opacity-50 fs-5 me-1"></i>';
    }
  }
  return markup;
}

/**
 * Renders the product details in the page placeholders
 * @param {Object} product - Product details object
 */
function renderProductDetail(product) {
  productImage.src = product.image;
  productImage.alt = product.title;
  productCategory.textContent = product.category;
  productTitle.textContent = product.title;
  productPrice.textContent = `$${product.price.toFixed(2)}`;
  productDescription.textContent = product.description;
  
  // Update document title for SEO and user tab visibility
  document.title = `ShopLite | ${product.title}`;

  // Handle rating if available in the API response object
  if (product.rating) {
    starRating.innerHTML = generateStarMarkup(product.rating.rate);
    ratingText.textContent = `(${product.rating.rate} / 5 based on ${product.rating.count} reviews)`;
  } else {
    starRating.innerHTML = generateStarMarkup(0);
    ratingText.textContent = `(No ratings yet)`;
  }

  // Toggle visual wrappers
  productLoading.classList.add('d-none');
  productDetails.classList.remove('d-none');
}

/**
 * Initiates product detail loader flow
 */
async function loadProductDetails() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    showErrorState();
    return;
  }

  try {
    activeProduct = await API.getProductById(productId);
    
    // Check if item is null or empty
    if (!activeProduct || !activeProduct.id) {
      showErrorState();
      return;
    }
    
    renderProductDetail(activeProduct);
  } catch (error) {
    showErrorState();
  }
}

/**
 * Displays product details error state and hides loader
 */
function showErrorState() {
  productLoading.classList.add('d-none');
  productDetails.classList.add('d-none');
  productError.classList.remove('d-none');
}

/**
 * Bind page interaction events
 */
function setupEventListeners() {
  // Quantity Minus Button Click
  btnQtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value, 10);
    if (!isNaN(val) && val > 1) {
      qtyInput.value = val - 1;
    }
  });

  // Quantity Plus Button Click
  btnQtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value, 10);
    if (!isNaN(val) && val < 20) { // Limit to maximum 20 items per cart action
      qtyInput.value = val + 1;
    }
  });

  // Direct manual numeric input validation
  qtyInput.addEventListener('change', () => {
    let val = parseInt(qtyInput.value, 10);
    if (isNaN(val) || val < 1) {
      qtyInput.value = 1;
    } else if (val > 20) {
      qtyInput.value = 20;
    }
  });

  // Add to Cart Action
  btnAddToCart.addEventListener('click', () => {
    if (activeProduct) {
      const quantity = parseInt(qtyInput.value, 10);
      Cart.addItem(activeProduct, quantity);
    }
  });
}

// Initializer execution
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadProductDetails();
});
