"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import ProductGrid from "./components/ProductGrid"
import { products } from "./data/products"

// Simple error boundary for client components
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught by error boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return children;
};

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSelectedBrands([]);
    setSearchQuery("");
    // Clear URL without adding to history
    window.history.replaceState({}, '', '/');
  }, []);

  // Update URL when filters change (debounced to avoid too many updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      
      // Only include non-default values in URL
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
      
      // Only update URL if there are any params
      const newUrl = params.toString() ? `/?${params.toString()}` : "/"
      
      // Use replaceState to avoid adding to browser history
      window.history.replaceState({}, '', newUrl);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedCategories, priceRange, selectedBrands, searchQuery])

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    const category = params.get("category")
    const price = params.get("price")
    const brand = params.get("brand")
    const search = params.get("search")

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
  }, [])

  // Filter products based on search query and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by search query
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      // Filter by category
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.some(selectedCategory => {
          const categoryId = typeof selectedCategory === 'object' 
            ? selectedCategory.id 
            : selectedCategory;
          
          const productCategoryId = typeof product.category === 'object'
            ? product.category.id
            : product.category;
          
          return String(categoryId).toLowerCase() === String(productCategoryId).toLowerCase();
        });

      // Filter by price range
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Filter by brand
      const matchesBrand = selectedBrands.length === 0 ||
        selectedBrands.some(selectedBrand => {
          const brandValue = typeof selectedBrand === 'object' ? selectedBrand.name || '' : selectedBrand || '';
          const productBrand = product.brand || '';
          return brandValue.toString().toLowerCase() === productBrand.toString().toLowerCase();
        });

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
    });
  }, [searchQuery, selectedCategories, priceRange, selectedBrands])

  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query)
    },
    []
  )

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategories(prev => {
      // Convert all to strings for consistent comparison
      const categoryIdStr = String(categoryId);
      const newCategories = prev.some(cat => String(cat) === categoryIdStr)
        ? prev.filter(cat => String(cat) !== categoryIdStr) // Remove if exists
        : [...prev, categoryIdStr]; // Add if not exists
      
      return newCategories;
    });
  }, [])

  const handlePriceChange = useCallback((range) => {
    setPriceRange(range)
  }, [])

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands(prev => {
      // Convert all to strings for consistent comparison
      const brandStr = String(brand);
      const newBrands = prev.some(b => String(b) === brandStr)
        ? prev.filter(b => String(b) !== brandStr) // Remove if exists
        : [...prev, brandStr]; // Add if not exists
      
      return newBrands;
    });
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <SideBar
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceChange}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              onClearAllFilters={clearAllFilters}
            />
            <ProductGrid products={filteredProducts} />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default HomeContent;
