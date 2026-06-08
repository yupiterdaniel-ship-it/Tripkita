import { Outlet, Link, useLocation } from 'react-router';
import { Menu, X, Home, Package, Calendar, Users, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isCMS = location.pathname.startsWith('/cms');

  const userNavItems = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/packages', label: 'Paket Wisata', icon: Package },
  ];

  const cmsNavItems = [
    { to: '/cms', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cms/packages', label: 'Kelola Paket', icon: Package },
    { to: '/cms/bookings', label: 'Kelola Booking', icon: Calendar },
    { to: '/cms/customers', label: 'Kelola Pelanggan', icon: Users },
  ];

  const navItems = isCMS ? cmsNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TK</span>
                </div>
                <span className="font-bold text-xl text-gray-900">
                  TripKita {isCMS && <span className="text-sm text-gray-500">CMS</span>}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {!isCMS && (
                <Link
                  to="/cms"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  CMS Admin
                </Link>
              )}
              {isCMS && (
                <Link
                  to="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Lihat Website
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to={isCMS ? '/' : '/cms'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                {isCMS ? 'Lihat Website' : 'CMS Admin'}
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TripKita</h3>
              <p className="text-gray-400">
                Platform pemesanan paket wisata terpercaya di Indonesia
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <p className="text-gray-400">Email: info@tripkita.com</p>
              <p className="text-gray-400">Telp: 021-12345678</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Jam Operasional</h3>
              <p className="text-gray-400">Senin - Jumat: 08:00 - 17:00</p>
              <p className="text-gray-400">Sabtu: 08:00 - 13:00</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            &copy; 2026 TripKita. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
