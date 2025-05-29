import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component
 * 
 * A responsive footer component that provides:
 * - Company branding and logo
 * - Quick navigation links
 * - Resource links
 * - Contact information
 * - Copyright and legal links
 * 
 * The footer is organized in a grid layout that adapts to different screen sizes:
 * - Mobile: Single column layout
 * - Desktop: Four-column layout
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Logo Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-green-500" />
              <span className="ml-2 font-bold text-xl">FoodShare</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/donate" className="text-gray-300 hover:text-white transition-colors">Donate Food</a></li>
              <li><a href="/find" className="text-gray-300 hover:text-white transition-colors">Find Food</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/guidelines" className="text-gray-300 hover:text-white transition-colors">Food Safety Guidelines</a></li>
              <li><a href="/testimonials" className="text-gray-300 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="/partners" className="text-gray-300 hover:text-white transition-colors">Our Partners</a></li>
              <li><a href="/volunteer" className="text-gray-300 hover:text-white transition-colors">Volunteer</a></li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {/* Address */}
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Dhahran, Saudi Arabia</span>
              </li>
              {/* Phone Number */}
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-2" />
                <span>0557742032</span>
              </li>
              {/* Email */}
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-500 mr-2" />
                <a href="mailto:Ahmed.alrawaf@outlook.com" className="hover:underline">Ahmed.alrawaf@outlook.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section - Copyright and Legal Links */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          {/* Copyright Notice */}
          <p>&copy; {new Date().getFullYear()} FoodShare. All rights reserved.</p>
          {/* Legal Links */}
          <div className="mt-2 space-x-4">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;