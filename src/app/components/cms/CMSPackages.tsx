import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Search, MapPin, Clock, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiGet, API_BASE } from '../../utils/api';

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

const EMPTY_FORM = {
  name: '',
  location: '',
  price: 0,
  duration: '',
  description: '',
  schedule: '',
  image: '',
  category: '',
  maxCapacity: 20,
  availableSlots: 20,
  facilities: [] as string[],
};

export function CMSPackages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadPackages = () => {
    setLoading(true);
    apiGet('/packages')
      .then((data) => setPackages(data))
      .catch(() => toast.error('Gagal memuat paket dari API'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    [pkg.name, pkg.location, pkg.category].some((field: string) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ── DELETE ── call DELETE ke backend
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;
    try {
      const res = await fetch(`${API_BASE}/packages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Paket wisata berhasil dihapus');
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Gagal menghapus paket. Coba lagi.');
    }
  };

  // ── EDIT ── buka form dengan data yang ada
  const handleEdit = (pkg: TourPackage) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      location: pkg.location,
      price: pkg.price,
      duration: pkg.duration,
      description: pkg.description,
      schedule: pkg.schedule,
      image: pkg.image,
      category: pkg.category,
      maxCapacity: pkg.maxCapacity,
      availableSlots: pkg.availableSlots,
      facilities: pkg.facilities,
    });
    setShowForm(true);
  };

  // ── ADD ── buka form kosong
  const handleAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  // ── SUBMIT ── POST atau PATCH ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId
        ? `${API_BASE}/packages/${editingId}`
        : `${API_BASE}/packages`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success(editingId ? 'Paket berhasil diperbarui' : 'Paket baru berhasil ditambahkan');
      setShowForm(false);
      loadPackages();
    } catch {
      toast.error('Gagal menyimpan paket. Periksa data dan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFacilityChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: val.split(',').map((s) => s.trim()).filter(Boolean),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kelola Paket Wisata</h1>
            <p className="text-gray-600">Manajemen data paket wisata</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Paket
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari paket wisata..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Nama Paket', key: 'name', type: 'text', required: true },
                  { label: 'Lokasi', key: 'location', type: 'text', required: true },
                  { label: 'Harga (Rp)', key: 'price', type: 'number', required: true },
                  { label: 'Durasi', key: 'duration', type: 'text', required: true },
                  { label: 'Kategori', key: 'category', type: 'text', required: false },
                  { label: 'Jadwal', key: 'schedule', type: 'text', required: false },
                  { label: 'URL Gambar', key: 'image', type: 'text', required: false },
                  { label: 'Kapasitas Maksimal', key: 'maxCapacity', type: 'number', required: false },
                  { label: 'Slot Tersedia', key: 'availableSlots', type: 'number', required: false },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={(formData as any)[key]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fasilitas (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.facilities.join(', ')}
                    onChange={(e) => handleFacilityChange(e.target.value)}
                    placeholder="Hotel Bintang 4, Transportasi AC, Pemandu Wisata"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {editingId ? 'Simpan Perubahan' : 'Tambah Paket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Package List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{pkg.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{pkg.location}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{pkg.duration}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-blue-600 font-semibold">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-gray-400 text-sm ml-3">{pkg.availableSlots} slot tersedia</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredPackages.length === 0 && (
              <div className="text-center py-12 text-gray-400">Tidak ada paket ditemukan.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}