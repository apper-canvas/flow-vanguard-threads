const CART_STORAGE_KEY = "cart_items"

export const getCartItems = () => {
  try {
    const items = localStorage.getItem(CART_STORAGE_KEY)
    return items ? JSON.parse(items) : []
  } catch (error) {
    console.error("Error loading cart items:", error)
    return []
  }
}

export const addToCart = (item) => {
  try {
    const cartItems = getCartItems()
    const existingItemIndex = cartItems.findIndex(
      cartItem => 
        cartItem.productId === item.productId && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    )
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += item.quantity
    } else {
      cartItems.push(item)
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    return cartItems
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw new Error("Failed to add item to cart")
  }
}

export const updateCartItem = (productId, updates) => {
  try {
    const cartItems = getCartItems()
    const itemIndex = cartItems.findIndex(item => item.productId === productId)
    
    if (itemIndex >= 0) {
      cartItems[itemIndex] = { ...cartItems[itemIndex], ...updates }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }
    
    return cartItems
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw new Error("Failed to update cart item")
  }
}

export const removeFromCart = (productId) => {
  try {
    const cartItems = getCartItems()
    const filteredItems = cartItems.filter(item => item.productId !== productId)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems))
    return filteredItems
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw new Error("Failed to remove item from cart")
  }
}

export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
    return []
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw new Error("Failed to clear cart")
  }
}

export const getCartTotal = () => {
  const items = getCartItems()
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const getCartItemCount = () => {
  const items = getCartItems()
  return items.reduce((count, item) => count + item.quantity, 0)
}