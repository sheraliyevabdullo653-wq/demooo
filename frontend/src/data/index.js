// ─── Constants ────────────────────────────────────────────────────────────────
export const REGIONS = [
  { id: 'tashkent_city', name: 'Tashkent City',     lat: 41.2995, lng: 69.2401 },
  { id: 'tashkent_reg',  name: 'Tashkent Region',   lat: 41.1301, lng: 69.4140 },
  { id: 'samarkand',     name: 'Samarkand',          lat: 39.6270, lng: 66.9750 },
  { id: 'bukhara',       name: 'Bukhara',            lat: 39.7747, lng: 64.4286 },
  { id: 'andijan',       name: 'Andijan',            lat: 40.7821, lng: 72.3442 },
  { id: 'fergana',       name: 'Fergana',            lat: 40.3844, lng: 71.7844 },
  { id: 'namangan',      name: 'Namangan',           lat: 40.9983, lng: 71.6726 },
  { id: 'navoi',         name: 'Navoi',              lat: 40.1039, lng: 65.3739 },
  { id: 'jizzakh',       name: 'Jizzakh',            lat: 40.1158, lng: 67.8422 },
  { id: 'kashkadarya',   name: 'Kashkadarya',        lat: 38.8612, lng: 65.7847 },
  { id: 'surkhandarya',  name: 'Surkhandarya',       lat: 37.2272, lng: 67.2783 },
  { id: 'syrdarya',      name: 'Syrdarya',           lat: 40.4851, lng: 68.7847 },
  { id: 'khorezm',       name: 'Khorezm',            lat: 41.5583, lng: 60.6272 },
  { id: 'karakalpakstan',name: 'Karakalpakstan',     lat: 43.1000, lng: 59.0000 },
]

// ─── Medicines ────────────────────────────────────────────────────────────────
export const medicines = [
  { id: 1,  name: 'Vitamin C 1000mg',       category: 'vitamins',  price: 12.99, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80', desc: 'Immune support & antioxidant protection',     inStock: true  },
  { id: 2,  name: 'Vitamin D3 5000 IU',     category: 'vitamins',  price: 15.49, rating: 4.9, reviews: 518, image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=400&q=80', desc: 'Bone health & immune system support',          inStock: true  },
  { id: 3,  name: 'Omega-3 Fish Oil',       category: 'vitamins',  price: 24.99, rating: 4.7, reviews: 289, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', desc: 'Heart & brain health support',                inStock: true  },
  { id: 4,  name: 'Ibuprofen 400mg',        category: 'pain',      price: 8.99,  rating: 4.6, reviews: 721, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80', desc: 'Fast-acting pain & fever relief',             inStock: true  },
  { id: 5,  name: 'Paracetamol 500mg',      category: 'pain',      price: 6.49,  rating: 4.5, reviews: 934, image: 'https://images.unsplash.com/photo-1558483861-6e4ded5394ce?w=400&q=80', desc: 'Gentle pain relief & fever reducer',          inStock: true  },
  { id: 6,  name: 'Nasal Spray',            category: 'cold',      price: 11.29, rating: 4.4, reviews: 203, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80', desc: 'Instant nasal congestion relief',             inStock: true  },
  { id: 7,  name: 'Cold & Flu Relief',      category: 'cold',      price: 14.99, rating: 4.6, reviews: 445, image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', desc: 'Multi-symptom cold & flu formula',            inStock: false },
  { id: 8,  name: 'Probiotic 50 Billion',   category: 'digestive', price: 32.99, rating: 4.8, reviews: 267, image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80', desc: 'Gut health & digestive balance',              inStock: true  },
  { id: 9,  name: 'Antacid Tablets',        category: 'digestive', price: 9.99,  rating: 4.3, reviews: 189, image: 'https://images.unsplash.com/photo-1550572017-37b3ef6c527e?w=400&q=80', desc: 'Fast heartburn & acid relief',                inStock: true  },
  { id: 10, name: 'Aspirin 100mg',          category: 'heart',     price: 7.99,  rating: 4.7, reviews: 612, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80', desc: 'Daily heart health maintenance',              inStock: true  },
  { id: 11, name: 'CoQ10 200mg',            category: 'heart',     price: 28.99, rating: 4.8, reviews: 198, image: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80', desc: 'Cellular energy & heart support',             inStock: true  },
  { id: 12, name: 'Hydrocortisone Cream',   category: 'skin',      price: 13.49, rating: 4.5, reviews: 334, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', desc: 'Soothes redness, itching & irritation',       inStock: true  },
]

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const doctors = [
  { id: 1, regionId: 'tashkent_city', name: 'Dr. Sarah Chen',       specialty: 'general',   experience: 12, rating: 4.9, reviews: 847, available: true,  price: 45, languages: ['en', 'ru'],          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
  { id: 2, regionId: 'samarkand',    name: 'Dr. Amir Karimov',     specialty: 'cardio',    experience: 18, rating: 4.8, reviews: 623, available: true,  price: 75, languages: ['uz', 'ru', 'en'],    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
  { id: 3, regionId: 'tashkent_city', name: 'Dr. Elena Petrova',    specialty: 'neuro',     experience: 15, rating: 4.9, reviews: 412, available: false, price: 80, languages: ['ru', 'en'],          image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80' },
  { id: 4, regionId: 'tashkent_city', name: 'Dr. James Wilson',     specialty: 'pediatric', experience: 10, rating: 4.7, reviews: 529, available: true,  price: 55, languages: ['en'],               image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80' },
  { id: 5, regionId: 'tashkent_city', name: 'Dr. Nilufar Yusupova', specialty: 'derma',     experience: 8,  rating: 4.8, reviews: 381, available: true,  price: 60, languages: ['uz', 'ru'],          image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80' },
  { id: 6, regionId: 'samarkand',    name: 'Dr. Timur Rashidov',   specialty: 'ortho',     experience: 20, rating: 4.9, reviews: 714, available: false, price: 70, languages: ['uz', 'ru', 'en'],    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' },
]

// ─── Pharmacies ───────────────────────────────────────────────────────────────
export const pharmacies = [
  // Tashkent City
  { id: 1,  regionId: 'tashkent_city', name: 'MediCore Pharmacy', address: 'Amir Temur sq. 1',       phone: '+998 71 123-45-67', open: true,  hours: '08:00 - 22:00', lat: 41.2995, lng: 69.2401, distance: 0.3 },
  { id: 2,  regionId: 'tashkent_city', name: 'HealthPlus',        address: 'Mustaqillik Ave. 54',     phone: '+998 71 234-56-78', open: true,  hours: '24/7',          lat: 41.3085, lng: 69.2795, distance: 0.8 },
  // Samarkand
  { id: 10, regionId: 'samarkand',    name: 'Registan Pharma',     address: 'Registan St. 45',        phone: '+998 66 123-45-67', open: true,  hours: '08:00 - 21:00', lat: 39.6547, lng: 66.9757, distance: 0.5 },
  { id: 11, regionId: 'samarkand',    name: 'Samarkand Medical',   address: 'Dagbit St. 12',          phone: '+998 66 234-56-78', open: true,  hours: '24/7',          lat: 39.6644, lng: 66.9531, distance: 1.2 },
  // Bukhara
  { id: 20, regionId: 'bukhara',      name: 'Buxoro Shifo',        address: 'B. Nakshband St. 11',    phone: '+998 65 123-45-67', open: true,  hours: '08:00 - 22:00', lat: 39.7747, lng: 64.4286, distance: 0.4 },
  // Fergana
  { id: 30, regionId: 'fergana',      name: 'Fargona Dori',        address: 'Mustaqillik St. 5',      phone: '+998 73 123-45-67', open: true,  hours: '08:00 - 20:00', lat: 40.3844, lng: 71.7844, distance: 0.6 },
  // Andijan
  { id: 40, regionId: 'andijan',      name: 'Andijon Pharm',       address: 'Navoi Ave. 88',          phone: '+998 74 123-45-67', open: true,  hours: '08:00 - 21:00', lat: 40.7821, lng: 72.3442, distance: 0.3 },
  // Namangan
  { id: 50, regionId: 'namangan',     name: 'Namangan Med',        address: 'Uychi St. 2',            phone: '+998 69 123-45-67', open: true,  hours: '09:00 - 21:00', lat: 40.9983, lng: 71.6726, distance: 0.7 },
  // Kashkadarya
  { id: 60, regionId: 'kashkadarya',  name: 'Qarshi Shifo',        address: 'Jayhun St. 14',          phone: '+998 75 123-45-67', open: true,  hours: '24/7',          lat: 38.8612, lng: 65.7847, distance: 0.5 },
  // Surkhandarya
  { id: 70, regionId: 'surkhandarya', name: 'Termiz Pharm',        address: 'At-Termizi St. 1',       phone: '+998 76 123-45-67', open: true,  hours: '08:00 - 22:00', lat: 37.2272, lng: 67.2783, distance: 0.8 },
]

// ─── Clinics ──────────────────────────────────────────────────────────────────
export const clinics = [
  // Tashkent City
  { id: 1,  regionId: 'tashkent_city', name: 'Central Polyclinic #1', address: 'Shota Rustaveli St. 12', phone: '+998 71 111-22-33', open: true,  hours: '08:00 - 18:00', lat: 41.2855, lng: 69.2501, distance: 1.2 },
  { id: 2,  regionId: 'tashkent_city', name: 'Akfa Medline',           address: 'Almazar Dist.',        phone: '+998 71 203-30-03', open: true,  hours: '24/7',          lat: 41.3455, lng: 69.2101, distance: 4.5 },
  // Samarkand
  { id: 10, regionId: 'samarkand',    name: 'Samarkand City Hospital', address: 'Ibn Sino St. 1',        phone: '+998 66 333-44-55', open: true,  hours: '24/7',          lat: 39.6447, lng: 66.9657, distance: 0.9 },
  // Bukhara
  { id: 20, regionId: 'bukhara',      name: 'Bukhara Regional Clinic', address: 'Gijduvan St. 4',       phone: '+998 65 222-33-44', open: true,  hours: '08:00 - 20:00', lat: 39.7847, lng: 64.4186, distance: 1.1 },
  // Andijan
  { id: 40, regionId: 'andijan',      name: 'Andijan Family Clinic',   address: 'Osh St. 10',           phone: '+998 74 111-22-33', open: true,  hours: '08:00 - 19:00', lat: 40.7921, lng: 72.3342, distance: 0.5 },
]

// ─── AI Q&A Mock Responses ────────────────────────────────────────────────────
export const mockAIResponses = {
  default: (q) => `Based on your question about **"${q}"**, here is some general information:

  1. **Personalized Care:** For specific symptoms, it is always best to consult with a specialist in your region.
  2. **Preventative Measures:** Maintaining a balanced diet and regular exercise is the foundation of good health.
  3. **Medication:** Do not take any new medication without a prescription.
  4. **Next Steps:** You can book a consultation with one of our doctors in the **Doctors** section for a professional diagnosis.

  *Note: I am currently in Demo Mode. For real-time advanced medical analysis, please provide an OpenAI API key in the settings.*`,
  flu: `**Influenza (Flu) — Common Symptoms:**\n\n**Primary Symptoms:**\n• High fever (38–41°C) with chills\n• Severe muscle aches and body pain\n• Intense headache & extreme fatigue\n• Dry, persistent cough\n\n**Secondary Symptoms:**\n• Sore throat and nasal congestion\n• Runny nose\n• Nausea/vomiting (more common in children)\n\n**Treatment:**\n• Rest and stay home\n• Drink plenty of fluids\n• Paracetamol/ibuprofen for fever\n• Antiviral medications if started within 48 hours\n\n*See a doctor if symptoms are severe or you are in a high-risk group.*`,
}
