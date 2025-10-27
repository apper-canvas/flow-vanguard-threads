import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-charcoal text-white",
    bronze: "bg-bronze text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    sale: "bg-gradient-to-r from-error to-warning text-white"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  }

  return (
    <span className={cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  )
}

export default Badge