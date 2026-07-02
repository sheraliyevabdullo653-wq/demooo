import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.resolve('medicalcore.db');

let db;

export async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      telegram_id TEXT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      region TEXT,
      district TEXT,
      language TEXT,
      premium INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      telegram_id TEXT PRIMARY KEY,
      state TEXT,
      data TEXT
    );

    CREATE TABLE IF NOT EXISTS family_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      name TEXT,
      relationship TEXT,
      health_notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      family_member_id INTEGER,
      doctor_name TEXT,
      specialty TEXT,
      date_time TEXT,
      address TEXT,
      status TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      items TEXT,
      prescription_photo TEXT,
      address TEXT,
      status TEXT,
      total_price REAL,
      created_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pharmacies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      latitude REAL,
      longitude REAL,
      work_hours TEXT,
      region TEXT
    );

    CREATE TABLE IF NOT EXISTS clinics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      latitude REAL,
      longitude REAL,
      work_hours TEXT,
      region TEXT
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      specialty TEXT,
      phone TEXT,
      price REAL,
      rating REAL,
      region TEXT
    );

    CREATE TABLE IF NOT EXISTS health_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      family_member_id INTEGER,
      stat_type TEXT,
      value TEXT,
      recorded_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pregnancy_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      week INTEGER,
      recorded_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      title TEXT,
      type TEXT,
      time TEXT,
      status TEXT,
      FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      desc TEXT,
      region TEXT
    );

    CREATE TABLE IF NOT EXISTS web_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT
    );
  `);

  // Seed initial admin user if not exists
  const adminCount = await db.get('SELECT COUNT(*) as count FROM web_users WHERE role = "admin"');
  if (adminCount.count === 0) {
    // We will hash password 'admin123' with bcrypt in api-server or just seed a dummy one.
    // For safety, let's not seed plain password here, we'll let api handle it, or seed an admin here.
    // We'll create admin from api or let the first signed up user be an admin if needed.
  }

  // Seed initial data if tables are empty
  const pharmacyCount = await db.get('SELECT COUNT(*) as count FROM pharmacies');
  if (pharmacyCount.count === 0) {
    console.log('Seeding initial pharmacies...');
    const seedPharmacies = [
      { name: "Grand Pharm (Markaz)", phone: "+998 71 200 00 00", address: "Toshkent sh., Amir Temur shox ko'chasi, 15", latitude: 41.3110, longitude: 69.2405, work_hours: "24/7", region: "Toshkent shahri" },
      { name: "Oxy Med (Mirobod)", phone: "+998 71 200 03 03", address: "Toshkent sh., Mirobod ko'chasi, 28", latitude: 41.2995, longitude: 69.2801, work_hours: "08:00 - 22:00", region: "Toshkent shahri" },
      { name: "Dori-Darmon (Chilonzor)", phone: "+998 71 200 01 02", address: "Toshkent sh., Qatortol ko'chasi, 60", latitude: 41.2785, longitude: 69.2222, work_hours: "24/7", region: "Toshkent shahri" },
      { name: "Sog'lom Hayot Dorixonasi", phone: "+998 73 244 11 22", address: "Farg'ona sh., Al-Farg'oniy ko'chasi, 4", latitude: 40.3864, longitude: 71.7864, work_hours: "08:00 - 23:00", region: "Farg'ona viloyati" },
      { name: "Samarkand Pharm", phone: "+998 66 233 44 55", address: "Samarqand sh., Registon ko'chasi, 12", latitude: 39.6508, longitude: 66.9654, work_hours: "24/7", region: "Samarqand viloyati" },
      { name: "Andijon Dori Assorti", phone: "+998 74 225 12 12", address: "Andijon sh., Navoiy shox ko'chasi, 18", latitude: 40.7833, longitude: 72.3500, work_hours: "08:00 - 22:00", region: "Andijon viloyati" }
    ];
    for (const ph of seedPharmacies) {
      await db.run(
        `INSERT INTO pharmacies (name, phone, address, latitude, longitude, work_hours, region) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ph.name, ph.phone, ph.address, ph.latitude, ph.longitude, ph.work_hours, ph.region]
      );
    }
  }

  const clinicCount = await db.get('SELECT COUNT(*) as count FROM clinics');
  if (clinicCount.count === 0) {
    console.log('Seeding initial clinics...');
    const seedClinics = [
      { name: "Shahar 1-sonli shifoxonasi", phone: "+998 71 233 00 00", address: "Toshkent sh., Navoiy ko'chasi, 40", latitude: 41.3140, longitude: 69.2480, work_hours: "24/7", region: "Toshkent shahri" },
      { name: "Respublika Kardiologiya Markazi", phone: "+998 71 244 55 66", address: "Toshkent sh., Lutfiy ko'chasi, 15", latitude: 41.2785, longitude: 69.2222, work_hours: "08:00 - 18:00", region: "Toshkent shahri" },
      { name: "MDS Service Xususiy Klinikasi", phone: "+998 71 140 00 80", address: "Toshkent sh., Botkin ko'chasi, 110", latitude: 41.3195, longitude: 69.2795, work_hours: "24/7", region: "Toshkent shahri" },
      { name: "Samarqand Viloyat Poliklinikasi", phone: "+998 66 222 11 00", address: "Samarqand sh., Dahbed ko'chasi, 45", latitude: 39.6680, longitude: 66.9550, work_hours: "08:00 - 17:00", region: "Samarqand viloyati" },
      { name: "Andijon Diagnostika Markazi", phone: "+998 74 222 33 44", address: "Andijon sh., Bobur ko'chasi, 99", latitude: 40.7720, longitude: 72.3600, work_hours: "08:00 - 20:00", region: "Andijon viloyati" }
    ];
    for (const cl of seedClinics) {
      await db.run(
        `INSERT INTO clinics (name, phone, address, latitude, longitude, work_hours, region) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cl.name, cl.phone, cl.address, cl.latitude, cl.longitude, cl.work_hours, cl.region]
      );
    }
  }

  const doctorCount = await db.get('SELECT COUNT(*) as count FROM doctors');
  if (doctorCount.count === 0) {
    console.log('Seeding initial doctors...');
    const seedDoctors = [
      { name: "Dr. Alisher Ahmedov", specialty: "Therapist", phone: "+998 90 123 45 67", price: 150000, rating: 4.8, region: "Toshkent shahri" },
      { name: "Dr. Malika Karimova", specialty: "Pediatrician", phone: "+998 93 321 65 43", price: 170000, rating: 4.9, region: "Toshkent shahri" },
      { name: "Dr. Jasur Umarov", specialty: "Cardiologist", phone: "+998 97 777 88 99", price: 200000, rating: 4.7, region: "Toshkent shahri" },
      { name: "Dr. Nigora Sobirova", specialty: "Neurologist", phone: "+998 99 888 11 22", price: 180000, rating: 4.6, region: "Toshkent shahri" },
      { name: "Dr. Botir Aliyev", specialty: "Surgeon", phone: "+998 90 999 55 44", price: 250000, rating: 4.9, region: "Samarqand viloyati" },
      { name: "Dr. Shahlo Akbarova", specialty: "Pediatrician", phone: "+998 93 111 22 33", price: 120000, rating: 4.8, region: "Andijon viloyati" }
    ];
    for (const doc of seedDoctors) {
      await db.run(
        `INSERT INTO doctors (name, specialty, phone, price, rating, region) VALUES (?, ?, ?, ?, ?, ?)`,
        [doc.name, doc.specialty, doc.phone, doc.price, doc.rating, doc.region]
      );
    }
  }

  const medicineCount = await db.get('SELECT COUNT(*) as count FROM medicines');
  if (medicineCount.count === 0) {
    console.log('Seeding initial medicines...');
    const seedMedicines = [
      { name: "Paracetamol 500mg", price: 5000, desc: "Isitma va og'riq qoldiruvchi dori vositasi", region: "Barchasi" },
      { name: "Ibuprofen 400mg", price: 12000, desc: "Yallig'lanishga qarshi va og'riq qoldiruvchi", region: "Barchasi" },
      { name: "Amoxicillin 500mg", price: 25000, desc: "Keng spektrli antibiotik", region: "Barchasi" },
      { name: "No-Shpa 40mg", price: 18000, desc: "Spazmolitik dori vositasi", region: "Barchasi" },
      { name: "Ascorutin", price: 7000, desc: "Vitamin C va Rutin majmuasi, tomirlarni mustahkamlaydi", region: "Barchasi" },
      { name: "Linex", price: 45000, desc: "Probiotik, ichak mikroflorasini tiklaydi", region: "Barchasi" },
      { name: "Mezym Forte", price: 20000, desc: "Ovqat hazm qilishni yaxshilovchi ferment", region: "Barchasi" }
    ];
    for (const med of seedMedicines) {
      await db.run(
        `INSERT INTO medicines (name, price, desc, region) VALUES (?, ?, ?, ?)`,
        [med.name, med.price, med.desc, med.region]
      );
    }
  }

  console.log('SQLite Database initialized and seeded successfully.');
}

// User helper operations
export async function getUser(telegramId) {
  return await db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId.toString()]);
}

export async function createUser(user) {
  const { telegram_id, first_name, last_name, phone, region, district, language } = user;
  const createdAt = new Date().toISOString();
  await db.run(
    `INSERT INTO users (telegram_id, first_name, last_name, phone, region, district, language, premium, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
     ON CONFLICT(telegram_id) DO UPDATE SET
       first_name=excluded.first_name,
       last_name=excluded.last_name,
       phone=excluded.phone,
       region=excluded.region,
       district=excluded.district,
       language=excluded.language`,
    [telegram_id.toString(), first_name, last_name, phone, region, district, language, createdAt]
  );
}

export async function setPremium(telegramId, premiumStatus) {
  await db.run('UPDATE users SET premium = ? WHERE telegram_id = ?', [premiumStatus ? 1 : 0, telegramId.toString()]);
}

export async function setLanguage(telegramId, language) {
  await db.run('UPDATE users SET language = ? WHERE telegram_id = ?', [language, telegramId.toString()]);
}

// Session helpers
export async function getSession(telegramId) {
  const sess = await db.get('SELECT * FROM sessions WHERE telegram_id = ?', [telegramId.toString()]);
  if (!sess) return { state: 'START', data: {} };
  return {
    state: sess.state,
    data: JSON.parse(sess.data || '{}')
  };
}

export async function saveSession(telegramId, state, data = {}) {
  await db.run(
    `INSERT INTO sessions (telegram_id, state, data) VALUES (?, ?, ?)
     ON CONFLICT(telegram_id) DO UPDATE SET state = excluded.state, data = excluded.data`,
    [telegramId.toString(), state, JSON.stringify(data)]
  );
}

export async function clearSession(telegramId) {
  await db.run('DELETE FROM sessions WHERE telegram_id = ?', [telegramId.toString()]);
}

// Family Profile helpers
export async function getFamilyProfiles(telegramId) {
  return await db.all('SELECT * FROM family_profiles WHERE user_id = ?', [telegramId.toString()]);
}

export async function addFamilyProfile(telegramId, name, relationship, healthNotes = '') {
  return await db.run(
    'INSERT INTO family_profiles (user_id, name, relationship, health_notes) VALUES (?, ?, ?, ?)',
    [telegramId.toString(), name, relationship, healthNotes]
  );
}

// Appointment helpers
export async function getAppointments(telegramId) {
  return await db.all('SELECT * FROM appointments WHERE user_id = ? ORDER BY id DESC', [telegramId.toString()]);
}

export async function createAppointment(telegramId, specialty, doctorName, dateTime, address, familyMemberId = null) {
  const result = await db.run(
    `INSERT INTO appointments (user_id, family_member_id, doctor_name, specialty, date_time, address, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [telegramId.toString(), familyMemberId, doctorName, specialty, dateTime, address]
  );
  return result.lastID;
}

// Order helpers
export async function getOrders(telegramId) {
  return await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [telegramId.toString()]);
}

export async function createOrder(telegramId, items, address, totalPrice, prescriptionPhoto = null) {
  const createdAt = new Date().toISOString();
  const result = await db.run(
    `INSERT INTO orders (user_id, items, prescription_photo, address, status, total_price, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [telegramId.toString(), JSON.stringify(items), prescriptionPhoto, address, totalPrice, createdAt]
  );
  return result.lastID;
}

// Nearby helpers
export async function getAllPharmacies() {
  return await db.all('SELECT * FROM pharmacies');
}

export async function getAllClinics() {
  return await db.all('SELECT * FROM clinics');
}

export async function getDoctorsBySpecialty(specialty, region = null) {
  if (region) {
    return await db.all('SELECT * FROM doctors WHERE specialty = ? AND (region = ? OR region = "Barchasi")', [specialty, region]);
  }
  return await db.all('SELECT * FROM doctors WHERE specialty = ?', [specialty]);
}

// Health Stats helpers
export async function getHealthStats(telegramId, statType, familyMemberId = null) {
  if (familyMemberId) {
    return await db.all(
      'SELECT * FROM health_stats WHERE user_id = ? AND stat_type = ? AND family_member_id = ? ORDER BY recorded_at ASC',
      [telegramId.toString(), statType, familyMemberId]
    );
  }
  return await db.all(
    'SELECT * FROM health_stats WHERE user_id = ? AND stat_type = ? AND family_member_id IS NULL ORDER BY recorded_at ASC',
    [telegramId.toString(), statType]
  );
}

export async function addHealthStat(telegramId, statType, value, familyMemberId = null) {
  const recordedAt = new Date().toISOString();
  return await db.run(
    'INSERT INTO health_stats (user_id, family_member_id, stat_type, value, recorded_at) VALUES (?, ?, ?, ?, ?)',
    [telegramId.toString(), familyMemberId, statType, value, recordedAt]
  );
}

// Pregnancy helpers
export async function getPregnancyTracker(telegramId) {
  return await db.get('SELECT * FROM pregnancy_tracking WHERE user_id = ? ORDER BY id DESC LIMIT 1', [telegramId.toString()]);
}

export async function updatePregnancyWeek(telegramId, week) {
  const recordedAt = new Date().toISOString();
  await db.run(
    'INSERT INTO pregnancy_tracking (user_id, week, recorded_at) VALUES (?, ?, ?)',
    [telegramId.toString(), week, recordedAt]
  );
}

// Reminders helpers
export async function getReminders(telegramId) {
  return await db.all('SELECT * FROM reminders WHERE user_id = ? AND status = "active"', [telegramId.toString()]);
}

export async function addReminder(telegramId, title, type, time) {
  return await db.run(
    'INSERT INTO reminders (user_id, title, type, time, status) VALUES (?, ?, ?, ?, "active")',
    [telegramId.toString(), title, type, time]
  );
}

export async function getActiveReminders() {
  return await db.all('SELECT * FROM reminders WHERE status = "active"');
}

export async function deactivateReminder(id) {
  await db.run('UPDATE reminders SET status = "fired" WHERE id = ?', [id]);
}

// Medicines search
export async function searchMedicines(query) {
  return await db.all('SELECT * FROM medicines WHERE name LIKE ?', [`%${query}%`]);
}

export async function getMedicine(id) {
  return await db.get('SELECT * FROM medicines WHERE id = ?', [id]);
}

// Admin Panel helpers
export async function getSystemStats() {
  const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
  const premiumUsers = await db.get('SELECT COUNT(*) as count FROM users WHERE premium = 1');
  const totalAppointments = await db.get('SELECT COUNT(*) as count FROM appointments');
  const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
  return {
    totalUsers: totalUsers.count,
    premiumUsers: premiumUsers.count,
    totalAppointments: totalAppointments.count,
    totalOrders: totalOrders.count
  };
}

// Web Users Authentication helpers
export async function createWebUser(name, email, hashedPassword, role = 'user') {
  const createdAt = new Date().toISOString();
  const result = await db.run(
    'INSERT INTO web_users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, createdAt]
  );
  return result.lastID;
}

export async function getWebUserByEmail(email) {
  return await db.get('SELECT * FROM web_users WHERE email = ?', [email]);
}

export async function getWebUserById(id) {
  return await db.get('SELECT id, name, email, role, created_at FROM web_users WHERE id = ?', [id]);
}

export async function getAllWebUsers() {
  return await db.all('SELECT id, name, email, role, created_at FROM web_users ORDER BY id DESC');
}

// Fetch lists for Admin Panel
export async function getAllOrders() {
  return await db.all('SELECT * FROM orders ORDER BY id DESC');
}

export async function getAllAppointments() {
  return await db.all('SELECT * FROM appointments ORDER BY id DESC');
}
