"use client"

import { useState, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import { products } from "../../data/products.js"
import { useCart } from "../../context/CartContext.jsx"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const product = useMemo(() => {
    return products.find((p) => p.id === Number.parseInt(params.id))
  }, [params.id])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  }, [product])

  const handleAddToCart = useCallback(() => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }, [addToCart, product, quantity])

  const handleQuantityChange = useCallback((delta) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }, [])

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleBackClick = useCallback(() => {
    router.back()
  }, [router])

  const renderStars = useCallback((rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }, [])

  if (!product) {
    return (
      <div className="w-full flex flex-col items-center justify-between min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <div className="container py-16 text-center px-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="container py-8 px-2">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="aspect-square relative bg-white rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600 capitalize">
                {product.category} • {product.brand}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">${product.price}</div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">{relatedProduct.title}</h3>
                      <div className="text-lg font-bold text-gray-900">${relatedProduct.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}