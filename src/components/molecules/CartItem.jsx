import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-sm shadow-sm">
      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-24 object-cover rounded-sm"
        />
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link 
          to={`/product/${item.productId}`}
          className="font-display font-bold text-charcoal hover:text-bronze transition-colors line-clamp-2 mb-1"
        >
          {item.name}
        </Link>
        
        <div className="text-sm text-medium-gray space-y-1 mb-3">
          <div>Size: {item.size}</div>
          <div>Color: {item.color}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-bronze">${(item.price * item.quantity).toFixed(2)}</div>
            <button
              onClick={() => onRemove(item.productId)}
              className="text-sm text-error hover:text-error/80 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem