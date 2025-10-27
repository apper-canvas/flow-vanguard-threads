import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="bg-charcoal/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" size={64} className="text-charcoal/50" />
            </div>
            <h1 className="text-6xl font-display font-bold text-charcoal mb-2">404</h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-charcoal mb-3">
              Page Not Found
            </h2>
            <p className="text-medium-gray leading-relaxed">
              The page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button size="lg" className="w-full">
              <Link to="/" className="flex items-center justify-center gap-2">
                <ApperIcon name="Home" size={20} />
                Go Home
              </Link>
            </Button>
            
            <Button variant="secondary" size="lg" className="w-full">
              <Link to="/shop" className="flex items-center justify-center gap-2">
                <ApperIcon name="ShoppingBag" size={20} />
                Shop Collection
              </Link>
            </Button>
          </div>

          {/* Popular Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-medium-gray mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/shop/shirts" className="text-bronze hover:text-bronze/80 transition-colors">
                Shirts
              </Link>
              <Link to="/shop/pants" className="text-bronze hover:text-bronze/80 transition-colors">
                Pants
              </Link>
              <Link to="/shop/jackets" className="text-bronze hover:text-bronze/80 transition-colors">
                Jackets
              </Link>
              <Link to="/shop?sale=true" className="text-bronze hover:text-bronze/80 transition-colors">
                Sale
              </Link>
              <Link to="/size-guide" className="text-bronze hover:text-bronze/80 transition-colors">
                Size Guide
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound