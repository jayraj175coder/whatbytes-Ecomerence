"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "../context/CartContext.js"

export default function Header({ searchQuery, onSearchChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getCartItemsCount } = useCart()
  const cartItemsCount = getCartItemsCount()

  const handleSearchChange = useCallback(
    (value) => {
      onSearchChange(value)
    },
    [onSearchChange],
  )

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  return (
    <header className="w-full flex items-center justify-center bg-blue-950 shadow-sm border-b sticky top-0 z-50 text-white p-2">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WB</span>
            </div>
            <span className="text-xl font-bold">WhatBytes</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-white/80 focus:border-transparent outline-none transition-all placeholder:text-white shadow-[0_0_1px_white]"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:scale-105 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 transition-colors">
              <div className="flex gap-4 bg-sky-950/90 py-2 px-6 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
                <span className="font-extrabold">cart</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Profile Icon */}
            {/* <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="User profile">
              <User className="w-6 h-6" />
            </button> */}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-white/80 focus:border-transparent outline-none transition-all placeholder:text-white shadow-[0_0_1px_white]"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}