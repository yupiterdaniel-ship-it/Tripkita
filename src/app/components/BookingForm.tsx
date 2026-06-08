import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Users, CreditCard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE } from '../utils/api';

interface TourPackage {
  id: string;
  name: string;
  location: string;
  price: number;
  duration: string;
  description: string;
  facilities: string[];
  schedule: string;
  image: string;
  category: string;
  maxCapacity: number;
  availableSlots: number;
}

export function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    travelDate: '',
    numberOfPeople: 1,
    specialRequest: '',
  });

  // ── Ambil data paket dari backend ──────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/packages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Paket tidak ditemukan');
        return res.json();
      })
      .then((data) => setPkg(data))
      .catch(() => setError('Paket wisata tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [id]);

  const totalPrice = pkg ? pkg.price * formData.numberOfPeople : 0;

  // ── Submit booking ke backend ───────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setSubmitting(true);

    try {
      // Step 1: Cek atau buat customer
      let customerId = '';

      const searchRes = await fetch(
        `${API_BASE}/customers?search=${encodeURIComponent(formData.email)}`
      );
      const customers = await searchRes.json();
      const existing = Array.isArray(customers)
        ? customers.find((c: any) => c.email === formData.email)
        : null;

      if (existing) {
        customerId = existing.id;
      } else {
        // Buat customer baru
        const createRes = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          }),
        });
        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.message || 'Gagal mendaftarkan pelanggan');
        }
        const newCustomer = await createRes.json();
        customerId = newCustomer.id;
      }

      // Step 2: Buat booking
      const bookingRes = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          customerId,
          travelDate: formData.travelDate,
          numberOfPeople: formData.numberOfPeople,
          notes: formData.specialRequest || null,
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json();
        throw new Error(err.message || 'Gagal membuat booking');
      }

      const booking = await bookingRes.json();

      toast.success(
        `Booking berhasil! ID Booking: ${booking.id}. Silakan cek email Anda untuk konfirmasi.`
      );

      setTimeout(() => navigate('/packages'), 2500);
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value,
    }));
  };

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data paket wisata...</p>
        </div>
      </div>
    );
  }

  // ── Error / not found ───────────────────────────────────────
  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Paket Wisata Tidak Ditemukan</h1>
          <button
            onClick={() => navigate('/packages')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </button>

        <h1 className="text-3xl font-bold mb-8">Form Pemesanan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Informasi Pemesan</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Tanggal Keberangkatan *
                    </label>
                    <input
                      type="date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      Jumlah Peserta *
                    </label>
                    <select
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      {[...Array(Math.min(pkg.availableSlots, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Orang
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Slot tersedia: {pkg.availableSlots} orang
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Permintaan Khusus (Opsional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleChange}
                    rows={3}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Alergi makanan, kebutuhan khusus, dll."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses Pemesanan...
                  </>
                ) : (
                  'Konfirmasi Pemesanan'
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

              <div className="mb-4">
                <div className="h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.location}</p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga per orang</span>
                  <span className="font-semibold">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jumlah peserta</span>
                  <span className="font-semibold">{formData.numberOfPeople} orang</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Durasi</span>
                  <span className="font-semibold">{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jadwal</span>
                  <span className="font-semibold text-right text-xs">{pkg.schedule}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Harga</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Pembayaran dapat dilakukan melalui transfer bank atau metode pembayaran lainnya setelah konfirmasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}