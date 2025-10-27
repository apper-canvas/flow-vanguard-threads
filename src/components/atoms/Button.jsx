import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  className, 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-160 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-charcoal text-white hover:bg-bronze hover:shadow-lg active:scale-95",
    secondary: "border border-charcoal text-charcoal hover:text-bronze hover:border-bronze",
    outline: "border border-gray-300 text-medium-gray hover:border-bronze hover:text-bronze",
    ghost: "text-charcoal hover:bg-light-gray hover:text-bronze"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-8",
    default: "px-6 py-3 text-base min-h-11",
    lg: "px-8 py-4 text-lg min-h-12"
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button