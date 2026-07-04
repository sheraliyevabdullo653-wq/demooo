/**
 * MediCore API Client
 * Connects the React website to the shared Express REST API server
 * which reads from the Telegram Bot's SQLite database (medicalcore.db)
 */

const BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:3001'
  : (import.meta.env.VITE_API_URL || '');

async function request(path, options = {}) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      ...options,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'API xatosi');
    return json.data;
  } catch (err) {
    console.warn(`[MediCore API] ${path} → ${err.message}`);
    return null;
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function loginApi({ email, password }) {
  return await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function signupApi({ name, email, password }) {
  return await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function fetchMe() {
  return await request('/api/auth/me');
}

// ── Admin ────────────────────────────────────────────────────────────────────
export async function fetchAdminUsers() {
  return await request('/api/admin/users');
}

export async function fetchAdminAppointments() {
  return await request('/api/admin/appointments');
}

export async function fetchAdminOrders() {
  return await request('/api/admin/orders');
}

// ── Medicines ────────────────────────────────────────────────────────────────
export async function fetchMedicines(query = '') {
  const q = query ? `?q=${encodeURIComponent(query)}` : '?q=';
  return await request(`/api/medicines${q}`);
}

// ── Internet API for Medicines ───────────────────────────────────────────────
const MEDICINE_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80',
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80',
  'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&q=80',
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&q=80',
  'https://images.unsplash.com/photo-1550572017-edb79998816c?w=500&q=80',
  'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&q=80'
];

export async function searchInternetMedicines(query = 'paracetamol') {
  if (!query) query = 'a'; // Default search to show something
  try {
    const res = await fetch(`https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(query)}&ef=STRENGTHS_AND_FORMS`);
    const data = await res.json();
    const names = data[1] || [];
    const forms = data[2]?.STRENGTHS_AND_FORMS || [];
    
    return names.map((name, i) => {
      const strength = forms[i] && forms[i].length > 0 ? forms[i][0] : '';
      // Generate a consistent pseudo-random index based on the name length and characters
      const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const imageIndex = charSum % MEDICINE_IMAGES.length;

      return {
        id: `nih_${i}_${Date.now()}`,
        name: name,
        desc: strength ? `Dozasi va shakli: ${strength}` : 'Ommabop dori vositasi',
        price: Math.floor(Math.random() * 50000) + 10000, // Mock price in UZS
        category: 'all',
        image: MEDICINE_IMAGES[imageIndex],
      };
    });
  } catch (err) {
    console.error('Internet API error:', err);
    return [];
  }
}

export async function fetchMedicine(id) {
  return await request(`/api/medicines/${id}`);
}

// ── Pharmacies ───────────────────────────────────────────────────────────────
export async function fetchPharmacies(region = '') {
  return [
    { id: 1, name: 'Oximed Dorixonasi', address: 'Toshkent sh. Chilonzor t.', region: 'tashkent_city', phone: '+998712000001', open_hours: '24/7', rating: 4.8 },
    { id: 2, name: 'Grand Pharm', address: 'Toshkent sh. Yunusobod t.', region: 'tashkent_city', phone: '+998712000002', open_hours: '08:00-22:00', rating: 4.5 },
  ];
}

// ── Clinics ──────────────────────────────────────────────────────────────────
export async function fetchClinics(region = '') {
  return [
    { id: 1, name: 'Akfa Medline', address: 'Toshkent sh. Olmazor t.', region: 'tashkent_city', phone: '+998712000003', specializations: 'All', rating: 4.9 },
    { id: 2, name: 'MDS Service', address: 'Toshkent sh. Yashnobod t.', region: 'tashkent_city', phone: '+998712000004', specializations: 'Cardiology, Neurology', rating: 4.7 },
  ];
}

// ── Doctors ──────────────────────────────────────────────────────────────────
export async function fetchDoctors(specialty = '', region = '') {
  return [
    { id: 1, name: 'Dr. Alisher Valiyev', specialty: 'Cardiologist', clinic_id: 1, experience_years: 15, rating: 4.9, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500' },
    { id: 2, name: 'Dr. Nigina Karimova', specialty: 'Neurologist', clinic_id: 2, experience_years: 8, rating: 4.8, image: 'https://images.unsplash.com/photo-1594824416965-9f654b4cb70f?w=500' },
    { id: 3, name: 'Dr. Jasur Umarov', specialty: 'Pediatrician', clinic_id: 1, experience_years: 12, rating: 4.7, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500' },
  ];
}

// ── Appointments ─────────────────────────────────────────────────────────────
export async function bookAppointment({ name, phone, specialty, date_time, address }) {
  await new Promise(r => setTimeout(r, 800));
  return { id: Date.now(), status: 'pending' };
}

// ── Orders ───────────────────────────────────────────────────────────────────
export async function placeOrder({ name, phone, items, address }) {
  await new Promise(r => setTimeout(r, 800));
  return { id: Date.now(), status: 'processing' };
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export async function fetchStats() {
  return await request('/api/stats');
}

// ── Health Check ─────────────────────────────────────────────────────────────
export async function checkApiHealth() {
  return await request('/api/health');
}

export const TELEGRAM_BOT_URL = 'https://t.me/Medicore1_bot';
export const API_BASE = BASE_URL;
