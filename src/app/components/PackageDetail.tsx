import { useParams, Link, useNavigate } from 'react-router';
import { MapPin, Clock, Users, CheckCircle, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
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

export function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Paket Wisata Tidak Ditemukan</h1>
          <Link to="/packages" className="text-blue-600 hover:underline">
            Kembali ke Daftar Paket
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden mb-6">
              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {pkg.category}
              </div>
              <h1 className="text-3xl font-bold mb-4">{pkg.name}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {pkg.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {pkg.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {pkg.availableSlots} / {pkg.maxCapacity} slot tersedia
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Fasilitas Termasuk</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.facilities.map((facility, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Jadwal Keberangkatan</h2>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                {pkg.schedule}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Rp {pkg.price.toLocaleString('id-ID')}
              </div>
              <p className="text-gray-500 mb-6">per orang</p>

              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span className="font-semibold">{pkg.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slot tersedia</span>
                  <span className="font-semibold text-green-600">{pkg.availableSlots} orang</span>
                </div>
                <div className="flex justify-between">
                  <span>Lokasi</span>
                  <span className="font-semibold">{pkg.location}</span>
                </div>
              </div>

              {pkg.availableSlots > 0 ? (
                <Link
                  to={`/booking/${pkg.id}`}
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Pesan Sekarang
                </Link>
              ) : (
                <button
                  disabled
                  className="block w-full text-center px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                >
                  Slot Penuh
                </button>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                Hubungi kami untuk informasi lebih lanjut
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}