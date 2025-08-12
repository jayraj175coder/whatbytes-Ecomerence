import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./context/CartContext.jsx"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WhatBytes - E-commerce Store",
  description: "Your one-stop shop for all products",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}