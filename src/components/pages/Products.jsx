import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ProductGrid from "@/components/organisms/ProductGrid"
import ProductFilters from "@/components/organisms/ProductFilters"
import { getProducts } from "@/services/api/productService"

const Products = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    categories: category ? [category] : [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 1000 }
  })
  
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, sortBy, searchParams])

  useEffect(() => {
    // Update filters based on URL params
    const newFilters = { ...filters }
    
    if (category && !newFilters.categories.includes(category)) {
      newFilters.categories = [category]
    }
    
    const subcategory = searchParams.get("subcategory")
    const search = searchParams.get("search")
    const sale = searchParams.get("sale")
    const sort = searchParams.get("sort")
    
    if (sort) {
      setSortBy(sort === "newest" ? "newest" : sort)
    }
    
    setFilters(newFilters)
  }, [category, searchParams])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]
    
    // Search filter
    const search = searchParams.get("search")
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      )
    }
    
    // Subcategory filter
    const subcategory = searchParams.get("subcategory")
    if (subcategory) {
      filtered = filtered.filter(product => 
        product.subcategory?.toLowerCase().includes(subcategory.toLowerCase())
      )
    }
    
    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes.some(size => filters.sizes.includes(size))
      )
    }
    
    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors.some(color => filters.colors.includes(color.name))
      )
    }
    
    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    )
    
    // Sale filter
    const sale = searchParams.get("sale")
    if (sale === "true") {
      filtered = filtered.filter(product => product.originalPrice > product.price)
    }
    
    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => b.Id - a.Id)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for "featured"
        break
    }
    
    setFilteredProducts(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      categories: category ? [category] : [],
      sizes: [],
      colors: [],
      priceRange: { min: 0, max: 1000 }
    })
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.delete("search")
      newParams.delete("subcategory")
      newParams.delete("sale")
      return newParams
    })
  }

  const getPageTitle = () => {
    const search = searchParams.get("search")
    const sale = searchParams.get("sale")
    
    if (search) return `Search results for "${search}"`
    if (sale === "true") return "Sale Items"
    if (category) return category.charAt(0).toUpperCase() + category.slice(1)
    return "All Products"
  }

  const getResultsText = () => {
    const total = filteredProducts.length
    if (total === 0) return "No products found"
    if (total === 1) return "1 product"
    return `${total} products`
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-2">
            {getPageTitle()}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-medium-gray">{getResultsText()}</p>
            
            <div className="flex items-center gap-4">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-48"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <ApperIcon name="Filter" size={16} />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products