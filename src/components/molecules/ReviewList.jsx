import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Select from "@/components/atoms/Select"
import ReviewItem from "@/components/molecules/ReviewItem"
import Loading from "@/components/ui/Loading"
import { getReviews } from "@/services/api/reviewService"

const ReviewList = ({ productId, onFilterChange }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadReviews()
  }, [productId, filter, sortBy])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getReviews(
        productId,
        { rating: filter },
        sortBy
      )
      setReviews(data)
    } catch (error) {
      console.error("Failed to load reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (rating) => {
    setFilter(rating.toString())
    if (onFilterChange) {
      onFilterChange(rating)
    }
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-bronze text-white"
                : "bg-white text-charcoal border border-gray-300 hover:border-bronze"
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange(rating)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === rating.toString()
                  ? "bg-bronze text-white"
                  : "bg-white text-charcoal border border-gray-300 hover:border-bronze"
              }`}
            >
              {rating} ★
            </button>
          ))}
        </div>

        <Select value={sortBy} onChange={handleSortChange} className="w-48">
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </Select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-medium-gray">
            {filter === "all"
              ? "No reviews yet"
              : `No ${filter}-star reviews yet`}
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {reviews.map((review) => (
            <ReviewItem
              key={review.Id}
              review={review}
              onHelpfulClick={() => loadReviews()}
            />
          ))}
        </motion.div>
      )}

      {reviews.length > 0 && (
        <p className="text-center text-sm text-medium-gray">
          Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          {filter !== "all" && ` with ${filter} star${filter !== "1" ? "s" : ""}`}
        </p>
      )}
    </div>
  )
}

export default ReviewList