import { Link } from 'react-router';
import { Package, Calendar, Users, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiGet } from '../../utils/api';

interface DashboardStats {
  totalPackages: number;
  totalBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
}

interface RecentBooking {
  id: string;
  packageName: string;
  customerName: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

export function CMSDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/packages'),
      apiGet('/bookings'),
      apiGet('/customers'),
    ])
      .then(([packages, bookings, customers]) => {
        const paidBookings = bookings.filter((b: any) => b.paymentStatus === 'paid');
        const totalRevenue = paidBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

        setStats({
          totalPackages: packages.length,
          totalBookings: bookings.length,
          totalCustomers: customers.length,
          totalRevenue,
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          confirmedBookings: bookings.filter((b: any) => b.status === 'confirmed').length,
        });

        setRecentBookings(bookings.slice(0, 5));
      })
      .catch(() => {
        // Jika API belum tersedia, tampilkan stats kosong
        setStats({
          totalPackages: 0,
          totalBookings: 0,
          totalCustomers: 0,
          totalRevenue: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Paket Wisata',
      value: stats?.totalPackages ?? 0,
      icon: Package,
      color: 'bg-blue-500',
      link: '/cms/packages',
    },
    {
      label: 'Total Booking',
      value: stats?.totalBookings ?? 0,
      icon: Calendar,
      color: 'bg-green-500',
      link: '/cms/bookings',
    },
    {
      label: 'Total Pelanggan',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/cms/customers',
    },
    {
      label: 'Total Pendapatan',
      value: `Rp ${((stats?.totalRevenue ?? 0) / 1_000_000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      link: '/cms/bookings',
    },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard CMS</h1>
          <p className="text-gray-600">Selamat datang di sistem manajemen TripKita</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Sub-stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Status Booking</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Menunggu Konfirmasi</span>
                <span className="font-bold text-yellow-600">{stats?.pendingBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Terkonfirmasi</span>
                <span className="font-bold text-green-600">{stats?.confirmedBookings}</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Booking Terbaru</h2>
            {recentBookings.length === 0 ? (
              <p className="text-gray-400 text-sm">Belum ada booking</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold">{b.customerName}</p>
                      <p className="text-gray-500">{b.packageName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Kelola Data</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/cms/packages" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Kelola Paket
            </Link>
            <Link to="/cms/bookings" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Kelola Booking
            </Link>
            <Link to="/cms/customers" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Kelola Pelanggan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}