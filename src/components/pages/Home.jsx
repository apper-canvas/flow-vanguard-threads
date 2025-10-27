import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import { getProducts } from "@/services/api/productService"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const products = await getProducts()
        
        // Get featured products (first 4)
        setFeaturedProducts(products.slice(0, 4))
        
        // Get new arrivals (last 8)
        setNewArrivals(products.slice(-8))
        
        setLoading(false)
      } catch (error) {
        console.error("Error loading home data:", error)
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const categories = [
    {
      name: "Dress Shirts",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&auto=format",
      link: "/shop/shirts?subcategory=dress-shirts"
    },
    {
      name: "Casual Wear",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&auto=format",
      link: "/shop/shirts?subcategory=casual-shirts"
    },
    {
      name: "Blazers",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format",
      link: "/shop/jackets?subcategory=blazers"
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format",
      link: "/shop/accessories"
    }
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-charcoal to-medium-gray text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="bronze" size="sm">New Collection</Badge>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                  Elevate Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white"> Style</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-md">
                  Discover premium men's apparel crafted for the modern gentleman. Where sophistication meets contemporary design.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-bronze hover:bg-bronze/90 text-white">
                  <Link to="/shop" className="flex items-center gap-2">
                    Shop Collection
                    <ApperIcon name="ArrowRight" size={18} />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                  <Link to="/size-guide" className="flex items-center gap-2">
                    Size Guide
                    <ApperIcon name="Ruler" size={18} />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&auto=format"
                  alt="Premium menswear"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-bronze text-white p-6 rounded-lg shadow-xl">
                <div className="text-2xl font-display font-bold">50+</div>
                <div className="text-sm">Premium Styles</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-medium-gray max-w-2xl mx-auto">
              Explore our curated collection of premium men's apparel, designed for every occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link to={category.link} className="block">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl font-display font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-bronze group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">Shop Now</span>
                        <ApperIcon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-medium-gray max-w-2xl mx-auto">
              Handpicked essentials that define contemporary masculine style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg">
              <Link to="/shop" className="flex items-center gap-2">
                View All Products
                <ApperIcon name="ArrowRight" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-2">
                New Arrivals
              </h2>
              <p className="text-lg text-medium-gray">
                Latest additions to our premium collection.
              </p>
            </div>
            <Link
              to="/shop?sort=newest"
              className="hidden sm:flex items-center gap-2 text-bronze hover:text-bronze/80 transition-colors font-medium"
            >
              View All
              <ApperIcon name="ArrowRight" size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button>
              <Link to="/shop?sort=newest" className="flex items-center gap-2">
                View All New Arrivals
                <ApperIcon name="ArrowRight" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-charcoal to-bronze">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              Join the Vanguard Community
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Be the first to know about new collections, exclusive offers, and styling tips from our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-charcoal hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home