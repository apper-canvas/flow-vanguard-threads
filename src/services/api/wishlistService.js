import { addToCart } from "@/services/api/cartService";
const STORAGE_KEY = 'wishlist_items';

/**
 * Get all wishlist items from localStorage
 * @returns {Array} Array of wishlist items
 */
export const getWishlistItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
};

/**
 * Add item to wishlist
 * @param {Object} product - Product object to add
 */
export const addToWishlist = (product) => {
  try {
    const items = getWishlistItems();
    
    // Check if item already exists
    const existingIndex = items.findIndex(item => item.Id === product.Id);
    
    if (existingIndex === -1) {
      const wishlistItem = {
        Id: product.Id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: product.category,
        rating: product.rating,
        inStock: product.inStock,
        addedAt: new Date().toISOString()
      };
      
      items.push(wishlistItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      
      // Dispatch custom event for updates
      window.dispatchEvent(new CustomEvent('wishlist_updated'));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

/**
 * Remove item from wishlist
 * @param {number} productId - Product ID to remove
 */
export const removeFromWishlist = (productId) => {
  try {
    const items = getWishlistItems();
    const filteredItems = items.filter(item => item.Id !== productId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    
    // Dispatch custom event for updates
    window.dispatchEvent(new CustomEvent('wishlist_updated'));
    
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

/**
 * Check if product is in wishlist
 * @param {number} productId - Product ID to check
 * @returns {boolean}
 */
export const isInWishlist = (productId) => {
  const items = getWishlistItems();
  return items.some(item => item.Id === productId);
};

/**
 * Move item from wishlist to cart
 * @param {number} productId - Product ID to move
 * @param {Object} cartService - Cart service functions
 */
export const moveToCart = (productId, cartService) => {
  try {
    const items = getWishlistItems();
    const item = items.find(i => i.Id === productId);
    
    if (item) {
      // Add to cart with default values
      const cartItem = {
        productId: item.Id,
        name: item.name,
        price: item.price,
        quantity: 1,
        size: 'M', // Default size
        color: 'Black', // Default color
        image: item.images[0]
      };
      
      cartService.addToCart(cartItem);
      
      // Remove from wishlist
      removeFromWishlist(productId);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error moving to cart:', error);
    return false;
  }
};

/**
 * Clear all wishlist items
 */
export const clearWishlist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('wishlist_updated'));
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return false;
  }
};