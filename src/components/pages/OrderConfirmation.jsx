import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { getOrderById } from "@/services/api/orderService"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) {
      navigate("/")
      return
    }
    
    loadOrder()
  }, [orderId, navigate])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const orderData = await getOrderById(orderId)
      setOrder(orderData)
    } catch (err) {
      console.error("Error loading order:", err)
      setError("Order not found or failed to load.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error 
            message={error || "Order not found"}
            onRetry={loadOrder}
          />
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "warning"
      case "confirmed": return "info"
      case "shipped": return "info"
      case "delivered": return "success"
      case "cancelled": return "error"
      default: return "default"
    }
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" size={48} className="text-success" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-medium-gray">
            Thank you for your order. We'll send you updates as your items ship.
          </p>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-charcoal mb-1">
                    Order #{order.orderId}
                  </h2>
                  <p className="text-medium-gray">
                    Placed on {new Date(order.orderDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <Badge variant={getStatusColor(order.status)} size="lg">
                  {order.status}
                </Badge>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-display font-bold text-charcoal mb-4">
                Order Items ({order.items.length})
              </h3>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 bg-light-gray rounded-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-sm"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal mb-1">
                        {item.name}
                      </h4>
                      <div className="text-sm text-medium-gray space-y-1">
                        <p>Size: {item.size} • Color: {item.color}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-bronze">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-medium-gray">
                        ${item.price} each
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-display font-bold text-charcoal mb-4">
                Shipping Address
              </h3>
              
              <div className="text-medium-gray">
                <p className="font-medium text-charcoal">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="mt-2">
                  <ApperIcon name="Mail" size={14} className="inline mr-1" />
                  {order.shippingAddress.email}
                </p>
                <p>
                  <ApperIcon name="Phone" size={14} className="inline mr-1" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-display font-bold text-charcoal mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-medium-gray">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-medium-gray">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${order.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-medium-gray">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-charcoal">
                    <span>Total</span>
                    <span className="text-bronze">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ApperIcon name="Package" size={20} />
                Track Order
              </Button>
              
              <Button variant="secondary" size="lg" className="w-full">
                <Link to="/shop" className="flex items-center gap-2 w-full justify-center">
                  <ApperIcon name="ShoppingCart" size={20} />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button variant="ghost" size="lg" className="w-full">
                <ApperIcon name="Download" size={20} />
                Download Receipt
              </Button>
            </div>

            {/* Support */}
            <div className="bg-bronze/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-bronze/20 p-2 rounded-full">
                  <ApperIcon name="Headphones" size={16} className="text-bronze" />
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">
                    Need Help?
                  </h4>
                  <p className="text-sm text-medium-gray mb-2">
                    Our customer service team is here to help.
                  </p>
                  <button className="text-sm text-bronze hover:text-bronze/80 underline">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation