export interface TourPackage {
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

export interface Booking {
  id: string;
  packageId: string;
  customerId: string;
  bookingDate: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

export const tourPackages: TourPackage[] = [
  {
    id: '1',
    name: 'Paket Wisata Bali 3D2N',
    location: 'Bali, Indonesia',
    price: 2500000,
    duration: '3 Hari 2 Malam',
    description: 'Nikmati keindahan pulau Bali dengan mengunjungi tempat-tempat iconic seperti Tanah Lot, Uluwatu, dan pantai-pantai indah. Paket sudah termasuk penginapan, transportasi, dan pemandu wisata.',
    facilities: ['Hotel Bintang 4', 'Transportasi AC', 'Pemandu Wisata', 'Makan 3x Sehari', 'Tiket Masuk Wisata'],
    schedule: 'Berangkat setiap Senin, Rabu, Jumat',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    category: 'Beach & Culture',
    maxCapacity: 20,
    availableSlots: 12
  },
  {
    id: '2',
    name: 'Paket Wisata Yogyakarta 2D1N',
    location: 'Yogyakarta, Indonesia',
    price: 1200000,
    duration: '2 Hari 1 Malam',
    description: 'Jelajahi keajaiban candi Borobudur dan Prambanan, serta nikmati kuliner khas Yogyakarta. Paket termasuk kunjungan ke Malioboro dan keraton.',
    facilities: ['Hotel Bintang 3', 'Transportasi AC', 'Pemandu Wisata', 'Makan 2x Sehari', 'Tiket Masuk Candi'],
    schedule: 'Berangkat setiap hari',
    image: 'https://images.unsplash.com/photo-1598535398949-df8b57c32727',
    category: 'Culture & History',
    maxCapacity: 25,
    availableSlots: 8
  },
  {
    id: '3',
    name: 'Paket Wisata Bromo 2D1N',
    location: 'Bromo, Jawa Timur',
    price: 1500000,
    duration: '2 Hari 1 Malam',
    description: 'Saksikan sunrise spektakuler di Gunung Bromo dan jelajahi padang savana yang memukau. Pengalaman yang tak terlupakan dengan pemandangan alam yang luar biasa.',
    facilities: ['Homestay', 'Jeep 4WD', 'Pemandu Wisata', 'Makan 2x Sehari', 'Jaket Hangat'],
    schedule: 'Berangkat Sabtu & Minggu',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
    category: 'Mountain & Adventure',
    maxCapacity: 15,
    availableSlots: 5
  },
  {
    id: '4',
    name: 'Paket Wisata Raja Ampat 5D4N',
    location: 'Raja Ampat, Papua Barat',
    price: 8500000,
    duration: '5 Hari 4 Malam',
    description: 'Diving dan snorkeling di surga bawah laut Indonesia. Nikmati keindahan terumbu karang dan keanekaragaman hayati laut yang menakjubkan.',
    facilities: ['Resort Tepi Pantai', 'Speedboat', 'Diving Guide', 'Makan 3x Sehari', 'Peralatan Snorkeling'],
    schedule: 'Berangkat setiap Minggu',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    category: 'Beach & Diving',
    maxCapacity: 10,
    availableSlots: 3
  },
  {
    id: '5',
    name: 'Paket Wisata Lombok 4D3N',
    location: 'Lombok, NTB',
    price: 3200000,
    duration: '4 Hari 3 Malam',
    description: 'Jelajahi keindahan pantai-pantai eksotis Lombok, termasuk Pink Beach dan Gili Trawangan. Nikmati sunset yang memukau dan suasana pantai yang tenang.',
    facilities: ['Hotel Bintang 4', 'Boat & Car', 'Pemandu Wisata', 'Makan 3x Sehari', 'Peralatan Snorkeling'],
    schedule: 'Berangkat Selasa & Jumat',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
    category: 'Beach & Island',
    maxCapacity: 18,
    availableSlots: 10
  },
  {
    id: '6',
    name: 'Paket Wisata Labuan Bajo 4D3N',
    location: 'Labuan Bajo, NTT',
    price: 4500000,
    duration: '4 Hari 3 Malam',
    description: 'Kunjungi Pulau Komodo dan temui komodo asli. Island hopping ke Pink Beach, Padar Island, dan spot snorkeling terbaik di Indonesia.',
    facilities: ['Hotel Bintang 3', 'Kapal Phinisi', 'Pemandu Wisata', 'Makan 3x Sehari', 'Tiket Taman Nasional'],
    schedule: 'Berangkat setiap Senin & Kamis',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00',
    category: 'Island & Wildlife',
    maxCapacity: 12,
    availableSlots: 7
  }
];

export const customers: Customer[] = [
  {
    id: 'C001',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Jakarta',
    joinDate: '2025-01-15'
  },
  {
    id: 'C002',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    phone: '081298765432',
    address: 'Jl. Gatot Subroto No. 45, Bandung',
    joinDate: '2025-02-20'
  },
  {
    id: 'C003',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    phone: '081345678901',
    address: 'Jl. Diponegoro No. 78, Surabaya',
    joinDate: '2025-03-10'
  },
  {
    id: 'C004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    phone: '081456789012',
    address: 'Jl. Thamrin No. 56, Jakarta',
    joinDate: '2025-04-05'
  },
  {
    id: 'C005',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@email.com',
    phone: '081567890123',
    address: 'Jl. Malioboro No. 12, Yogyakarta',
    joinDate: '2025-05-01'
  }
];

export const bookings: Booking[] = [
  {
    id: 'B001',
    packageId: '1',
    customerId: 'C001',
    bookingDate: '2026-05-15',
    travelDate: '2026-06-10',
    numberOfPeople: 2,
    totalPrice: 5000000,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: 'B002',
    packageId: '2',
    customerId: 'C002',
    bookingDate: '2026-05-18',
    travelDate: '2026-06-05',
    numberOfPeople: 4,
    totalPrice: 4800000,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: 'B003',
    packageId: '3',
    customerId: 'C003',
    bookingDate: '2026-05-20',
    travelDate: '2026-06-15',
    numberOfPeople: 3,
    totalPrice: 4500000,
    status: 'pending',
    paymentStatus: 'unpaid'
  },
  {
    id: 'B004',
    packageId: '4',
    customerId: 'C004',
    bookingDate: '2026-05-22',
    travelDate: '2026-07-01',
    numberOfPeople: 2,
    totalPrice: 17000000,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: 'B005',
    packageId: '5',
    customerId: 'C005',
    bookingDate: '2026-05-25',
    travelDate: '2026-06-20',
    numberOfPeople: 2,
    totalPrice: 6400000,
    status: 'pending',
    paymentStatus: 'unpaid'
  }
];
