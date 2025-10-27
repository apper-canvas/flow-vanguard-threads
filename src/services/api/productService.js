import products from "@/services/mockData/products.json"

const DELAY = 300 // ms

export const getProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  return [...products]
}

export const getProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  const product = products.find(p => p.Id === id)
  if (!product) {
    throw new Error("Product not found")
  }
  // Return product with review data that will be loaded separately
  return { ...product }
}

export const getProductsByCategory = async (category) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export const searchProducts = async (query) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  const searchTerm = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  )
}