import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { clearCart, getCartItems } from "@/services/api/cartService";
import { createOrder } from "@/services/api/orderService";

const Checkout = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const items = getCartItems()
    if (items.length === 0) {
      navigate("/cart")
      return
    }
    setCartItems(items)
  }, [navigate])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = "First name is required"
    if (!shippingInfo.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = "Email is invalid"
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required"
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required"
    if (!shippingInfo.city.trim()) newErrors.city = "City is required"
    if (!shippingInfo.state.trim()) newErrors.state = "State is required"
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
    if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required"
    if (!paymentInfo.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }
    
    setLoading(true)
    
    try {
      const orderData = {
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingInfo,
        paymentMethod: {
          ...paymentInfo,
          cardNumber: "**** **** **** " + paymentInfo.cardNumber.slice(-4)
        }
      }
      
const order = await createOrder(orderData)
      
      clearCart()
      window.dispatchEvent(new window.CustomEvent('cart_updated'))
      
      toast.success("Order placed successfully!")
      navigate(`/order-confirmation/${order.orderId}`)
      
    } catch (error) {
      console.error("Order error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
            Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? "bg-bronze text-white" 
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? "text-bronze" : "text-gray-500"
                }`}>
                  {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
                </span>
                {step < 3 && (
                  <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6 space-y-6"
                >
                  <h2 className="text-xl font-display font-bold text-charcoal">
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange("firstName", e.target.value)}
                      error={errors.firstName}
                      required
                    />
                    
                    <Input
                      label="Last Name"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange("lastName", e.target.value)}
                      error={errors.lastName}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange("email", e.target.value)}
                      error={errors.email}
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange("phone", e.target.value)}
                      error={errors.phone}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Street Address"
                    value={shippingInfo.address}
                    onChange={(e) => handleShippingChange("address", e.target.value)}
                    error={errors.address}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange("city", e.target.value)}
                      error={errors.city}
                      required
                    />
                    
                    <Select
                      label="State"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange("state", e.target.value)}
                      error={errors.state}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </Select>
                    
                    <Input
                      label="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                      error={errors.zipCode}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNext} type="button">
                      Continue to Payment
                      <ApperIcon name="ArrowRight" size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-charcoal">
                      Payment Information
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      type="button"
                    >
                      <ApperIcon name="ArrowLeft" size={16} />
                      Back
                    </Button>
                  </div>
                  
                  <Input
                    label="Name on Card"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
                    error={errors.nameOnCard}
                    required
                  />
                  
                  <Input
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                      required
                    />
                    
                    <Input
                      label="CVV"
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                      error={errors.cvv}
                      placeholder="123"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="CreditCard" size={16} />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 h-fit"
          >
            <h2 className="text-xl font-display font-bold text-charcoal mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-medium-gray">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-bronze">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-medium-gray">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-medium-gray">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-medium-gray">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-charcoal border-t border-gray-200 pt-3">
                <span>Total</span>
                <span className="text-bronze">${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout