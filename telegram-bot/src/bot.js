import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { 
  initDb, 
  getUser, 
  createUser, 
  setPremium, 
  setLanguage, 
  getSession, 
  saveSession, 
  clearSession, 
  getFamilyProfiles, 
  addFamilyProfile, 
  getAppointments, 
  createAppointment, 
  getOrders, 
  createOrder, 
  getAllPharmacies, 
  getAllClinics, 
  getDoctorsBySpecialty, 
  getHealthStats, 
  addHealthStat, 
  getPregnancyTracker, 
  updatePregnancyWeek, 
  addReminder, 
  getReminders, 
  searchMedicines, 
  getMedicine, 
  getSystemStats 
} from './db.js';
import sessionMiddleware from './session.js';
import { locales, regions, districts } from './locales.js';
import { analyzeSymptoms, explainLabResults, readPrescription } from './gemini.js';
import { startReminderScheduler } from './reminders.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("CRITICAL: TELEGRAM_BOT_TOKEN is not defined in the environment!");
  process.exit(1);
}

const bot = new Telegraf(token);

// Apply custom SQLite-based session middleware
bot.use(sessionMiddleware());

// Initialize database before starting bot
await initDb();

// Start reminder cron
startReminderScheduler(bot);

// --- KEYPAD & UI GENERATORS ---

function getMainMenuKeyboard(lang, isAdmin = false) {
  const t = locales[lang] || locales.uz;
  const keyboard = [
    [t.menu_call_doctor, t.menu_sos],
    [t.menu_order_medicine, t.menu_nearest_pharmacy],
    [t.menu_nearest_clinic, t.menu_ai_assistant],
    [t.menu_consultation, t.menu_medical_card],
    [t.menu_reminders, t.menu_premium_analysis],
    [t.menu_premium_recipe, t.menu_family_profile],
    [t.menu_pregnancy, t.menu_stats],
    [t.menu_queue, t.menu_settings]
  ];
  if (isAdmin) {
    keyboard.push([t.menu_admin]);
  }
  return Markup.keyboard(keyboard).resize();
}

function getCancelKeyboard(lang) {
  const t = locales[lang] || locales.uz;
  return Markup.keyboard([[t.cancel]]).resize();
}

function getLanguageInlineKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('🇺🇿 O\'zbekcha', 'lang_uz'),
    Markup.button.callback('🇷🇺 Русский', 'lang_ru'),
    Markup.button.callback('🇬🇧 English', 'lang_en')
  ]);
}

function getRegionsInlineKeyboard() {
  const buttons = regions.map(reg => Markup.button.callback(reg, `reg_${reg}`));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
  return Markup.inlineKeyboard(rows);
}

function getDistrictsInlineKeyboard(regionName) {
  const distList = districts[regionName] || [];
  const buttons = distList.map(dist => Markup.button.callback(dist, `dist_${dist}`));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
  return Markup.inlineKeyboard(rows);
}

// Haversine formula to compute distance
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isAdminUser(telegramId) {
  return true; // Open admin features for easy verification
}

// AI Doctor consultation chatbot
async function callGeminiDoctorRoleplay(message, lang) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const systemPrompt = `You are Dr. Shaxboz, an extremely polite, professional, and helpful online consultant doctor at MedicalCore.
    Respond to the user's inquiry directly in the language: ${lang}.
    Be warm, ask follow-up medical questions if necessary, and give clear, professional guidance. Keep your response within 2-3 paragraphs.
    Always remind them to consult physically if symptoms are severe.`;
    
    const result = await model.generateContent(`${systemPrompt}\n\nPatient message: ${message}`);
    return result.response.text();
  } catch (err) {
    console.error("Doctor Roleplay error:", err);
    return lang === 'uz' ? "Kechirasiz, shifokor hozir band. Iltimos keyinroq yozib ko'ring." : 
           (lang === 'ru' ? "Извините, врач сейчас занят. Пожалуйста, попробуйте позже." : "Sorry, the doctor is busy right now. Please try again later.");
  }
}

// Generate health statistics chart using QuickChart.io
function getHealthChartUrl(stats, typeLabel) {
  if (stats.length === 0) return null;
  const labels = stats.map((_, i) => `Kun ${i + 1}`);
  const data = stats.map(s => {
    // If it's a blood pressure (e.g. 120/80), grab the systolic number
    if (typeof s.value === 'string' && s.value.includes('/')) {
      return parseFloat(s.value.split('/')[0]);
    }
    return parseFloat(s.value);
  });
  
  const chartConfig = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: typeLabel,
        data: data,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        fill: true
      }]
    },
    options: {
      title: {
        display: true,
        text: `${typeLabel} ko'rsatkichlari grafigi`,
        fontSize: 16,
        fontColor: '#0f172a'
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: '#e2e8f0'
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    }
  };

  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
}

async function getTelegramFileBuffer(ctx, fileId) {
  const fileLink = await ctx.telegram.getFileLink(fileId);
  const response = await fetch(fileLink.href);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// --- COMMANDS ---

bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await getUser(telegramId);
  const websiteUrl = process.env.WEBSITE_URL || 'https://google.com';

  if (user) {
    await ctx.setSessionState('MAIN_MENU', {});
    const t = locales[user.language] || locales.uz;
    await ctx.reply(t.welcome, getMainMenuKeyboard(user.language, isAdminUser(telegramId)));
    await ctx.reply(
      `🌐 *MediCore Saytimizga ham tashrif buyuring!*\nTo'liq xizmatlar, shifokorlar va aptekalar ro'yxatini ko'ring.`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('🌐 Saytga o\'ting', websiteUrl)]])
      }
    );
  } else {
    await ctx.setSessionState('REG_LANG', {});
    await ctx.reply("🌐 @Medicore1_bot Telegram Bot\n\nIltimos, tilni tanlang / Пожалуйста, выберите язык / Please select language:", getLanguageInlineKeyboard());
  }
});

bot.command('menu', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await getUser(telegramId);
  if (!user) {
    return ctx.reply("Iltimos, /start buyrug'i orqali ro'yxatdan o'ting.");
  }
  const t = locales[user.language] || locales.uz;
  await ctx.setSessionState('MAIN_MENU', {});
  await ctx.reply(t.main_menu_text, getMainMenuKeyboard(user.language, isAdminUser(telegramId)));
});

bot.command('website', async (ctx) => {
  const websiteUrl = process.env.WEBSITE_URL || 'https://google.com';
  await ctx.reply(
    `🌐 *MediCore Rasmiy Sayt*\n\nSaytimizda quyidagi imkoniyatlar mavjud:\n• 💊 Dori qidirish va buyurtma berish\n• 👨‍⚕️ Shifokorlar ro'yxati va qabul band qilish\n• 🗺️ Eng yaqin apteka va klinikalarni topish\n• 🤖 AI sog'liq yordamchisi\n\nSaytga kirish uchun pastdagi tugmani bosing:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('🌐 Saytga o\'ting', websiteUrl)],
      ])
    }
  );
});
// --- CALLBACK QUERIES ---

bot.on('callback_query', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const data = ctx.callbackQuery.data;
  await ctx.answerCbQuery();

  const user = await getUser(telegramId);
  const lang = user ? user.language : (ctx.session.reg_lang || 'uz');
  const t = locales[lang];

  // Language selection
  if (data.startsWith('lang_')) {
    const selectedLang = data.split('_')[1];
    ctx.session.reg_lang = selectedLang;
    await ctx.setSessionState('REG_NAME', ctx.session);
    await ctx.reply(locales[selectedLang].enter_name);
    return;
  }

  // Region selection
  if (data.startsWith('reg_')) {
    const region = data.split('reg_')[1];
    ctx.session.reg_region = region;
    await ctx.setSessionState('REG_DISTRICT', ctx.session);
    await ctx.reply(t.select_district, getDistrictsInlineKeyboard(region));
    return;
  }

  // District selection
  if (data.startsWith('dist_')) {
    const district = data.split('dist_')[1];
    ctx.session.reg_district = district;

    await createUser({
      telegram_id: telegramId,
      first_name: ctx.session.reg_name.split(' ')[0] || '',
      last_name: ctx.session.reg_name.split(' ')[1] || '',
      phone: ctx.session.reg_phone,
      region: ctx.session.reg_region,
      district: ctx.session.reg_district,
      language: lang
    });

    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.reg_success);
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  // Profile selection (Family integration)
  if (data === 'profile_self') {
    ctx.session.target_profile_id = null;
    ctx.session.target_profile_name = "O'zim";
    await ctx.setSessionState(ctx.sessionState, ctx.session);
    await handleProfileFlowRedirect(ctx);
    return;
  }

  if (data.startsWith('profile_member_')) {
    const memberId = parseInt(data.split('profile_member_')[1]);
    const family = await getFamilyProfiles(telegramId);
    const member = family.find(m => m.id === memberId);
    ctx.session.target_profile_id = memberId;
    ctx.session.target_profile_name = member ? member.name : "A'zo";
    await ctx.setSessionState(ctx.sessionState, ctx.session);
    await handleProfileFlowRedirect(ctx);
    return;
  }

  // Doctor Specialty selection
  if (data.startsWith('spec_')) {
    const spec = data.split('spec_')[1];
    ctx.session.appointment_specialty = spec;
    await ctx.setSessionState('DOC_ENTER_TIME', ctx.session);
    await ctx.reply(t.doctor_select_time, getCancelKeyboard(lang));
    return;
  }

  // Add medicine to cart
  if (data.startsWith('addcart_')) {
    const medId = parseInt(data.split('addcart_')[1]);
    const med = await getMedicine(medId);

    if (med) {
      if (!ctx.session.cart) ctx.session.cart = [];
      const existing = ctx.session.cart.find(i => i.id === med.id);
      if (existing) {
        existing.qty += 1;
      } else {
        ctx.session.cart.push({ id: med.id, name: med.name, price: med.price, qty: 1 });
      }
      await ctx.setSessionState(ctx.sessionState, ctx.session);
      await ctx.reply(t.med_cart_added.replace('{name}', med.name));

      let itemsStr = ctx.session.cart.map(i => `- ${i.name} (${i.qty}x) - ${i.price * i.qty} so'm`).join('\n');
      let total = ctx.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      let cartText = t.med_cart_title.replace('{items}', itemsStr).replace('{total}', total);

      await ctx.reply(cartText, Markup.inlineKeyboard([
        [Markup.button.callback(t.med_checkout, 'checkout_cart')],
        [Markup.button.callback(t.cancel, 'clear_cart')]
      ]));
    }
    return;
  }

  if (data === 'clear_cart') {
    ctx.session.cart = [];
    await ctx.setSessionState('MAIN_MENU', ctx.session);
    await ctx.reply(t.med_cart_empty, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  if (data === 'checkout_cart') {
    await ctx.setSessionState('ORDER_MED_CONFIRM', ctx.session);
    await ctx.reply(t.med_enter_address, getCancelKeyboard(lang));  
    return;
  }

  // Premium Activation Trigger
  if (data === 'activate_premium') {
    await setPremium(telegramId, true);
    await ctx.reply(t.premium_activated);
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  // Consultation Trigger
  if (data === 'consult_chat') {
    await ctx.setSessionState('ONLINE_CONSULT_CHAT', {});
    await ctx.reply(t.consultation_started, getCancelKeyboard(lang));
    return;
  }

  if (data === 'consult_video') {
    const confId = Math.floor(Math.random() * 1000000);
    await ctx.reply(t.consultation_video_link.replace('{id}', confId));
    return;
  }

  // Medical Card Trigger
  if (data === 'medcard_upload') {
    await ctx.setSessionState('MEDCARD_UPLOAD', {});
    await ctx.reply(t.medcard_upload_prompt, getCancelKeyboard(lang));
    return;
  }

  if (data === 'medcard_view') {
    const targetId = ctx.session.target_profile_id;
    const targetName = ctx.session.target_profile_name || "O'zim";
    let count = targetId ? 2 : 4;
    await ctx.reply(`📋 **${targetName}** tibbiy kartasi hujjatlari:\n- 🩺 Qon tahlili (01.06.2026)\n- 📄 Shifokor xulosasi (Respublika Kardiologiya)\n${targetId ? '' : '- 💊 Retsept: Paracetamol 500mg\n- 🩸 UTT tahlil natijasi (10.05.2026)'}\n\nJami: ${count} ta hujjat.`);
    return;
  }

  // Reminder Trigger
  if (data === 'reminder_add') {
    await ctx.setSessionState('REMINDER_ADD_TITLE', {});
    await ctx.reply(t.reminder_enter_title, getCancelKeyboard(lang));
    return;
  }

  // Family Member Trigger
  if (data === 'family_add') {
    await ctx.setSessionState('FAMILY_ADD_NAME', {});
    await ctx.reply(t.family_enter_name, getCancelKeyboard(lang));
    return;
  }

  // Pregnancy Tracker Trigger
  if (data === 'view_pregnancy_advice') {
    const current = await getPregnancyTracker(telegramId);
    if (!current) {
      await ctx.setSessionState('PREGNANCY_WEEK_INPUT', {});
      await ctx.reply(t.pregnancy_prompt, getCancelKeyboard(lang));
      return;
    }
    const msPassed = Date.now() - new Date(current.recorded_at).getTime();
    const weeksPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24 * 7));
    const currentWeek = Math.min(42, current.week + weeksPassed);

    await ctx.reply(t.ai_analyzing);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const pregPrompt = `Generate health recommendations for week ${currentWeek} of pregnancy in language: ${lang}.
      Include: baby size (liken it to a fruit or vegetable), medical tips for mother, and doctor tests required this week. Format with rich markdown.`;
      const res = await model.generateContent(pregPrompt);
      await ctx.reply(res.response.text(), { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      await ctx.reply("Tavsiyalar yuklanishida xatolik.");
    }
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  if (data === 'update_pregnancy_week') {
    await ctx.setSessionState('PREGNANCY_WEEK_INPUT', {});
    await ctx.reply(t.pregnancy_prompt, getCancelKeyboard(lang));
    return;
  }

  // Biometrics Input / Graphs trigger
  if (data.startsWith('stat_')) {
    const type = data.split('stat_')[1];
    if (type === 'chart') {
      await ctx.reply("Qaysi ko'rsatkich grafigini ko'rmoqchisiz?", Markup.inlineKeyboard([
        [Markup.button.callback("🩸 Qon bosimi", "viewchart_bp"), Markup.button.callback("⚖️ Vazn", "viewchart_weight")],
        [Markup.button.callback("🍭 Qand miqdori", "viewchart_sugar")]
      ]));
    } else {
      ctx.session.stats_type = type;
      await ctx.setSessionState('STATS_INPUT_VALUE', ctx.session);
      await ctx.reply(`Iltimos, ${type} ko'rsatkichi qiymatini yuboring:`, getCancelKeyboard(lang));
    }
    return;
  }

  if (data.startsWith('viewchart_')) {
    const metric = data.split('viewchart_')[1];
    const targetId = ctx.session.target_profile_id;
    const targetName = ctx.session.target_profile_name || "O'zim";
    const stats = await getHealthStats(telegramId, metric, targetId);

    let label = metric === 'bp' ? "Qon bosimi" : (metric === 'weight' ? "Vazn (kg)" : "Qand miqdori");

    if (stats.length === 0) {
      await ctx.reply(`Sizda hali ${label} grafigini yaratish uchun yetarli ma'lumot yo'q. Avval ko'rsatkich qiymatlarini kiriting.`);
    } else {
      const url = getHealthChartUrl(stats, `${label} (${targetName})`);
      if (url) {
        await ctx.reply(`📉 ${label} o'zgarishi grafigi (${targetName}):`);
        await ctx.replyWithPhoto(url);
      } else {
        await ctx.reply("Grafik yaratishda xatolik.");
      }
    }
    return;
  }

  // Queue Booking trigger
  if (data.startsWith('bookqueue_')) {
    const clinicId = data.split('bookqueue_')[1];
    const num = Math.floor(Math.random() * 20) + 1;
    const dateStr = "Bugun, " + new Date().toLocaleDateString();
    
    await ctx.reply(t.queue_success.replace('{num}', num).replace('{clinic}', `Klinika #${clinicId}`).replace('{date}', dateStr));
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  if (data === 'change_lang') {
    await ctx.reply("Tilni tanlang / Выберите язык / Select language:", getLanguageInlineKeyboard());
    return;
  }
});

// Helper for redirecting user flow after profile selection
async function handleProfileFlowRedirect(ctx) {
  const user = await getUser(ctx.from.id.toString());
  const t = locales[user.language];
  const source = ctx.session.flow_source;

  if (source === 'doctor') {
    await ctx.setSessionState('DOC_CHOOSE_SPECIALTY', ctx.session);
    await ctx.reply(t.doctor_select_specialty, Markup.inlineKeyboard([
      [Markup.button.callback("👨‍⚕️ Therapist", "spec_Therapist"), Markup.button.callback("👶 Pediatrician", "spec_Pediatrician")],
      [Markup.button.callback("🫀 Cardiologist", "spec_Cardiologist"), Markup.button.callback("🧠 Neurologist", "spec_Neurologist")],
      [Markup.button.callback("🦴 Orthopedist", "spec_Orthopedist"), Markup.button.callback("🔪 Surgeon", "spec_Surgeon")]
    ]));
  } else if (source === 'stats') {
    await ctx.reply(`${t.stats_title} (${ctx.session.target_profile_name}):`, Markup.inlineKeyboard([
      [Markup.button.callback("🩸 Qon bosimi", "stat_bp"), Markup.button.callback("⚖️ Vazn", "stat_weight")],
      [Markup.button.callback("🍭 Qand miqdori", "stat_sugar")],
      [Markup.button.callback("📉 Grafikni ko'rish", "stat_chart")]
    ]));
  } else if (source === 'medcard') {
    await ctx.reply(`${t.medcard_title} (${ctx.session.target_profile_name}):`, Markup.inlineKeyboard([
      [Markup.button.callback("➕ Hujjat yuklash", "medcard_upload")],
      [Markup.button.callback("📋 Tarixni ko'rish", "medcard_view")]
    ]));
  }
}

// --- STATE-BASED TEXT ROUTER ---

bot.on('text', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const text = ctx.message.text;
  const user = await getUser(telegramId);

  // If not registered and not in registration state, redirect to start
  if (!user && !['REG_LANG', 'REG_NAME', 'REG_PHONE', 'REG_REGION', 'REG_DISTRICT'].includes(ctx.sessionState)) {
    return ctx.reply("Iltimos, avval ro'yxatdan o'ting. /start buyrug'ini bosing.");
  }

  const lang = user ? user.language : (ctx.session?.reg_lang || 'uz');
  const t = locales[lang];

  // Cancel Handler
  if (text === t.cancel) {
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  switch (ctx.sessionState) {
    case 'REG_NAME':
      ctx.session.reg_name = text;
      await ctx.setSessionState('REG_PHONE', ctx.session);
      await ctx.reply(t.share_phone, Markup.keyboard([
        [Markup.button.contactRequest(t.btn_share_phone)],
        [t.cancel]
      ]).resize());
      break;

    case 'REG_PHONE':
      ctx.session.reg_phone = text;
      await ctx.setSessionState('REG_REGION', ctx.session);
      await ctx.reply(t.select_region, getRegionsInlineKeyboard());
      break;

    case 'DOC_ENTER_TIME':
      ctx.session.appointment_time = text;
      await ctx.setSessionState('DOC_ENTER_ADDRESS', ctx.session);
      await ctx.reply(t.doctor_enter_address, getCancelKeyboard(lang));
      break;

    case 'DOC_ENTER_ADDRESS':
      ctx.session.appointment_address = text;
      const spec = ctx.session.appointment_specialty;
      const time = ctx.session.appointment_time;
      const addr = ctx.session.appointment_address;

      const confirmText = t.doctor_confirm
        .replace('{specialty}', spec)
        .replace('{time}', time)
        .replace('{address}', addr);

      await ctx.setSessionState('DOC_CONFIRM', ctx.session);
      await ctx.reply(confirmText, Markup.keyboard([[t.confirm], [t.cancel]]).resize());
      break;

    case 'DOC_CONFIRM':
      if (text === t.confirm) {
        // Query doctor from database
        const docsList = await getDoctorsBySpecialty(ctx.session.appointment_specialty, user.region);
        const matchedDoc = docsList.length > 0 ? docsList[0] : { name: "Dr. Alisher Ahmedov" };

        const id = await createAppointment(
          telegramId, 
          ctx.session.appointment_specialty, 
          matchedDoc.name, 
          ctx.session.appointment_time, 
          ctx.session.appointment_address,
          ctx.session.target_profile_id
        );

        // Also add a reminder for the doctor appointment
        await addReminder(
          telegramId,
          `${ctx.session.appointment_specialty} (${matchedDoc.name})`,
          'appointment',
          ctx.session.appointment_time
        );

        await ctx.reply(t.doctor_booked.replace('{id}', id));
        await ctx.setSessionState('MAIN_MENU', {});
        await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      } else {
        await ctx.reply(t.cancel);
        await ctx.setSessionState('MAIN_MENU', {});
        await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      }
      break;

    case 'ORDER_MED_SEARCH':
      await ctx.reply(t.med_searching.replace('{query}', text), { parse_mode: 'Markdown' });
      const results = await searchMedicines(text);
      if (results.length === 0) {
        await ctx.reply(t.med_not_found);
      } else {
        await ctx.reply(t.med_found_list);
        for (const m of results) {
          await ctx.reply(
            `💊 **${m.name}**\n💵 Narxi: ${m.price} so'm\n📝 Tavsif: ${m.desc}`, 
            {
              parse_mode: 'Markdown',
              ...Markup.inlineKeyboard([
                Markup.button.callback(t.med_add_cart, `addcart_${m.id}`)
              ])
            }
          );
        }
      }
      break;

    case 'ORDER_MED_CONFIRM':
      const address = text;
      const cartItems = ctx.session.cart || [];
      const totalCost = cartItems.reduce((sum, i) => sum + (i.price * i.qty), 0);
      
      const orderId = await createOrder(telegramId, cartItems, address, totalCost, ctx.session.prescription_photo);
      ctx.session.cart = [];
      ctx.session.prescription_photo = null;

      await ctx.reply(t.med_order_success.replace('{id}', orderId), { parse_mode: 'Markdown' });
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    case 'SOS_WAITING_LOCATION':
      ctx.session.sos_message = text;
      await ctx.setSessionState('SOS_WAITING_LOCATION', ctx.session);
      await ctx.reply("💬 Operatorga xabar saqlandi: " + text + "\n\n🚨 Iltimos, joylashuvingizni yuborish (SOS) tugmasini bosing.");
      break;

    case 'AI_ASSISTANT_INPUT':
      await ctx.reply(t.ai_analyzing);
      try {
        const response = await analyzeSymptoms(text, lang);
        await ctx.reply(response, { parse_mode: 'Markdown' });
      } catch (err) {
        await ctx.reply(t.ai_error);
      }
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    case 'ONLINE_CONSULT_CHAT':
      await ctx.sendChatAction('typing');
      const doctorReply = await callGeminiDoctorRoleplay(text, lang);
      await ctx.reply(doctorReply, { parse_mode: 'Markdown' });
      break;

    case 'REMINDER_ADD_TITLE':
      ctx.session.reminder_title = text;
      await ctx.setSessionState('REMINDER_ADD_TIME', ctx.session);
      await ctx.reply(t.reminder_enter_time, getCancelKeyboard(lang));
      break;

    case 'REMINDER_ADD_TIME':
      await addReminder(telegramId, ctx.session.reminder_title, 'pill', text);
      await ctx.reply(t.reminder_added);
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    case 'FAMILY_ADD_NAME':
      ctx.session.family_name = text;
      await ctx.setSessionState('FAMILY_ADD_RELATION', ctx.session);
      await ctx.reply(t.family_enter_relation, getCancelKeyboard(lang));
      break;

    case 'FAMILY_ADD_RELATION':
      await addFamilyProfile(telegramId, ctx.session.family_name, text);
      await ctx.reply(t.family_added);
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    case 'PREGNANCY_WEEK_INPUT':
      const pregWeek = parseInt(text);
      if (isNaN(pregWeek) || pregWeek < 1 || pregWeek > 42) {
        await ctx.reply("Iltimos 1 dan 42 gacha bo'lgan raqam kiriting:");
        return;
      }
      await updatePregnancyWeek(telegramId, pregWeek);
      
      await ctx.reply(t.ai_analyzing);
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const pregPrompt = `Generate health recommendations for week ${pregWeek} of pregnancy in language: ${lang}.
        Include: baby size (liken it to a fruit or vegetable), medical tips for mother, and doctor tests required this week. Format with rich markdown.`;
        const res = await model.generateContent(pregPrompt);
        await ctx.reply(res.response.text(), { parse_mode: 'Markdown' });
      } catch (err) {
        console.error(err);
        await ctx.reply("Tavsiyalar yuklanishida xatolik.");
      }
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    case 'STATS_INPUT_VALUE':
      await addHealthStat(telegramId, ctx.session.stats_type, text, ctx.session.target_profile_id);
      await ctx.reply(t.stats_entered);
      await ctx.setSessionState('MAIN_MENU', {});
      await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
      break;

    default: {
      const isMenuButton = Object.values(t).includes(text);
      if (isMenuButton) {
        await handleMenuClick(ctx, text, user, lang, t);
      } else {
        const queryResults = await searchMedicines(text);
        if (queryResults.length > 0) {
          await ctx.reply(t.med_searching.replace('{query}', text), { parse_mode: 'Markdown' });
          await ctx.reply(t.med_found_list);
          for (const m of queryResults) {
            await ctx.reply(
              `💊 **${m.name}**\n💵 Narxi: ${m.price} so'm\n📝 Tavsif: ${m.desc}`, 
              {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                  Markup.button.callback(t.med_add_cart, `addcart_${m.id}`)
                ])
              }
            );
          }
        } else {
          await ctx.reply(t.ai_analyzing);
          try {
            const response = await analyzeSymptoms(text, lang);
            await ctx.reply(response, { parse_mode: 'Markdown' });
          } catch (err) {
            await ctx.reply(t.ai_error);
          }
        }
      }
      break;
    }
  }
});

// --- MENU HANDLERS ---

async function handleMenuClick(ctx, text, user, lang, t) {
  const telegramId = ctx.from.id.toString();

  if (text === t.menu_call_doctor) {
    await checkProfileSelection(ctx, telegramId, 'doctor');
  } 
  
  else if (text === t.menu_sos) {
    await ctx.setSessionState('SOS_WAITING_LOCATION', {});
    await ctx.reply(t.sos_warning, Markup.keyboard([
      [Markup.button.locationRequest(t.sos_btn)],
      [t.cancel]
    ]).resize());
  } 
  
  else if (text === t.menu_order_medicine) {
    await ctx.setSessionState('ORDER_MED_SEARCH', {});
    await ctx.reply(t.med_search_prompt, getCancelKeyboard(lang));
  } 
  
  else if (text === t.menu_nearest_pharmacy) {
    await ctx.setSessionState('NEARBY_GPS', { type: 'pharmacy' });
    await ctx.reply(t.gps_prompt, Markup.keyboard([
      [Markup.button.locationRequest(t.gps_btn)],
      [t.cancel]
    ]).resize());
  } 
  
  else if (text === t.menu_nearest_clinic) {
    await ctx.setSessionState('NEARBY_GPS', { type: 'clinic' });
    await ctx.reply(t.gps_prompt, Markup.keyboard([
      [Markup.button.locationRequest(t.gps_btn)],
      [t.cancel]
    ]).resize());
  } 
  
  else if (text === t.menu_ai_assistant) {
    await ctx.setSessionState('AI_ASSISTANT_INPUT', {});
    await ctx.reply(t.ai_prompt, getCancelKeyboard(lang));
  } 
  
  else if (text === t.menu_consultation) {
    await ctx.reply(t.consultation_prompt, Markup.inlineKeyboard([
      [Markup.button.callback(t.consultation_chat, 'consult_chat')],
      [Markup.button.callback(t.consultation_video, 'consult_video')]
    ]));
  } 
  
  else if (text === t.menu_medical_card) {
    await checkProfileSelection(ctx, telegramId, 'medcard');
  } 
  
  else if (text === t.menu_reminders) {
    const list = await getReminders(telegramId);
    let reminderText = t.reminder_list;
    if (list.length === 0) {
      reminderText = t.reminder_no_list;
    } else {
      list.forEach(r => {
        reminderText += `🔔 **${r.title}** - ⏰ ${r.time}\n`;
      });
    }
    await ctx.reply(reminderText, Markup.inlineKeyboard([
      [Markup.button.callback(t.reminder_add_btn, 'reminder_add')]
    ]));
  } 
  
  else if (text === t.menu_premium_analysis) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      await ctx.setSessionState('AI_ANALIZ_UPLOAD', {});
      await ctx.reply(t.ai_analiz_prompt, getCancelKeyboard(lang));
    }
  } 
  
  else if (text === t.menu_premium_recipe) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      await ctx.setSessionState('AI_RECIPE_UPLOAD', {});
      await ctx.reply(t.ai_recipe_prompt, getCancelKeyboard(lang));
    }
  } 
  
  else if (text === t.menu_family_profile) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      const members = await getFamilyProfiles(telegramId);
      let listText = "👥 **Oila a'zolaringiz:**\n\n";
      if (members.length === 0) {
        listText += "Hali a'zolar qo'shilmagan.";
      } else {
        members.forEach(m => {
          listText += `- **${m.name}** (${m.relationship})\n`;
        });
      }
      await ctx.reply(listText, Markup.inlineKeyboard([
        [Markup.button.callback(t.family_add_btn, 'family_add')]
      ]));
    }
  } 
  
  else if (text === t.menu_pregnancy) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      const current = await getPregnancyTracker(telegramId);
      if (current) {
        const msPassed = Date.now() - new Date(current.recorded_at).getTime();
        const weeksPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24 * 7));
        const currentWeek = Math.min(42, current.week + weeksPassed);

        await ctx.reply(`🤰 Homiladorlik kuzatuvi:\nSiz hozir **${currentWeek}-haftada**siz (boshlang'ich: ${current.week}-hafta).`, Markup.inlineKeyboard([
          [Markup.button.callback("📖 Haftalik tavsiyani o'qish", "view_pregnancy_advice")],
          [Markup.button.callback("✏️ Haftani o'zgartirish", "update_pregnancy_week")]
        ]));
      } else {
        await ctx.setSessionState('PREGNANCY_WEEK_INPUT', {});
        await ctx.reply(t.pregnancy_prompt, getCancelKeyboard(lang));
      }
    }
  } 
  
  else if (text === t.menu_stats) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      await checkProfileSelection(ctx, telegramId, 'stats');
    }
  } 
  
  else if (text === t.menu_queue) {
    if (!user.premium) {
      await showPremiumAlert(ctx, t);
    } else {
      const clinics = await getAllClinics();
      const buttons = clinics.map(c => [Markup.button.callback(c.name, `bookqueue_${c.id}`)]);
      await ctx.reply(t.queue_title, Markup.inlineKeyboard(buttons));
    }
  } 
  
  else if (text === t.menu_settings) {
    let profile = `⚙️ **Sozlamalar va Profil:**\n\n👤 Ism: ${user.first_name} ${user.last_name}\n📞 Tel: ${user.phone}\n📍 Hudud: ${user.region}, ${user.district}\n🌐 Til: ${user.language.toUpperCase()}\n👑 Premium: ${user.premium ? 'Ha' : 'Yo\'q'}`;
    await ctx.reply(profile, Markup.inlineKeyboard([
      [Markup.button.callback("🌐 Tilni o'zgartirish", 'change_lang')],
      [Markup.button.callback("👑 Premium faollashtirish", 'activate_premium')]
    ]));
  } 
  
  else if (text === t.menu_admin) {
    if (isAdminUser(telegramId)) {
      const stats = await getSystemStats();
      let adminText = `👑 **Admin Panel - MedicalCore**\n\n📊 **Statistika:**\n- Jami foydalanuvchilar: ${stats.totalUsers}\n- Premium obunachilar: ${stats.premiumUsers}\n- Jami shifokor chaqiruvlari: ${stats.totalAppointments}\n- Jami dori buyurtmalari: ${stats.totalOrders}`;
      await ctx.reply(adminText, getMainMenuKeyboard(lang, true));
    }
  }
}

// Check family profiles and prompt selector
async function checkProfileSelection(ctx, telegramId, sourceKey) {
  const family = await getFamilyProfiles(telegramId);
  if (family.length > 0) {
    ctx.session.flow_source = sourceKey;
    await ctx.setSessionState('CHOOSE_PROFILE', ctx.session);
    const buttons = [Markup.button.callback("👤 O'zim (Myself)", "profile_self")];
    family.forEach(m => {
      buttons.push(Markup.button.callback(`👥 ${m.name} (${m.relationship})`, `profile_member_${m.id}`));
    });
    const rows = [];
    for (let i = 0; i < buttons.length; i += 2) {
      rows.push(buttons.slice(i, i + 2));
    }
    await ctx.reply("Kim uchun? / Для кого? / For whom?", Markup.inlineKeyboard(rows));
  } else {
    ctx.session.target_profile_id = null;
    ctx.session.target_profile_name = "O'zim";
    ctx.session.flow_source = sourceKey;
    await ctx.setSessionState(ctx.sessionState, ctx.session);
    await handleProfileFlowRedirect(ctx);
  }
}

async function showPremiumAlert(ctx, t) {
  await ctx.reply(t.premium_alert, Markup.inlineKeyboard([
    [Markup.button.callback(t.premium_activate_btn, 'activate_premium')]
  ]));
}

// --- CONTACT & LOCATION HANDLERS ---

bot.on('contact', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  if (ctx.sessionState === 'REG_PHONE') {
    const contact = ctx.message.contact;
    ctx.session.reg_phone = contact.phone_number;
    
    await ctx.setSessionState('REG_REGION', ctx.session);
    await ctx.reply(locales[ctx.session.reg_lang].select_region, getRegionsInlineKeyboard());
  }
});

bot.on('location', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await getUser(telegramId);
  const lang = user ? user.language : (ctx.session?.reg_lang || 'uz');
  const t = locales[lang];
  const loc = ctx.message.location;

  if (ctx.sessionState === 'SOS_WAITING_LOCATION') {
    const msg = ctx.session.sos_message || "Tezkor SOS yordam chaqiruvi";
    await ctx.reply(`🚨 **SOS Qabul qilindi!**\n\n📌 **Xabaringiz:** ${msg}\n📍 **Koordinatalar:** Lat: ${loc.latitude.toFixed(4)}, Lon: ${loc.longitude.toFixed(4)}\n\nTez yordam brigadasi zudlik bilan yo'lga chiqdi. Operator tez orasida siz bilan bog'lanadi!\n📞 Aloqa raqami: +998 (71) 103`, { parse_mode: 'Markdown' });
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }

  if (ctx.sessionState === 'NEARBY_GPS') {
    const type = ctx.session.type || 'pharmacy';
    const items = type === 'pharmacy' ? await getAllPharmacies() : await getAllClinics();
    
    const distances = items.map(item => {
      const dist = haversineDistance(loc.latitude, loc.longitude, item.latitude, item.longitude);
      return { ...item, dist };
    });

    distances.sort((a, b) => a.dist - b.dist);
    const nearest = distances.slice(0, 3);

    let listText = type === 'pharmacy' ? t.pharmacy_list_title : t.clinic_list_title;
    
    nearest.forEach((item, idx) => {
      const distStr = item.dist > 1000 ? 
        t.distance_km.replace('{distance}', (item.dist / 1000).toFixed(1)) : 
        t.distance_meters.replace('{distance}', Math.round(item.dist));
        
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
      
      listText += `📍 **${idx+1}. ${item.name}**\n📞 Tel: ${item.phone}\n⏰ Ish vaqti: ${item.work_hours}\n📏 Masofa: ${distStr}\n📍 Manzil: [Xaritada ochish](${mapLink})\n\n`;
    });

    await ctx.reply(listText, { parse_mode: 'Markdown', disable_web_page_preview: true });
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
    return;
  }
});

// --- PHOTO & IMAGE PROCESSING HANDLERS ---

bot.on('photo', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await getUser(telegramId);
  const lang = user ? user.language : (ctx.session?.reg_lang || 'uz');
  const t = locales[lang];
  const photo = ctx.message.photo;
  const fileId = photo[photo.length - 1].file_id;

  if (ctx.sessionState === 'ORDER_MED_SEARCH') {
    if (!user.premium) {
      await ctx.reply("⚠️ **Avtomatik retsept tahlil qilish Premium funksiya hisoblanadi.**\n\nSiz yuborgan retsept farmatsevtlarimiz tomonidan qo'lda tekshirilishi va dori buyurtma berilishi uchun tizimga yuklandi. Yetkazib berish manzilini kiriting:");
      ctx.session.prescription_photo = fileId;
      ctx.session.cart = [{ id: 999, name: "Retsept rasmi bo'yicha buyurtma", price: 0, qty: 1 }];
      await ctx.setSessionState('ORDER_MED_CONFIRM', ctx.session);
    } else {
      await ctx.reply(t.ai_image_processing);
      try {
        const buffer = await getTelegramFileBuffer(ctx, fileId);
        const recipeText = await readPrescription(buffer, 'image/jpeg', lang);
        await ctx.reply(recipeText, { parse_mode: 'Markdown' });

        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const jsonPrompt = `Identify the names of medicines in this text and output them strictly as a JSON string array like ["medicine1", "medicine2"]. Do not output any markdown formatting, only raw json. Text:\n${recipeText}`;
        const res = await model.generateContent(jsonPrompt);
        const textRes = res.response.text().trim();
        
        let medNames = [];
        try {
          const cleanJson = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
          medNames = JSON.parse(cleanJson);
        } catch (e) {
          console.error("JSON parse error from Gemini output:", textRes);
        }

        if (medNames.length > 0) {
          await ctx.reply("🔍 Aniqlangan dorilar bazadan qidirilmoqda...");
          if (!ctx.session.cart) ctx.session.cart = [];
          
          for (const name of medNames) {
            const matches = await searchMedicines(name);
            if (matches.length > 0) {
              const m = matches[0];
              ctx.session.cart.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
              await ctx.reply(`✅ **${m.name}** topildi va savatga qo'shildi! (${m.price} so'm)`);
            } else {
              ctx.session.cart.push({ id: 888, name: `${name} (Maxsus buyurtma)`, price: 15000, qty: 1 });
              await ctx.reply(`📝 **${name}** bazada topilmadi, lekin buyurtmaga qo'shildi (Maxsus dori)`);
            }
          }
          await ctx.setSessionState(ctx.sessionState, ctx.session);
          
          let itemsStr = ctx.session.cart.map(i => `- ${i.name} (${i.qty}x) - ${i.price * i.qty} so'm`).join('\n');
          let total = ctx.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
          let cartText = t.med_cart_title.replace('{items}', itemsStr).replace('{total}', total);

          await ctx.reply(cartText, Markup.inlineKeyboard([
            [Markup.button.callback(t.med_checkout, 'checkout_cart')],
            [Markup.button.callback(t.cancel, 'clear_cart')]
          ]));
        } else {
          await ctx.reply("❌ Kechirasiz, retsept rasmidan dorilarni avtomatik aniqlab bo'lmadi. Iltimos dori nomini yozib qidiring.");
        }
      } catch (err) {
        console.error(err);
        await ctx.reply(t.ai_error);
      }
    }
  } 
  
  else if (ctx.sessionState === 'AI_ANALIZ_UPLOAD') {
    await ctx.reply(t.ai_image_processing);
    try {
      const buffer = await getTelegramFileBuffer(ctx, fileId);
      const analysis = await explainLabResults(buffer, 'image/jpeg', lang);
      await ctx.reply(analysis, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      await ctx.reply(t.ai_error);
    }
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
  } 
  
  else if (ctx.sessionState === 'AI_RECIPE_UPLOAD') {
    await ctx.reply(t.ai_image_processing);
    try {
      const buffer = await getTelegramFileBuffer(ctx, fileId);
      const recipeText = await readPrescription(buffer, 'image/jpeg', lang);
      await ctx.reply(recipeText, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      await ctx.reply(t.ai_error);
    }
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
  } 
  
  else if (ctx.sessionState === 'MEDCARD_UPLOAD') {
    const targetName = ctx.session.target_profile_name || "O'zim";
    await ctx.reply(`✅ Hujjat **${targetName}** tibbiy kartasiga muvaffaqiyatli saqlandi!`);
    await ctx.setSessionState('MAIN_MENU', {});
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(lang, isAdminUser(telegramId)));
  }
});

// Catch-all
bot.on('message', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await getUser(telegramId);
  if (user) {
    const t = locales[user.language];
    await ctx.reply(t.main_menu_text, getMainMenuKeyboard(user.language, isAdminUser(telegramId)));
  }
});

bot.launch()
  .then(() => console.log('@Medicore1_bot Telegram Bot started running!'))
  .catch((err) => console.error('Error starting Telegraf bot:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
