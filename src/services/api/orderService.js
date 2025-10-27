import orders from "@/services/mockData/orders.json"

const DELAY = 400 // ms

let orderData = [...orders]

export const createOrder = async (orderInfo) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  
  // Find the highest existing Id and add 1
  const highestId = orderData.length > 0 ? Math.max(...orderData.map(o => o.Id)) : 0
  const newId = highestId + 1
  
  const newOrder = {
    Id: newId,
    orderId: `VT${Date.now().toString().slice(-6)}${newId}`,
    ...orderInfo,
    orderDate: new Date().toISOString(),
    status: "confirmed"
  }
  
  orderData.push(newOrder)
  return { ...newOrder }
}

export const getOrderById = async (orderId) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  const order = orderData.find(o => o.orderId === orderId)
  if (!order) {
    throw new Error("Order not found")
  }
  return { ...order }
}

export const getAllOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  return [...orderData]
}

export const updateOrderStatus = async (orderId, status) => {
  await new Promise(resolve => setTimeout(resolve, DELAY))
  const orderIndex = orderData.findIndex(o => o.orderId === orderId)
  if (orderIndex >= 0) {
    orderData[orderIndex].status = status
    return { ...orderData[orderIndex] }
  }
  throw new Error("Order not found")
}