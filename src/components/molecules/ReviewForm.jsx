import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { createReview } from "@/services/api/reviewService"

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters")
      return
    }

    if (!userName.trim()) {
      toast.error("Please enter your name")
      return
    }

    try {
      setSubmitting(true)
      await createReview({
        productId,
        rating,
        comment: comment.trim(),
        userName: userName.trim(),
        verifiedPurchase: false
      })

      toast.success("Review submitted successfully!")
      
      // Reset form
      setRating(0)
      setComment("")
      setUserName("")
      
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 border border-gray-200"
    >
      <h3 className="font-display font-bold text-lg text-charcoal mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selector */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <ApperIcon
                  name="Star"
                  size={32}
                  className={
                    star <= (hoverRating || rating)
                      ? "text-warning fill-current"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-medium-gray">
                {rating} star{rating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze"
            placeholder="Enter your name"
            maxLength={50}
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze resize-none"
            rows={4}
            placeholder="Share your thoughts about this product..."
            maxLength={500}
          />
          <div className="text-right text-sm text-medium-gray mt-1">
            {comment.length}/500
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </motion.div>
  )
}

export default ReviewForm