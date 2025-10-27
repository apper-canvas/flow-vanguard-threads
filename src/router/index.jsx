import { createBrowserRouter } from "react-router-dom"
import { Suspense, lazy } from "react"
import Layout from "@/components/organisms/Layout"

const Home = lazy(() => import("@/components/pages/Home"))
const Products = lazy(() => import("@/components/pages/Products"))
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"))
const Cart = lazy(() => import("@/components/pages/Cart"))
const Checkout = lazy(() => import("@/components/pages/Checkout"))
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"))
const SizeGuide = lazy(() => import("@/components/pages/SizeGuide"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "shop",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Products />
      </Suspense>
    )
  },
  {
    path: "shop/:category",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Products />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductDetail />
      </Suspense>
    )
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Cart />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Checkout />
      </Suspense>
    )
  },
  {
    path: "order-confirmation/:orderId",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <OrderConfirmation />
      </Suspense>
    )
  },
  {
    path: "size-guide",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <SizeGuide />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)