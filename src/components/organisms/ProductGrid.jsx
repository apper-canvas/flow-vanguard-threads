import React from "react"
import { motion } from "framer-motion"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const ProductGrid = ({ products, loading, error, onRetry }) => {
  if (loading) {
    return <Loading variant="grid" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        showRetry={!!onRetry}
      />
    )
  }

  if (!products || products.length === 0) {
    return (
      <Empty 
        title="No products found"
        description="We couldn't find any products matching your criteria. Try adjusting your filters or browse our full collection."
        actionText="Browse All Products"
        actionLink="/shop"
        icon="Package"
      />
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.Id} product={product} />
      ))}
    </motion.div>
  )
}

export default ProductGrid