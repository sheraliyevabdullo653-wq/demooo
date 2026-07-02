export const locales = {
  uz: {
    welcome: "👋 @Medicore1_bot botiga xush kelibsiz! Tibbiy yordamchingiz sizga xizmat ko'rsatishga tayyor.\n\nIltimos, tilni tanlang:",
    select_language: "Tilni tanlang:",
    register_title: "📝 Ro'yxatdan o'tish",
    enter_name: "Iltimos, ism va familiyangizni kiriting (Masalan: Alisher Usmonov):",
    share_phone: "📱 Telefon raqamingizni yuborish uchun quyidagi tugmani bosing:",
    btn_share_phone: "📞 Telefon raqamini yuborish",
    select_region: "📍 Yashash viloyatingizni tanlang:",
    select_district: "📌 Tumanni tanlang:",
    reg_success: "🎉 Tabriklaymiz! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.",
    
    // Main Menu
    menu_call_doctor: "📞 Shifokor chaqirish",
    menu_sos: "🚨 SOS Tez yordam",
    menu_order_medicine: "💊 Dori buyurtma qilish",
    menu_nearest_pharmacy: "📍 Eng yaqin dorixona",
    menu_nearest_clinic: "🏥 Eng yaqin poliklinika",
    menu_ai_assistant: "🤖 AI Tibbiy Yordamchi",
    menu_consultation: "💬 Online konsultatsiya",
    menu_medical_card: "💳 Tibbiy karta",
    menu_reminders: "🔔 Bildirishnomalar",
    menu_premium_analysis: "💎 Premium AI Analiz",
    menu_premium_recipe: "📝 Premium AI Retsept",
    menu_family_profile: "👥 Oilaviy Profil",
    menu_pregnancy: "🤰 Homiladorlik",
    menu_stats: "📊 Sog'liq Statistikasi",
    menu_queue: "📅 Navbat Bron Qilish",
    menu_settings: "⚙️ Sozlamalar",
    menu_admin: "👑 Admin Panel",
    
    main_menu_text: "🏥 **MedicalCore Bosh Sahifa**\n\nQuyidagi xizmatlardan birini tanlang:",
    back: "⬅️ Orqaga",
    cancel: "❌ Bekor qilish",
    confirm: "✅ Tasdiqlash",
    
    // Doctor Booking
    doctor_select_specialty: "Shifokor ixtisosligini tanlang:",
    doctor_select_time: "Sana va vaqtni tanlang (Masalan: 15.06.2026 14:00):",
    doctor_enter_address: "Shifokor borishi kerak bo'lgan manzilni kiriting:",
    doctor_confirm: "📋 **Buyurtma ma'lumotlari:**\n\n👨‍⚕️ Shifokor: {specialty}\n📅 Vaqt: {time}\n📍 Manzil: {address}\n\nTasdiqlaysizmi?",
    doctor_booked: "✅ Shifokor chaqiruvi qabul qilindi! Tez orada shifokor siz bilan bog'lanadi.\n\nBuyurtma ID: #{id}",
    doctor_history: "📜 **Buyurtmalar tarixi:**\n\n",
    doctor_no_history: "Sizda hali shifokor chaqirish tarixi mavjud emas.",

    // SOS
    sos_warning: "🚨 **DIQQAT! Tez yordam chaqirish.**\n\nJoylashuvingizni yuborish orqali tez yordam operatorlarimiz sizni osongina topishadi.",
    sos_btn: "📍 Joylashuvni yuborish (SOS)",
    sos_received: "🚨 **SOS Qabul qilindi!**\n\nSizning koordinatalaringiz tez yordam brigadasiga yuborildi. Operator tez orada siz bilan bog'lanadi!\n📞 Favqulodda aloqa: +998 (71) 103",

    // Medicine Order
    med_search_prompt: "💊 Dori nomini kiriting yoki shifokor retsepti rasmini yuboring:",
    med_searching: "🔍 Qidirilmoqda: *{query}*...",
    med_not_found: "❌ Kechirasiz, bunday dori topilmadi. Retsept rasmini yuklab ko'rishingiz mumkin.",
    med_found_list: "Dorilar ro'yxati:",
    med_add_cart: "🛒 Savatga qo'shish",
    med_cart_added: "✅ {name} savatga qo'shildi!",
    med_cart_empty: "Sizning savatingiz bo'sh.",
    med_cart_title: "🛒 **Sizning savatingiz:**\n\n{items}\n💵 **Jami:** {total} so'm",
    med_checkout: "💳 Buyurtma berish",
    med_enter_address: "Yetkazib berish manzilini kiriting:",
    med_order_success: "✅ Buyurtmangiz muvaffaqiyatli qabul qilindi!\n\nBuyurtma ID: #{id}\nHolati: *Tayyorlanmoqda*",
    med_order_status: "📦 **Buyurtma holati:**\nID: #{id}\nDorilar: {items}\nHolat: {status}",

    // Nearest Pharmacy & Clinic
    gps_prompt: "📍 Eng yaqin dorixona yoki poliklinikalarni topish uchun GPS joylashuvingizni yuboring:",
    gps_btn: "📍 Joylashuvni ulashish",
    pharmacy_list_title: "📍 **Yaqin atrofdagi dorixonalar:**\n\n",
    clinic_list_title: "🏥 **Yaqin atrofdagi poliklinikalar:**\n\n",
    distance_meters: "{distance} metr",
    distance_km: "{distance} km",

    // AI Medical Assistant
    ai_prompt: "🤖 **AI Tibbiy Yordamchi**\n\nSimptomlaringizni yozib qoldiring. AI sizga taxminiy tashxis va qaysi shifokorga murojaat qilish kerakligini aytadi.\n\n⚠️ *Diqqat: AI maslahati rasmiy shifokor xulosasi o'rnini bosa olmaydi!*",
    ai_analyzing: "🤖 AI simptomlarni tahlil qilmoqda. Iltimos, kuting...",
    ai_error: "Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi.",

    // Online Consultation
    consultation_prompt: "💬 **Online konsultatsiya xizmati**\n\nShifokorlarimiz bilan to'g'ridan-to'g'ri aloqaga chiqing.",
    consultation_chat: "💬 Shifokor bilan chat boshlash",
    consultation_audio: "📞 Audio qo'ng'iroq",
    consultation_video: "📹 Video qo'ng'iroq (havola)",
    consultation_connecting: "🔄 Shifokor bilan bog'lanmoqda...",
    consultation_started: "✅ Aloqa o'rnatildi! Shifokor: *Dr. Shaxboz* sizning savollaringizga javob berishga tayyor.",
    consultation_video_link: "🔗 Video konsultatsiya havolasi:\nhttps://zoom.us/j/medicalcore-{id}",

    // Medical Card
    medcard_title: "💳 **Sizning Tibbiy Kartangiz**\n\nBu yerda tahlillar, retseptlar va shifokor xulosalari saqlanadi.",
    medcard_upload_prompt: "Tahlil natijasi yoki retsept rasmini yuklang:",
    medcard_uploaded: "✅ Hujjat tibbiy kartangizga muvaffaqiyatli saqlandi!",
    medcard_view_history: "📋 Saqlangan hujjatlar soni: {count}",

    // Reminders
    reminder_title: "🔔 **Bildirishnomalar va Eslatmalar**",
    reminder_add_btn: "➕ Yangi eslatma qo'shish",
    reminder_enter_title: "Nimani eslatish kerak? (Masalan: Paratsetamol ichish):",
    reminder_enter_time: "Eslatma vaqtini kiriting (Masalan: 08:00 yoki 20:30):",
    reminder_added: "✅ Eslatma muvaffaqiyatli o'rnatildi!",
    reminder_list: "📋 **Sizning faol eslatmalaringiz:**\n\n",
    reminder_no_list: "Eslatmalar mavjud emas.",

    // Premium Features
    premium_alert: "👑 **Premium Funksiya**\n\nUshbu imkoniyatdan foydalanish uchun Premium obunani faollashtirishingiz kerak.",
    premium_activate_btn: "👑 Premiumga obuna bo'lish (9 900 so'm/oy)",
    premium_activated: "🎉 Tabriklaymiz! Sizda MedicalCore Premium muvaffaqiyatli faollashtirildi!",
    
    // AI Analiz & AI Recipe Reader
    ai_analiz_prompt: "💎 **Premium AI Analiz**\n\nTahlil natijangiz (qon tahlili, UTT va b.) rasmini yuklang, AI tushuntirib beradi.",
    ai_recipe_prompt: "📝 **Premium AI Retsept O'qish**\n\nQo'lda yozilgan retsept rasmini yuklang, AI dorilarni aniqlab beradi.",
    ai_image_processing: "🧠 AI rasmni tahlil qilmoqda. Bu biroz vaqt olishi mumkin...",

    // Family Profile
    family_title: "👥 **Oilaviy Profil**\n\nAkkauntingizga oila a'zolaringizni qo'shing va ularning tibbiy ma'lumotlarini boshqaring.",
    family_add_btn: "➕ A'zo qo'shish",
    family_enter_name: "Oila a'zongizning ismini kiriting:",
    family_enter_relation: "Qarindoshlik aloqasi (Farzand, Ota, Ona, Turmush o'rtog'i):",
    family_added: "✅ Oila a'zosi muvaffaqiyatli qo'shildi!",

    // Pregnancy Tracker
    pregnancy_prompt: "🤰 **Homiladorlik Kuzatuvi**\n\nHomiladorlik haftasini kiriting (1-42):",
    pregnancy_info: "🤰 **{week}-hafta tavsiyalari:**\n\n👶 Bola kattaligi: {size}\n📝 Tavsiyalar: {tips}\n📅 Shifokor qabuli: {appointment}",

    // Health Stats
    stats_title: "📊 **Sog'liq Statistikasi**\n\nO'lchov natijalarini kiriting:",
    stats_bp: "🩸 Qon bosimi (Masalan: 120/80)",
    stats_weight: "⚖️ Vazn (kg) (Masalan: 70)",
    stats_sugar: "🍭 Qand miqdori (Masalan: 5.5)",
    stats_chart_btn: "📉 Grafikni ko'rish",
    stats_entered: "✅ Ma'lumot saqlandi!",

    // Queue Booking
    queue_title: "📅 **Navbat Bron Qilish**\n\nKlinika yoki laboratoriyani tanlang:",
    queue_success: "✅ Navbat muvaffaqiyatli bron qilindi! Navbat raqamingiz: #{num}\nKlinika: {clinic}\nSana: {date}"
  },
  ru: {
    welcome: "👋 Добро пожаловать в @Medicore1_bot! Ваш медицинский помощник готов к работе.\n\nПожалуйста, выберите язык:",
    select_language: "Выберите язык:",
    register_title: "📝 Регистрация",
    enter_name: "Пожалуйста, введите имя и фамилию (Например: Алишер Усманов):",
    share_phone: "📱 Нажмите кнопку ниже для отправки номера телефона:",
    btn_share_phone: "📞 Отправить номер телефона",
    select_region: "📍 Выберите вашу область:",
    select_district: "📌 Выберите ваш район:",
    reg_success: "🎉 Поздравляем! Вы успешно зарегистрировались.",
    
    // Main Menu
    menu_call_doctor: "📞 Вызов врача",
    menu_sos: "🚨 SOS Помощь",
    menu_order_medicine: "💊 Заказ лекарств",
    menu_nearest_pharmacy: "📍 Ближайшая аптека",
    menu_nearest_clinic: "🏥 Ближайшая клиника",
    menu_ai_assistant: "🤖 AI Медпомощник",
    menu_consultation: "💬 Онлайн консультация",
    menu_medical_card: "💳 Медкарта",
    menu_reminders: "🔔 Напоминания",
    menu_premium_analysis: "💎 Premium AI Анализ",
    menu_premium_recipe: "📝 Premium AI Рецепт",
    menu_family_profile: "👥 Семейный профиль",
    menu_pregnancy: "🤰 Беременность",
    menu_stats: "📊 Статистика здоровья",
    menu_queue: "📅 Запись в очередь",
    menu_settings: "⚙️ Настройки",
    menu_admin: "👑 Админ панель",
    
    main_menu_text: "🏥 **Главное меню MedicalCore**\n\nВыберите одну из услуг:",
    back: "⬅️ Назад",
    cancel: "❌ Отмена",
    confirm: "✅ Подтвердить",
    
    // Doctor Booking
    doctor_select_specialty: "Выберите специальность врача:",
    doctor_select_time: "Выберите дату и время (Например: 15.06.2026 14:00):",
    doctor_enter_address: "Введите адрес вызова врача:",
    doctor_confirm: "📋 **Детали заказа:**\n\n👨‍⚕️ Врач: {specialty}\n📅 Время: {time}\n📍 Адрес: {address}\n\nПодтверждаете?",
    doctor_booked: "✅ Вызов врача принят! Скоро врач свяжется с вами.\n\nID заказа: #{id}",
    doctor_history: "📜 **История вызовов:**\n\n",
    doctor_no_history: "У вас пока нет истории вызовов врача.",

    // SOS
    sos_warning: "🚨 **ВНИМАНИЕ! Вызов экстренной помощи.**\n\nОтправьте геолокацию, чтобы наши операторы могли быстро вас найти.",
    sos_btn: "📍 Отправить геопозицию (SOS)",
    sos_received: "🚨 **SOS Принят!**\n\nВаши координаты отправлены бригаде скорой помощи. Оператор свяжется с вами в ближайшее время!\n📞 Экстренная связь: +998 (71) 103",

    // Medicine Order
    med_search_prompt: "💊 Введите название лекарства или отправьте фото рецепта:",
    med_searching: "🔍 Поиск: *{query}*...",
    med_not_found: "❌ К сожалению, такое лекарство не найдено. Вы можете загрузить фото рецепта.",
    med_found_list: "Список найденных лекарств:",
    med_add_cart: "🛒 Добавить в корзину",
    med_cart_added: "✅ {name} добавлен в корзину!",
    med_cart_empty: "Ваша корзина пуста.",
    med_cart_title: "🛒 **Ваша корзина:**\n\n{items}\n💵 **Итого:** {total} сум",
    med_checkout: "💳 Оформить заказ",
    med_enter_address: "Введите адрес доставки:",
    med_order_success: "✅ Ваш заказ успешно принят!\n\nID заказа: #{id}\nСтатус: *Готовится к отправке*",
    med_order_status: "📦 **Статус заказа:**\nID: #{id}\nТовары: {items}\nСтатус: {status}",

    // Nearest Pharmacy & Clinic
    gps_prompt: "📍 Отправьте ваше местоположение по GPS, чтобы найти ближайшие аптеки или клиники:",
    gps_btn: "📍 Поделиться локацией",
    pharmacy_list_title: "📍 **Ближайшие аптеки:**\n\n",
    clinic_list_title: "🏥 **Ближайшие клиники:**\n\n",
    distance_meters: "{distance} метров",
    distance_km: "{distance} км",

    // AI Medical Assistant
    ai_prompt: "🤖 **AI Медицинский помощник**\n\nОпишите свои симптомы. ИИ подскажет вероятный диагноз и порекомендует нужного врача.\n\n⚠️ *Внимание: Советы ИИ не заменяют официальное заключение врача!*",
    ai_analyzing: "🤖 ИИ анализирует симптомы. Пожалуйста, подождите...",
    ai_error: "Извините, произошла ошибка при подключении к ИИ.",

    // Online Consultation
    consultation_prompt: "💬 **Служба онлайн-консультаций**\n\nСвяжитесь напрямую с нашими врачами.",
    consultation_chat: "💬 Чат с врачом",
    consultation_audio: "📞 Аудиозвонок",
    consultation_video: "📹 Видеозвонок (ссылка)",
    consultation_connecting: "🔄 Подключение к врачу...",
    consultation_started: "✅ Связь установлена! Врач: *Др. Шахбоз* готов ответить на ваши вопросы.",
    consultation_video_link: "🔗 Ссылка на видеоконсультацию:\nhttps://zoom.us/j/medicalcore-{id}",

    // Medical Card
    medcard_title: "💳 **Ваша медицинская карта**\n\nЗдесь хранятся анализы, рецепты и медицинская история.",
    medcard_upload_prompt: "Загрузите файл анализа или фото рецепта:",
    medcard_uploaded: "✅ Документ успешно сохранен в вашу медкарту!",
    medcard_view_history: "📋 Количество сохраненных документов: {count}",

    // Reminders
    reminder_title: "🔔 **Уведомления и Напоминания**",
    reminder_add_btn: "➕ Добавить напоминание",
    reminder_enter_title: "О чем напомнить? (Например: Принять Парацетамол):",
    reminder_enter_time: "Введите время напоминания (Например: 08:00 или 20:30):",
    reminder_added: "✅ Напоминание успешно установлено!",
    reminder_list: "📋 **Ваши активные напоминания:**\n\n",
    reminder_no_list: "Напоминания отсутствуют.",

    // Premium Features
    premium_alert: "👑 **Премиум Функция**\n\nДля использования этой функции вам необходимо активировать Премиум подписку.",
    premium_activate_btn: "👑 Оформить Премиум (9 900 сум/мес)",
    premium_activated: "🎉 Поздравляем! MedicalCore Premium успешно активирован!",
    
    // AI Analiz & AI Recipe Reader
    ai_analiz_prompt: "💎 **Premium AI Анализ**\n\nЗагрузите фото результатов анализа (кровь, УЗИ и т.д.), ИИ расшифрует их.",
    ai_recipe_prompt: "📝 **Premium AI Рецепт**\n\nЗагрузите фото рукописного рецепта, ИИ определит названия лекарств.",
    ai_image_processing: "🧠 ИИ анализирует изображение. Это может занять некоторое время...",

    // Family Profile
    family_title: "👥 **Семейный профиль**\n\nДобавьте членов семьи в свой аккаунт для управления их медкартами.",
    family_add_btn: "➕ Добавить члена семьи",
    family_enter_name: "Введите имя члена семьи:",
    family_enter_relation: "Степень родства (Ребенок, Отец, Мать, Супруг/а):",
    family_added: "✅ Член семьи успешно добавлен!",

    // Pregnancy Tracker
    pregnancy_prompt: "🤰 **Наблюдение беременности**\n\nВведите неделю беременности (1-42):",
    pregnancy_info: "🤰 **Советы для {week}-й недели:**\n\n👶 Размер плода: {size}\n📝 Рекомендации: {tips}\n📅 Визит к врачу: {appointment}",

    // Health Stats
    stats_title: "📊 **Статистика здоровья**\n\nВведите данные измерений:",
    stats_bp: "🩸 Давление (Например: 120/80)",
    stats_weight: "⚖️ Вес (кг) (Например: 70)",
    stats_sugar: "🍭 Сахар в крови (Например: 5.5)",
    stats_chart_btn: "📉 Показать график",
    stats_entered: "✅ Данные сохранены!",

    // Queue Booking
    queue_title: "📅 **Запись в очередь**\n\nВыберите клинику или лабораторию:",
    queue_success: "✅ Очередь забронирована! Ваш номер: #{num}\nКлиника: {clinic}\nДата: {date}"
  },
  en: {
    welcome: "👋 Welcome to @Medicore1_bot! Your personal medical assistant is ready to help.\n\nPlease select your language:",
    select_language: "Select language:",
    register_title: "📝 Registration",
    enter_name: "Please enter your first and last name (Example: John Doe):",
    share_phone: "📱 Click the button below to share your phone number:",
    btn_share_phone: "📞 Send Phone Number",
    select_region: "📍 Select your region:",
    select_district: "📌 Select your district:",
    reg_success: "🎉 Congratulations! You have registered successfully.",
    
    // Main Menu
    menu_call_doctor: "📞 Call a Doctor",
    menu_sos: "🚨 SOS Emergency",
    menu_order_medicine: "💊 Order Medicine",
    menu_nearest_pharmacy: "📍 Nearest Pharmacy",
    menu_nearest_clinic: "🏥 Nearest Clinic",
    menu_ai_assistant: "🤖 AI Medical Assistant",
    menu_consultation: "💬 Online Consultation",
    menu_medical_card: "💳 Medical Card",
    menu_reminders: "🔔 Reminders",
    menu_premium_analysis: "💎 Premium AI Analysis",
    menu_premium_recipe: "📝 Premium AI Recipe",
    menu_family_profile: "👥 Family Profile",
    menu_pregnancy: "🤰 Pregnancy Tracker",
    menu_stats: "📊 Health Stats",
    menu_queue: "📅 Book Queue",
    menu_settings: "⚙️ Settings",
    menu_admin: "👑 Admin Panel",
    
    main_menu_text: "🏥 **MedicalCore Home**\n\nSelect one of our services:",
    back: "⬅️ Back",
    cancel: "❌ Cancel",
    confirm: "✅ Confirm",
    
    // Doctor Booking
    doctor_select_specialty: "Select doctor specialty:",
    doctor_select_time: "Choose date & time (Example: 15.06.2026 14:00):",
    doctor_enter_address: "Enter the home visit address:",
    doctor_confirm: "📋 **Order Details:**\n\n👨‍⚕️ Doctor: {specialty}\n📅 Time: {time}\n📍 Address: {address}\n\nConfirm booking?",
    doctor_booked: "✅ Doctor call registered! A medical coordinator will contact you shortly.\n\nOrder ID: #{id}",
    doctor_history: "📜 **Booking History:**\n\n",
    doctor_no_history: "You have no doctor call history yet.",

    // SOS
    sos_warning: "🚨 **WARNING! Calling emergency services.**\n\nShare your GPS location so emergency operators can locate you instantly.",
    sos_btn: "📍 Send Location (SOS)",
    sos_received: "🚨 **SOS Received!**\n\nYour coordinates have been dispatched to the nearest ambulance unit. An operator will contact you shortly!\n📞 Emergency Hotline: +998 (71) 103",

    // Medicine Order
    med_search_prompt: "💊 Enter medicine name or upload prescription image:",
    med_searching: "🔍 Searching for: *{query}*...",
    med_not_found: "❌ Sorry, medicine not found. You can upload a prescription image.",
    med_found_list: "Found medicines:",
    med_add_cart: "🛒 Add to Cart",
    med_cart_added: "✅ {name} added to cart!",
    med_cart_empty: "Your cart is empty.",
    med_cart_title: "🛒 **Your Cart:**\n\n{items}\n💵 **Total:** {total} UZS",
    med_checkout: "💳 Checkout",
    med_enter_address: "Enter delivery address:",
    med_order_success: "✅ Your order has been placed successfully!\n\nOrder ID: #{id}\nStatus: *Preparing*",
    med_order_status: "📦 **Order Status:**\nID: #{id}\nItems: {items}\nStatus: {status}",

    // Nearest Pharmacy & Clinic
    gps_prompt: "📍 Send your GPS location to find the nearest pharmacies or medical clinics:",
    gps_btn: "📍 Share Location",
    pharmacy_list_title: "📍 **Nearest Pharmacies:**\n\n",
    clinic_list_title: "🏥 **Nearest Clinics:**\n\n",
    distance_meters: "{distance} meters",
    distance_km: "{distance} km",

    // AI Medical Assistant
    ai_prompt: "🤖 **AI Medical Assistant**\n\nDescribe your symptoms. AI will provide potential conditions and suggest the right doctor specialty.\n\n⚠️ *Warning: AI advice is not a replacement for professional medical diagnosis!*",
    ai_analyzing: "🤖 AI is analyzing your symptoms. Please wait...",
    ai_error: "Sorry, an error occurred while connecting to AI.",

    // Online Consultation
    consultation_prompt: "💬 **Online Consultation Service**\n\nConnect directly with our doctors.",
    consultation_chat: "💬 Chat with Doctor",
    consultation_audio: "📞 Audio Call",
    consultation_video: "📹 Video Call (link)",
    consultation_connecting: "🔄 Connecting to physician...",
    consultation_started: "✅ Connection established! Doctor: *Dr. Shaxboz* is ready to consult you.",
    consultation_video_link: "🔗 Video consultation link:\nhttps://zoom.us/j/medicalcore-{id}",

    // Medical Card
    medcard_title: "💳 **Your Medical Card**\n\nAll your lab tests, prescriptions, and medical histories stored in one place.",
    medcard_upload_prompt: "Upload lab test reports or prescription photos:",
    medcard_uploaded: "✅ Document saved to your medical card successfully!",
    medcard_view_history: "📋 Saved documents: {count}",

    // Reminders
    reminder_title: "🔔 **Notifications & Reminders**",
    reminder_add_btn: "➕ Add Reminder",
    reminder_enter_title: "What to remind? (Example: Take Paracetamol):",
    reminder_enter_time: "Enter reminder time (Example: 08:00 or 20:30):",
    reminder_added: "✅ Reminder set successfully!",
    reminder_list: "📋 **Your Active Reminders:**\n\n",
    reminder_no_list: "No reminders set.",

    // Premium Features
    premium_alert: "👑 **Premium Feature**\n\nYou need to subscribe to Premium plan to access this feature.",
    premium_activate_btn: "👑 Get Premium (9,900 UZS/month)",
    premium_activated: "🎉 Congratulations! MedicalCore Premium activated successfully!",
    
    // AI Analiz & AI Recipe Reader
    ai_analiz_prompt: "💎 **Premium AI Analysis**\n\nUpload lab result images (blood test, ultrasound, etc.). AI will translate and explain details.",
    ai_recipe_prompt: "📝 **Premium AI Recipe Reader**\n\nUpload a handwritten prescription. AI will detect and output medicine names.",
    ai_image_processing: "🧠 AI is analyzing the image. This may take a moment...",

    // Family Profile
    family_title: "👥 **Family Profile**\n\nAdd family members to manage their health records under your account.",
    family_add_btn: "➕ Add Member",
    family_enter_name: "Enter family member's name:",
    family_enter_relation: "Relation (Child, Father, Mother, Spouse):",
    family_added: "✅ Family member added successfully!",

    // Pregnancy Tracker
    pregnancy_prompt: "🤰 **Pregnancy Tracker**\n\nEnter pregnancy week (1-42):",
    pregnancy_info: "🤰 **Recommendations for Week {week}:**\n\n👶 Baby size: {size}\n📝 Advice: {tips}\n📅 Doctor visit: {appointment}",

    // Health Stats
    stats_title: "📊 **Health Statistics**\n\nEnter biometric readings:",
    stats_bp: "🩸 Blood Pressure (Example: 120/80)",
    stats_weight: "⚖️ Weight (kg) (Example: 70)",
    stats_sugar: "🍭 Blood Sugar (Example: 5.5)",
    stats_chart_btn: "📉 View Graph",
    stats_entered: "✅ Biometrics saved!",

    // Queue Booking
    queue_title: "📅 **Queue Booking**\n\nSelect clinic or laboratory:",
    queue_success: "✅ Queue booked successfully! Your number: #{num}\nClinic: {clinic}\nDate: {date}"
  }
};

export const regions = [
  "Toshkent shahri",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
  "Xorazm viloyati",
  "Qoraqalpog'iston Respublikasi"
];

export const districts = {
  "Toshkent shahri": ["Chilonzor", "Yunusobod", "Mirzo Ulug'bek", "Yashnobod", "Mirobod", "Shayxontohur", "Uchtepa", "Olmazor", "Yakkasaroy", "Sergeli", "Bektemir"],
  "Andijon viloyati": ["Andijon shahar", "Asaka", "Shahrixon", "Qorasuv", "Xonobod", "Izboskan", "Marhamat", "Paxtaobod"],
  "Buxoro viloyati": ["Buxoro shahar", "G'ijduvon", "Kogon", "Qorako'l", "Vobkent", "Jondor", "Olot", "Peshku"],
  "Farg'ona viloyati": ["Farg'ona shahar", "Qo'qon", "Marg'ilon", "Rishton", "Oltiariq", "Quva", "Bag'dod", "Uchko'prik"],
  "Jizzax viloyati": ["Jizzax shahar", "Zomin", "G'allaorol", "Do'stlik", "Baxmal", "Arnasoy", "Zafarobod"],
  "Namangan viloyati": ["Namangan shahar", "Chust", "Pop", "Kosonsoy", "Uychi", "Yangiqo'rg'on", "To'raqo'rg'on"],
  "Navoiy viloyati": ["Navoiy shahar", "Zarafshon", "Karmana", "Qiziltepa", "Nurota", "Uchquduq", "Xatirchi"],
  "Qashqadaryo viloyati": ["Karshi shahar", "Shahrisabz", "Kitob", "Koson", "Chiroqchi", "Yakkabog'", "G'uzor", "Qamashi"],
  "Samarqand viloyati": ["Samarqand shahar", "Kattaqo'rg'on", "Urgut", "Bulung'ur", "Jomboy", "Payariq", "Narpay", "Ishtixon"],
  "Sirdaryo viloyati": ["Guliston shahar", "Shirin", "Yangiyer", "Sirdaryo", "Boyovut", "Oqoltin", "Sayxunobod"],
  "Surxondaryo viloyati": ["Termiz shahar", "Sherobod", "Denov", "Sho'rchi", "Jarqo'rg'on", "Boysun", "Sariosiyo", "Qumqo'rg'on"],
  "Xorazm viloyati": ["Urganch shahar", "Xiva", "Gurlan", "Shovot", "Qo'shko'pir", "Bog'ot", "Xazorasp", "Yangiariq"],
  "Qoraqalpog'iston Respublikasi": ["Nukus shahar", "Qo'ng'irot", "To'rtko'l", "Beruniy", "Chimboy", "Xo'jayli", "Mo'ynoq", "Amudaryo"]
};
