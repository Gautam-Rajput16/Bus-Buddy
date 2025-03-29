import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, User, Menu, X, Phone, MapPin, Ticket } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-[#06D6A0]" />
              <span className="text-xl font-bold text-gray-800">BusBuddy</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-gray-900 ${
                location.pathname === '/search' ? 'text-[#06D6A0]' : ''
              }`}
            >
              Find Buses
            </Link>
            <Link 
              to="/my-bookings" 
              className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 ${
                location.pathname === '/my-bookings' ? 'text-[#06D6A0]' : ''
              }`}
            >
              <Ticket className="h-5 w-5" />
              <span>My Bookings</span>
            </Link>
            <Link 
              to="/login" 
              className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 ${
                location.pathname === '/login' ? 'text-[#06D6A0]' : ''
              }`}
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="bg-[#06D6A0] text-white px-4 py-2 rounded-md hover:bg-[#05bf8f] transition-colors"
            >
              Register
            </Link>
          </div>
          
          <div className="sm:hidden flex items-center">
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/search" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/search'
                  ? 'bg-gray-50 text-[#06D6A0]'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Buses
            </Link>
            <Link 
              to="/my-bookings" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/my-bookings'
                  ? 'bg-gray-50 text-[#06D6A0]'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link 
              to="/login" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/login'
                  ? 'bg-gray-50 text-[#06D6A0]'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#06D6A0] text-white hover:bg-[#05bf8f]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="px-5 py-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Customer Support: 1800-123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <MapPin className="h-4 w-4" />
              <span>Track your bus</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;