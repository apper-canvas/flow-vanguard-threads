import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-bronze to-white rounded-sm"></div>
              <span className="font-display font-bold text-xl">Vanguard Threads</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium men's apparel for the modern gentleman. Crafted with attention to detail and designed for confidence.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-white/10 rounded-full hover:bg-bronze transition-colors">
                <ApperIcon name="Facebook" size={16} />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-bronze transition-colors">
                <ApperIcon name="Instagram" size={16} />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-bronze transition-colors">
                <ApperIcon name="Twitter" size={16} />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-bronze transition-colors">
                <ApperIcon name="Youtube" size={16} />
              </button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop/shirts" className="text-gray-300 hover:text-bronze transition-colors text-sm">Shirts</Link></li>
              <li><Link to="/shop/pants" className="text-gray-300 hover:text-bronze transition-colors text-sm">Pants</Link></li>
              <li><Link to="/shop/jackets" className="text-gray-300 hover:text-bronze transition-colors text-sm">Jackets</Link></li>
              <li><Link to="/shop/accessories" className="text-gray-300 hover:text-bronze transition-colors text-sm">Accessories</Link></li>
              <li><Link to="/shop?sale=true" className="text-bronze hover:text-bronze/80 transition-colors text-sm">Sale Items</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="/size-guide" className="text-gray-300 hover:text-bronze transition-colors text-sm">Size Guide</Link></li>
              <li><button className="text-gray-300 hover:text-bronze transition-colors text-sm text-left">Contact Us</button></li>
              <li><button className="text-gray-300 hover:text-bronze transition-colors text-sm text-left">Shipping Info</button></li>
              <li><button className="text-gray-300 hover:text-bronze transition-colors text-sm text-left">Returns</button></li>
              <li><button className="text-gray-300 hover:text-bronze transition-colors text-sm text-left">FAQ</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest updates on new arrivals and exclusive offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze"
              />
              <button
                type="submit"
                className="w-full bg-bronze hover:bg-bronze/90 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2024 Vanguard Threads. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-bronze transition-colors text-sm">Privacy Policy</button>
            <button className="text-gray-400 hover:text-bronze transition-colors text-sm">Terms of Service</button>
            <button className="text-gray-400 hover:text-bronze transition-colors text-sm">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer