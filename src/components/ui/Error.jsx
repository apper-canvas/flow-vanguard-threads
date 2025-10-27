import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-error/10 p-4 rounded-full mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </div>
      <h3 className="text-xl font-display font-bold text-charcoal mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-medium-gray mb-6 max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </button>
      )}
    </div>
  )
}

export default Error