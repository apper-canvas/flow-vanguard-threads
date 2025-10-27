import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SizeSelector from "@/components/molecules/SizeSelector";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getProductById, getProducts } from "@/services/api/productService";
import { addToCart } from "@/services/api/cartService";

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const productData = await getProductById(parseInt(id))
      setProduct(productData)
      
      if (productData.colors.length > 0) {
        setSelectedColor(productData.colors[0].name)
      }
      
      // Load related products
      const allProducts = await getProducts()
      const related = allProducts
        .filter(p => p.Id !== productData.Id && p.category === productData.category)
        .slice(0, 4)
      setRelatedProducts(related)
      
    } catch (err) {
      setError("Product not found or failed to load.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    
    if (!selectedColor) {
      toast.error("Please select a color")
      return
    }
    
    const cartItem = {
      productId: product.Id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]
}
    
    addToCart(cartItem)
    toast.success(`Added ${product.name} to cart`)
    
    // Trigger cart update event
    // eslint-disable-next-line no-undef
    window.dispatchEvent(new CustomEvent('cart_updated'))
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading variant="product" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error 
            message={error || "Product not found"}
            onRetry={loadProduct}
          />
        </div>
      </div>
    )
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-medium-gray mb-8">
          <button onClick={() => navigate("/")} className="hover:text-bronze transition-colors">
            Home
          </button>
          <ApperIcon name="ChevronRight" size={14} />
          <button 
            onClick={() => navigate(`/shop/${product.category}`)} 
            className="hover:text-bronze transition-colors capitalize"
          >
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-charcoal font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? "border-bronze shadow-md" 
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">
                  {product.name}
                </h1>
                <button className="p-2 text-charcoal hover:text-bronze transition-colors">
                  <ApperIcon name="Heart" size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon 
                        key={i}
                        name="Star" 
                        size={16} 
                        className={i < Math.floor(product.rating) ? "text-warning fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-medium-gray">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                {!product.inStock && (
                  <Badge variant="error">Out of Stock</Badge>
                )}
                
                {discountPercentage > 0 && (
                  <Badge variant="sale">-{discountPercentage}%</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-bronze">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-medium-gray leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-charcoal">
                Color: {selectedColor}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.name
                        ? "border-bronze scale-110"
                        : "border-gray-300 hover:border-bronze"
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
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
            </div>

            {/* Size Selection */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
              availableSizes={product.sizes}
            />

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-charcoal">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <ApperIcon name="Minus" size={16} />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ApperIcon name="ShoppingCart" size={20} />
                  Add to Cart
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              {!product.inStock && (
                <p className="text-sm text-error text-center">
                  This item is currently out of stock
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-charcoal">Material:</span>
                  <p className="text-medium-gray">{product.material}</p>
                </div>
                <div>
                  <span className="font-medium text-charcoal">Category:</span>
                  <p className="text-medium-gray capitalize">{product.category}</p>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-charcoal">Care Instructions:</span>
                <p className="text-medium-gray text-sm mt-1">{product.careInstructions}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-charcoal mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.Id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail