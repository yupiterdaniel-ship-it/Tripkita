import { useEffect, useState } from 'react';
import { Eye, Search, Calendar, User, Package as PackageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiGet, API_BASE } from '../../utils/api';

export function CMSBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet('/bookings')
      .then((data) => {
        if (mounted) setBookingList(data || []);
      })
      .catch(() => toast.error('Gagal memuat data booking dari API'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredBookings = bookingList.filter((booking) => {
    const matchesSearch = [
      booking.customerName,
      booking.packageName,
      booking.id,
    ]
      .filter(Boolean)
      .some((v: string) => v.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setBookingList(bookingList.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      toast.success('Status booking berhasil diubah');
    } catch {
      toast.error('Gagal mengubah status booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kelola Booking</h1>
          <p className="text-gray-600">Manajemen data pemesanan paket wisata</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari booking, pelanggan, atau paket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {bookingList.filter((b) => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-800">
              {bookingList.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-800">
              {bookingList.filter((b) => b.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal Travel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Peserta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{booking.id}</div>
                      <div className="text-xs text-gray-500">{booking.bookingDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {booking.customerName}
                      </div>
                      <div className="text-xs text-gray-500 ml-6">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <PackageIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {booking.packageName}
                      </div>
                      <div className="text-xs text-gray-500 ml-6">{booking.packageLocation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {booking.travelDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.numberOfPeople} orang</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        Rp {Number(booking.totalPrice).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking.id,
                            e.target.value as 'pending' | 'confirmed' | 'cancelled'
                          )
                        }
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'unpaid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toast.info(`Booking ID: ${booking.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada booking yang ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}