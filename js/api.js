/**
 * ShopLite API Service
 * Interacts with Fake Store API endpoints
 * Uses async/await with robust try/catch block error handling
 */

const API_BASE_URL = 'https://fakestoreapi.com';

const API = {
  /**
   * Helper function to perform fetch requests
   * @param {string} endpoint - API endpoint relative to base URL
   * @returns {Promise<any>} Response JSON data
   */
  async request(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      // If the HTTP response status is not in the 200-299 range, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Fetch Error [${endpoint}]:`, error);
      throw error; // Re-throw to allow component-level handling (e.g. hiding skeletons, showing alerts)
    }
  },

  /**
   * Fetch all products
   * @returns {Promise<Array>} List of product objects
   */
  async getProducts() {
    return await this.request('/products');
  },

  /**
   * Fetch a single product by its unique numerical ID
   * @param {number|string} id - Product ID
   * @returns {Promise<Object>} Single product data
   */
  async getProductById(id) {
    return await this.request(`/products/${id}`);
  },

  /**
   * Fetch all product categories
   * @returns {Promise<Array<string>>} List of category names
   */
  async getCategories() {
    return await this.request('/products/categories');
  },

  /**
   * Fetch products belonging to a specific category
   * @param {string} categoryName - Name of the category
   * @returns {Promise<Array>} List of products in category
   */
  async getProductsByCategory(categoryName) {
    // Encodes characters like spaces in category names (e.g., "men's clothing")
    const encodedCategory = encodeURIComponent(categoryName);
    return await this.request(`/products/category/${encodedCategory}`);
  }
};
