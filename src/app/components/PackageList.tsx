import { Link } from 'react-router';
import { MapPin, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

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

export function PackageList() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    apiGet('/packages')
      .then((data) => setPackages(data))
      .catch(() => setError('Gagal memuat data paket wisata dari server.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(packages.map((pkg) => pkg.category)))];

  const filteredPackages =
    selectedCategory === 'all'
      ? packages
      : packages.filter((pkg) => pkg.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat paket wisata...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Semua Paket Wisata</h1>
          <p className="text-gray-600">Temukan paket wisata terbaik untuk liburan impian Anda</p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'Semua Kategori' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pkg.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {pkg.location}
                </div>
                <h3 className="text-lg font-bold mb-3">{pkg.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {pkg.availableSlots} slot
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-600 font-bold text-xl">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-gray-500 text-sm"> /orang</span>
                  </div>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada paket wisata untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}