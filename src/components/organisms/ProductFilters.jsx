import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import FilterSection from "@/components/molecules/FilterSection"
import Button from "@/components/atoms/Button"

const ProductFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isVisible = true,
  onClose 
}) => {
  const categories = ["shirts", "pants", "jackets", "accessories"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Navy", code: "#1f2937" },
    { name: "Gray", code: "#6b7280" },
    { name: "Blue", code: "#3b82f6" },
    { name: "Brown", code: "#92400e" },
    { name: "Green", code: "#059669" },
    { name: "Red", code: "#dc2626" }
  ]

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size]
    
    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const handleColorChange = (colorName) => {
    const newColors = filters.colors.includes(colorName)
      ? filters.colors.filter(c => c !== colorName)
      : [...filters.colors, colorName]
    
    onFiltersChange({ ...filters, colors: newColors })
  }

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: Math.max(0, parseInt(value) || 0)
      }
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ 
        x: isVisible ? 0 : -300, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-charcoal">Filters</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-medium-gray hover:text-charcoal transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <FilterSection title="Category">
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-bronze border-gray-300 rounded focus:ring-bronze focus:ring-2"
                />
                <span className="text-sm text-charcoal capitalize">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-medium-gray mb-1">Min</label>
                <input
                  type="number"
                  value={filters.priceRange.min || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze"
                />
              </div>
              <div>
                <label className="block text-xs text-medium-gray mb-1">Max</label>
                <input
                  type="number"
                  value={filters.priceRange.max === 1000 ? "" : filters.priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value || "1000")}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Size Filter */}
        <FilterSection title="Size">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`py-2 px-3 border rounded-md text-sm font-medium transition-all duration-160 ${
                  filters.sizes.includes(size)
                    ? "border-bronze bg-bronze text-white"
                    : "border-gray-300 text-charcoal hover:border-bronze hover:text-bronze"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Color Filter */}
        <FilterSection title="Color">
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`relative w-12 h-12 rounded-full border-2 transition-all duration-160 ${
                  filters.colors.includes(color.name)
                    ? "border-bronze scale-110"
                    : "border-gray-300 hover:border-bronze"
                }`}
                style={{ backgroundColor: color.code }}
                title={color.name}
              >
                {filters.colors.includes(color.name) && (
                  <ApperIcon 
                    name="Check" 
                    size={16} 
                    className={`absolute inset-0 m-auto ${
                      color.name === "White" ? "text-charcoal" : "text-white"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </motion.div>
  )
}

export default ProductFilters