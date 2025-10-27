import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { addToWishlist, checkIsInWishlist, isInWishlist, removeFromWishlist } from "@/services/api/wishlistService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
 
export function ProductCard({ product, onWishlistToggle }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setIsInWishlist(checkIsInWishlist(product.id));
    };
    
    // Initialize wishlist state
    handleWishlistUpdate();
    
    window.addEventListener('wishlist_updated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlist_updated', handleWishlistUpdate);
    };
  }, [product.id]);
  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
if (isInWishlist) {
      removeFromWishlist(product.id);
      setIsInWishlist(false);
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      setIsInWishlist(true);
      toast.success(`Added ${product.name} to wishlist`);
    }
 
    if (onWishlistToggle) {
      onWishlistToggle(product.id, !isInWishlist);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -4 }}
className="product-card bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-120 ease-out group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-sm">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <Badge 
              variant="sale" 
              size="sm" 
              className="absolute top-2 left-2"
            >
              -{discountPercentage}%
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}
<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleWishlistClick(e, product)}
              className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Add to wishlist"
            >
              <ApperIcon 
                name="Heart" 
                size={16} 
                className={isInWishlist ? "text-error fill-error" : "text-charcoal"}
              />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-display font-bold text-charcoal mb-1 group-hover:text-bronze transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-medium-gray mb-2 capitalize">{product.category}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <ApperIcon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-sm text-medium-gray">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-bronze">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard