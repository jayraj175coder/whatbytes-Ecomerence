"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")

  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      if (newQuantity === 0) {
        removeFromCart(productId)
      } else {
        updateQuantity(productId, newQuantity)
      }
    },
    [removeFromCart, updateQuantity],
  )

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleClearCart = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart()
    }
  }, [clearCart])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = getCartTotal()

  if (items.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-between min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main className="container py-16 px-2">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-screen bg-gray-50 p-2">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.category} • {item.brand}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium mb-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Proceed to Checkout
              </button>

              <button
                onClick={handleClearCart}
                className="w-full text-red-600 hover:text-red-700 py-2 px-4 border border-red-300 rounded-lg font-medium transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}