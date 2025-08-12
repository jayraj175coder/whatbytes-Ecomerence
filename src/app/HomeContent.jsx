"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import ProductGrid from "./components/ProductGrid"
import { products } from "./data/products"

export default function HomeContent() {
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
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      params.set("price", `${priceRange[0]}-${priceRange[1]}`)
    }
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","))
    }
    if (searchQuery) {
      params.set("search", searchQuery)
    }
    
    router.replace(`/?${params.toString()}`)
  }, [selectedCategories, priceRange, selectedBrands, searchQuery, router])

  // Filter products based on search query and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by search query
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      // Filter by category
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          product.category.toLowerCase().includes(category.toLowerCase())
        )

      // Filter by price range
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1]

      // Filter by brand
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((brand) =>
          product.brand.toLowerCase().includes(brand.toLowerCase())
        )

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand
    })
  }, [searchQuery, selectedCategories, priceRange, selectedBrands])

  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query)
    },
    []
  )

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }, [])

  const handlePriceChange = useCallback((range) => {
    setPriceRange(range)
  }, [])

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    )
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SideBar
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            onApplyFilters={updateUrl}
          />
          <ProductGrid products={filteredProducts} />
        </div>
      </main>
    </div>
  )
}
