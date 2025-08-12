"use client"

import { useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext.js"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      addToCart(product)
    },
    [addToCart, product],
  )

  const renderStars = useCallback(() => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }, [product.rating])

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            priority={false}
          />
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">{product.title}</h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center" aria-label={`Rating: ${product.rating} out of 5 stars`}>
              {renderStars()}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 active:outline-none active:ring-2 active:ring-blue-500 active:ring-offset-2"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}