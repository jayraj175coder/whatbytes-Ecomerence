"use client"

import { useState, useCallback } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { categories, brands } from "../data/products.js"

export default function Sidebar({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isBrandOpen, setIsBrandOpen] = useState(false)

  const toggleCategory = useCallback(() => {
    setIsCategoryOpen((prev) => !prev)
  }, [])

  const togglePrice = useCallback(() => {
    setIsPriceOpen((prev) => !prev)
  }, [])

  const toggleBrand = useCallback(() => {
    setIsBrandOpen((prev) => !prev)
  }, [])

  const handleCategoryChange = useCallback(
    (categoryId, checked) => {
      if (checked) {
        onCategoryChange([...selectedCategories, categoryId])
      } else {
        onCategoryChange(selectedCategories.filter((c) => c !== categoryId))
      }
    },
    [selectedCategories, onCategoryChange],
  )

  const handleBrandChange = useCallback(
    (brand, checked) => {
      if (checked) {
        onBrandChange([...selectedBrands, brand])
      } else {
        onBrandChange(selectedBrands.filter((b) => b !== brand))
      }
    },
    [selectedBrands, onBrandChange],
  )

  const handlePriceChange = useCallback(
    (value) => {
      onPriceRangeChange([priceRange[0], Number.parseInt(value)])
    },
    [priceRange, onPriceRangeChange],
  )

  const clearAllFilters = useCallback(() => {
    onCategoryChange([])
    onPriceRangeChange([0, 200])
    onBrandChange([])
  }, [onCategoryChange, onPriceRangeChange, onBrandChange])

  return (
    <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-sm border h-fit">
      <h2 className="text-lg font-semibold mb-6">Filters</h2>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={toggleCategory}
          className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600 transition-colors"
          aria-expanded={isCategoryOpen}
        >
          Categories
          {isCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isCategoryOpen && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {category.name} ({category.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={togglePrice}
          className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600 transition-colors"
          aria-expanded={isPriceOpen}
        >
          Price Range
          {isPriceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isPriceOpen && (
          <div className="space-y-3">
            <div>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={toggleBrand}
          className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600 transition-colors"
          aria-expanded={isBrandOpen}
        >
          Brands
          {isBrandOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isBrandOpen && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearAllFilters}
        className="w-full py-2 px-4 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}