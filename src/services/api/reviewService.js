import reviewsData from "@/services/mockData/reviews.json"

const DELAY = 500
const STORAGE_KEY = "vanguard_reviews"

// Load reviews from localStorage or use default data
const loadReviews = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : [...reviewsData]
  } catch {
    return [...reviewsData]
  }
}

// Save reviews to localStorage
const saveReviews = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch (error) {
    console.error("Failed to save reviews:", error)
  }
}

let reviews = loadReviews()

// Get all reviews for a product with optional filtering and sorting
export const getReviews = async (productId, filters = {}, sortBy = "newest") => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  let filtered = reviews.filter(r => r.productId === productId)
  
  // Apply rating filter
  if (filters.rating && filters.rating !== "all") {
    filtered = filtered.filter(r => r.rating === parseInt(filters.rating))
  }
  
  // Apply sorting
  switch (sortBy) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case "highest":
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case "lowest":
      filtered.sort((a, b) => a.rating - b.rating)
      break
    case "helpful":
      filtered.sort((a, b) => b.helpfulCount - a.helpfulCount)
      break
    default:
      break
  }
  
  return filtered.map(r => ({ ...r }))
}

// Get single review by ID
export const getReviewById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  const review = reviews.find(r => r.Id === id)
  if (!review) {
    throw new Error("Review not found")
  }
  return { ...review }
}

// Create new review
export const createReview = async (reviewData) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  // Validation
  if (!reviewData.productId) {
    throw new Error("Product ID is required")
  }
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("Rating must be between 1 and 5")
  }
  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    throw new Error("Review comment must be at least 10 characters")
  }
  
  const newReview = {
    Id: Math.max(0, ...reviews.map(r => r.Id)) + 1,
    productId: reviewData.productId,
    userId: reviewData.userId || 999,
    userName: reviewData.userName || "Anonymous",
    rating: reviewData.rating,
    comment: reviewData.comment.trim(),
    verifiedPurchase: reviewData.verifiedPurchase || false,
    helpfulCount: 0,
    createdAt: new Date().toISOString()
  }
  
  reviews = [...reviews, newReview]
  saveReviews(reviews)
  
  return { ...newReview }
}

// Update existing review
export const updateReview = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  const index = reviews.findIndex(r => r.Id === id)
  if (index === -1) {
    throw new Error("Review not found")
  }
  
  const updatedReview = {
    ...reviews[index],
    ...data,
    Id: reviews[index].Id,
    createdAt: reviews[index].createdAt
  }
  
  reviews = [
    ...reviews.slice(0, index),
    updatedReview,
    ...reviews.slice(index + 1)
  ]
  saveReviews(reviews)
  
  return { ...updatedReview }
}

// Delete review
export const deleteReview = async (id) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  const index = reviews.findIndex(r => r.Id === id)
  if (index === -1) {
    throw new Error("Review not found")
  }
  
  reviews = reviews.filter(r => r.Id !== id)
  saveReviews(reviews)
}

// Toggle helpful vote
export const toggleHelpful = async (reviewId, userId) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  const index = reviews.findIndex(r => r.Id === reviewId)
  if (index === -1) {
    throw new Error("Review not found")
  }
  
  // Simple implementation - just increment count
  // In real app, would track which users voted
  reviews[index] = {
    ...reviews[index],
    helpfulCount: reviews[index].helpfulCount + 1
  }
  saveReviews(reviews)
  
  return { ...reviews[index] }
}

// Get review statistics for a product
export const getReviewStats = async (productId) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  const productReviews = reviews.filter(r => r.productId === productId)
  
  if (productReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let totalRating = 0
  
  productReviews.forEach(review => {
    distribution[review.rating]++
    totalRating += review.rating
  })
  
  return {
    averageRating: (totalRating / productReviews.length).toFixed(1),
    totalReviews: productReviews.length,
    distribution
  }
}