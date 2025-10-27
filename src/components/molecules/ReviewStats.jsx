import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ReviewStats = ({ stats, onFilterByRating }) => {
  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-medium-gray">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  const { averageRating, totalReviews, distribution } = stats

  const getPercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
          <div className="text-5xl font-bold text-charcoal mb-2">{averageRating}</div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                size={20}
                className={
                  i < Math.floor(averageRating)
                    ? "text-warning fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-sm text-medium-gray">{totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating] || 0
            const percentage = getPercentage(count)
            
            return (
              <button
                key={rating}
                onClick={() => onFilterByRating && onFilterByRating(rating)}
                className="w-full flex items-center gap-3 hover:bg-light-gray p-2 rounded transition-colors group"
              >
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-charcoal">{rating}</span>
                  <ApperIcon
                    name="Star"
                    size={14}
                    className="text-warning fill-current"
                  />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning transition-all duration-300 group-hover:bg-bronze"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-medium-gray w-12 text-right">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ReviewStats