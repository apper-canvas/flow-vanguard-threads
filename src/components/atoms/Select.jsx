import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Select = forwardRef(({ 
  label, 
  error, 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white",
          "focus:outline-none focus:ring-2 focus:ring-bronze focus:border-bronze",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select