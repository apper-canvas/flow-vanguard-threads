import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { toggleHelpful } from "@/services/api/reviewService"

const ReviewItem = ({ review, onHelpfulClick }) => {
  const [helpful, setHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0)

  const handleHelpfulClick = async () => {
    if (helpful) {
      toast.info("You already marked this review as helpful")
      return
    }

    try {
      const updated = await toggleHelpful(review.Id, 999)
      setHelpfulCount(updated.helpfulCount)
      setHelpful(true)
      toast.success("Thank you for your feedback!")
      
      if (onHelpfulClick) {
        onHelpfulClick(review.Id)
      }
    } catch (error) {
      toast.error("Failed to mark as helpful")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-charcoal">{review.userName}</h4>
            {review.verifiedPurchase && (
              <Badge variant="success" size="sm">
                Verified Purchase
              </Badge>
            )}
          </div>
          <p className="text-sm text-medium-gray">{formatDate(review.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <ApperIcon
              key={i}
              name="Star"
              size={16}
              className={
                i < review.rating ? "text-warning fill-current" : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      <p className="text-charcoal leading-relaxed mb-4">{review.comment}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleHelpfulClick}
          disabled={helpful}
          className={`flex items-center gap-2 text-sm transition-colors ${
            helpful
              ? "text-medium-gray cursor-not-allowed"
              : "text-charcoal hover:text-bronze"
          }`}
        >
          <ApperIcon name="ThumbsUp" size={16} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ReviewItem