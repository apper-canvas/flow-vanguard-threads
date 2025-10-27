import React from "react"
import { cn } from "@/utils/cn"

const SizeSelector = ({ sizes, selectedSize, onSizeSelect, availableSizes = [] }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-charcoal">Size</h3>
        <button className="text-sm text-bronze hover:text-bronze/80 underline">
          Size Guide
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => {
          const isAvailable = availableSizes.length === 0 || availableSizes.includes(size)
          const isSelected = selectedSize === size
          
          return (
            <button
              key={size}
              onClick={() => isAvailable && onSizeSelect(size)}
              disabled={!isAvailable}
              className={cn(
                "py-2 px-3 border rounded-md text-sm font-medium transition-all duration-160",
                "focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2",
                isSelected && isAvailable && "border-bronze bg-bronze text-white",
                !isSelected && isAvailable && "border-gray-300 hover:border-bronze hover:text-bronze",
                !isAvailable && "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SizeSelector