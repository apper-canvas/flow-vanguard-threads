import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { clearCart, getCartItems, removeFromCart, updateCartItem } from "@/services/api/cartService";

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    const items = getCartItems()
    setCartItems(items)
  }

const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return
    
    try {
      updateCartItem(productId, { quantity: newQuantity })
      loadCartItems()
      window.dispatchEvent(new window.CustomEvent('cart_updated'))
      toast.success("Cart updated")
    } catch (error) {
      toast.error("Failed to update cart")
    }
  }

const handleRemoveItem = async (productId) => {
    try {
      removeFromCart(productId)
      loadCartItems()
      window.dispatchEvent(new window.CustomEvent('cart_updated'))
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

const handleClearCart = () => {
    clearCart()
    loadCartItems()
    window.dispatchEvent(new window.CustomEvent('cart_updated'))
    toast.success("Cart cleared")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
            actionText="Continue Shopping"
            actionLink="/shop"
            icon="ShoppingCart"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">
            Shopping Cart
          </h1>
          <Button
            variant="ghost"
            onClick={handleClearCart}
            className="text-error hover:text-error/80"
          >
            <ApperIcon name="Trash2" size={16} />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-bronze hover:text-bronze/80 transition-colors font-medium"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 h-fit"
          >
            <h2 className="text-xl font-display font-bold text-charcoal mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-medium-gray">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-medium-gray">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-medium-gray">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-charcoal">
                  <span>Total</span>
                  <span className="text-bronze">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {subtotal < 100 && (
              <div className="mb-6 p-3 bg-bronze/10 border border-bronze/20 rounded-md">
                <p className="text-sm text-bronze">
                  <ApperIcon name="Truck" size={16} className="inline mr-1" />
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            <Button
              size="lg"
              onClick={() => navigate("/checkout")}
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="Lock" size={20} />
                  Secure Checkout
                </>
              )}
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-medium-gray">
                <ApperIcon name="Shield" size={16} className="text-success" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart