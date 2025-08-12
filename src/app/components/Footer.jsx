import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

const quickLinks = [
  { name: "About Us", href: "#" },
  { name: "Contact", href: "#" },
  { name: "FAQ", href: "#" },
  { name: "Shipping Info", href: "#" },
  { name: "Returns", href: "#" },
]

const customerServiceLinks = [
  { name: "Help Center", href: "#" },
  { name: "Track Order", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
]

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bg-gray-900 text-white mt-16 p-2">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WB</span>
              </div>
              <span className="text-xl font-bold">WhatBytes</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted e-commerce destination for quality products at great prices. We're committed to providing
              excellent customer service and fast delivery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} className="hover:text-white transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              {customerServiceLinks.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} className="hover:text-white transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 WhatBytes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}