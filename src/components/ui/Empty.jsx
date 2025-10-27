import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { Link } from "react-router-dom"

const Empty = ({ 
  title = "No items found", 
  description = "We couldn't find any items matching your criteria.",
  actionText = "Browse All Products",
  actionLink = "/shop",
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-light-gray p-6 rounded-full mb-6">
        <ApperIcon name={icon} size={48} className="text-medium-gray" />
      </div>
      <h3 className="text-xl font-display font-bold text-charcoal mb-2">
        {title}
      </h3>
      <p className="text-medium-gray mb-6 max-w-md">
        {description}
      </p>
      <Link to={actionLink} className="btn-primary">
        {actionText}
      </Link>
    </div>
  )
}

export default Empty