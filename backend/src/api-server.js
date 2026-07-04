import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  initDb,
  getAllPharmacies,
  getAllClinics,
  getDoctorsBySpecialty,
  searchMedicines,
  getMedicine,
  getSystemStats,
  createAppointment,
  getWebUserById,
  getAllWebUsers,
  createWebUser,
  getWebUserByEmail,
  getAllAppointments,
  getAllOrders
} from './db.js';
import { askGemini } from './gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load both .env files (frontend and backend)
dotenv.config(); // Loads .env in the current directory (backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') }); // Loads VITE_ variables if they are there

const app = express();
const PORT = process.env.API_PORT || 3001;
const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_medicore_key_2026';

// ── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());

const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// ── INIT DB ─────────────────────────────────────────────────────────────────
await initDb();
console.log('✅ Database connected for API server');

// ── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MediCore API', timestamp: new Date().toISOString() });
});

// ── MEDICINES ───────────────────────────────────────────────────────────────
app.get('/api/medicines', async (req, res) => {
  try {
    const query = req.query.q || '';
    const medicines = await searchMedicines(query);
    res.json({ success: true, data: medicines });
  } catch (err) {
    console.error('[API] medicines error:', err);
    res.status(500).json({ success: false, error: 'Dorilar yuklanmadi' });
  }
});

app.get('/api/medicines/:id', async (req, res) => {
  try {
    const medicine = await getMedicine(parseInt(req.params.id));
    if (!medicine) return res.status(404).json({ success: false, error: 'Dori topilmadi' });
    res.json({ success: true, data: medicine });
  } catch (err) {
    console.error('[API] medicine/:id error:', err);
    res.status(500).json({ success: false, error: 'Server xatosi' });
  }
});

// ── PHARMACIES ──────────────────────────────────────────────────────────────
app.get('/api/pharmacies', async (req, res) => {
  try {
    let pharmacies = await getAllPharmacies();
    if (req.query.region) {
      pharmacies = pharmacies.filter(p =>
        p.region.toLowerCase().includes(req.query.region.toLowerCase())
      );
    }
    res.json({ success: true, data: pharmacies });
  } catch (err) {
    console.error('[API] pharmacies error:', err);
    res.status(500).json({ success: false, error: 'Aptekalar yuklanmadi' });
  }
});

// ── CLINICS ─────────────────────────────────────────────────────────────────
app.get('/api/clinics', async (req, res) => {
  try {
    let clinics = await getAllClinics();
    if (req.query.region) {
      clinics = clinics.filter(c =>
        c.region.toLowerCase().includes(req.query.region.toLowerCase())
      );
    }
    res.json({ success: true, data: clinics });
  } catch (err) {
    console.error('[API] clinics error:', err);
    res.status(500).json({ success: false, error: 'Klinikalar yuklanmadi' });
  }
});

// ── DOCTORS ─────────────────────────────────────────────────────────────────
app.get('/api/doctors', async (req, res) => {
  try {
    const { specialty, region } = req.query;
    let doctors;
    if (specialty) {
      doctors = await getDoctorsBySpecialty(specialty, region || null);
    } else {
      const specialties = ['Therapist', 'Pediatrician', 'Cardiologist', 'Neurologist', 'Orthopedist', 'Surgeon'];
      const all = await Promise.all(specialties.map(s => getDoctorsBySpecialty(s)));
      doctors = all.flat();
    }
    res.json({ success: true, data: doctors });
  } catch (err) {
    console.error('[API] doctors error:', err);
    res.status(500).json({ success: false, error: 'Shifokorlar yuklanmadi' });
  }
});

// ── APPOINTMENTS ─────────────────────────────────────────────────────────────
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, phone, specialty, date_time, address } = req.body;
    if (!name || !phone || !specialty || !date_time || !address) {
      return res.status(400).json({ success: false, error: 'Barcha maydonlar to\'ldirilishi kerak' });
    }
    const pseudoId = `web_${phone.replace(/\D/g, '')}`;
    const id = await createAppointment(pseudoId, specialty, name, date_time, address);
    res.json({ success: true, data: { appointment_id: id, message: 'Qabul muvaffaqiyatli band qilindi!' } });
  } catch (err) {
    console.error('[API] appointments POST error:', err);
    res.status(500).json({ success: false, error: 'Qabul band qilishda xatolik' });
  }
});

// ── ORDERS ───────────────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, items, address } = req.body;
    if (!name || !phone || !items || !items.length || !address) {
      return res.status(400).json({ success: false, error: 'Barcha maydonlar to\'ldirilishi kerak' });
    }
    const totalPrice = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const pseudoId = `web_${phone.replace(/\D/g, '')}`;
    const id = await createOrder(pseudoId, items, address, totalPrice);
    res.json({ success: true, data: { order_id: id, total: totalPrice, message: 'Buyurtma muvaffaqiyatli qabul qilindi!' } });
  } catch (err) {
    console.error('[API] orders POST error:', err);
    res.status(500).json({ success: false, error: 'Buyurtma berishda xatolik' });
  }
});

// ── STATS ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json({
      success: true,
      data: {
        users: stats.totalUsers,
        premium_users: stats.premiumUsers,
        appointments: stats.totalAppointments,
        orders: stats.totalOrders,
      }
    });
  } catch (err) {
    console.error('[API] stats error:', err);
    res.status(500).json({ success: false, error: 'Statistika yuklanmadi' });
  }
});

// ── AUTHENTICATION ───────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Barcha maydonlarni to\'ldiring' });
    }
    const existing = await getWebUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
    }
    
    const allUsers = await getAllWebUsers();
    const role = allUsers.length === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createWebUser(name, email, hashedPassword, role);
    
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: userId, name, email, role } } });
  } catch (err) {
    console.error('[API] signup error:', err);
    res.status(500).json({ success: false, error: 'Server xatosi' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email va parolni kiriting' });
    }
    
    const user = await getWebUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Email yoki parol noto\'g\'ri' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Email yoki parol noto\'g\'ri' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) {
    console.error('[API] login error:', err);
    res.status(500).json({ success: false, error: 'Server xatosi' });
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Avtorizatsiyadan o\'tilmagan' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Yaroqsiz token' });
  }
};

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await getWebUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'Foydalanuvchi topilmadi' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('[API] /me error:', err);
    res.status(500).json({ success: false, error: 'Server xatosi' });
  }
});

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Ruxsat yo\'q' });
  }
  next();
};

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await getAllWebUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('[API] admin/users error:', err);
    res.status(500).json({ success: false, error: 'Foydalanuvchilarni yuklashda xatolik' });
  }
});

app.get('/api/admin/appointments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error('[API] admin/appointments error:', err);
    res.status(500).json({ success: false, error: 'Qabullarni yuklashda xatolik' });
  }
});

app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('[API] admin/orders error:', err);
    res.status(500).json({ success: false, error: 'Buyurtmalarni yuklashda xatolik' });
  }
});

// ── AI CHAT PROXY ────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { question, messages, apiKey: clientApiKey, provider } = req.body;
    
    const openaiKey = clientApiKey || process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const resolvedProvider = provider || (openaiKey ? 'openai' : 'gemini');

    if (resolvedProvider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          success: false, 
          error: 'Gemini API key is not configured on the server. Please add it to your environment.' 
        });
      }
      const responseText = await askGemini(question, messages || []);
      return res.json({ success: true, data: responseText, provider: 'gemini' });
    }

    if (!openaiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'OpenAI API key not found. Please configure it in your settings or switch to Google Gemini.' 
      });
    }

    const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are MediCore AI, a highly advanced and versatile medical and wellness assistant. You can answer any health, science, wellness, and general knowledge questions. While you are an expert in medical topics, you are helpfully general. Always provide accurate info and remind users and if it is a medical query, suggest professional consultation.' 
          },
          ...(messages || []).slice(-10).filter(m => m.id !== 0).map(m => ({ 
            role: m.role, 
            content: m.text || m.content 
          })),
          { role: 'user', content: question }
        ],
        temperature: 0.8,
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ 
        success: false, 
        error: data.error?.message || 'Error communicating with OpenAI API' 
      });
    }

    res.json({ success: true, data: data.choices[0].message.content, provider: 'openai' });
  } catch (err) {
    console.error('[API] /api/chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`🌐 Frontend will be served from: ${frontendPath}`);
});

// ── CATCH-ALL ROUTE FOR REACT ROUTER ────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

export default app;
