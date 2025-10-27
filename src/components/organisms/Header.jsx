import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import { getCartItems } from "@/services/api/cartService"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const updateCartCount = () => {
      const items = getCartItems()
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)
    }
    
    updateCartCount()
    
    // Listen for cart updates
    const handleStorageChange = (e) => {
      if (e.key === 'cart_items') {
        updateCartCount()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart_updated', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cart_updated', updateCartCount)
    }
  }, [])

  const categories = [
    { name: "Shirts", path: "/shop/shirts", subcategories: ["Dress Shirts", "Casual Shirts", "Polo Shirts", "T-Shirts"] },
    { name: "Pants", path: "/shop/pants", subcategories: ["Dress Pants", "Chinos", "Jeans", "Shorts"] },
    { name: "Jackets", path: "/shop/jackets", subcategories: ["Blazers", "Coats", "Casual Jackets", "Vests"] },
    { name: "Accessories", path: "/shop/accessories", subcategories: ["Ties", "Belts", "Watches", "Wallets"] }
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-charcoal to-bronze rounded-sm"></div>
            <span className="font-display font-bold text-xl text-charcoal">Vanguard Threads</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  to={category.path}
                  className="text-charcoal hover:text-bronze transition-colors font-medium"
                >
                  {category.name}
                </Link>
                
                {/* Mega Menu */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white shadow-lg border border-gray-100 rounded-md p-4 min-w-48">
                    <div className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`${category.path}?subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-3 py-2 text-sm text-medium-gray hover:text-bronze hover:bg-light-gray rounded-sm transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link
              to="/shop?sale=true"
              className="text-error hover:text-error/80 transition-colors font-medium"
            >
              Sale
            </Link>
            
            <Link
              to="/size-guide"
              className="text-charcoal hover:text-bronze transition-colors font-medium"
            >
              Size Guide
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-charcoal hover:text-bronze transition-colors">
              <ApperIcon name="Heart" size={20} />
            </button>
            
            <Link 
              to="/cart" 
              className="relative p-2 text-charcoal hover:text-bronze transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-bronze text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium cart-badge-pulse"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-bronze transition-colors"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    to={category.path}
                    className="block py-2 text-charcoal hover:text-bronze transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <div className="ml-4 space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        to={`${category.path}?subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-1 text-sm text-medium-gray hover:text-bronze transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <Link
                to="/shop?sale=true"
                className="block py-2 text-error hover:text-error/80 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sale
              </Link>
              
              <Link
                to="/size-guide"
                className="block py-2 text-charcoal hover:text-bronze transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Size Guide
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header