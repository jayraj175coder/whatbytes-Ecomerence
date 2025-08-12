import { Suspense } from 'react'
import HomeContent from './HomeContent'

export const dynamic = 'force-dynamic'

export default function Home() {

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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}