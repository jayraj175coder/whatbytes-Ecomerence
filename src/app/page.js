"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "./components/Header.jsx"
import Sidebar from "./components/Sidebar.jsx"
import ProductGrid from "./components/ProductGrid.jsx"
import Footer from "./components/Footer.jsx"
import { products } from "./data/products.js"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedBrands, setSelectedBrands] = useState([])

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const price = searchParams.get("price")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")

    if (category) {
      setSelectedCategories(category.split(","))
    }
    if (price) {
      const [min, max] = price.split("-").map(Number)
      setPriceRange([min, max])
    }
    if (brand) {
      setSelectedBrands(brand.split(","))
    }
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }
    if (priceRange[0] !== 0 || priceRange[1] !== 200) {
      params.set("price", `${priceRange[0]}-${priceRange[1]}`)
    }
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","))
    }
    if (searchQuery) {
      params.set("search", searchQuery)
    }

    const newUrl = params.toString() ? `/?${params.toString()}` : "/"
    router.push(newUrl, { scroll: false })
  }, [selectedCategories, priceRange, selectedBrands, searchQuery, router])

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedCategories, priceRange, selectedBrands])

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleCategoryChange = useCallback((categories) => {
    setSelectedCategories(categories)
  }, [])

  const handlePriceRangeChange = useCallback((range) => {
    setPriceRange(range)
  }, [])

  const handleBrandChange = useCallback((brands) => {
    setSelectedBrands(brands)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-between">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="container py-8 px-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Sidebar
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Products ({filteredProducts.length})</h1>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}