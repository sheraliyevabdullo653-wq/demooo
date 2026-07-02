import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Phone, Calendar, Star, Clock, Globe, X, CheckCircle, Video, MessageCircle, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { doctors, REGIONS } from '../data'
import { useLocationStore } from '../store'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

function DoctorCard({ doc, onBook }) {
  const { t } = useTranslation()
  const [imgErr, setImgErr] = useState(false)
  const specialtyKey = `doctors.specialties.${doc.specialty}`

  return (
    <motion.div
      className="card flex flex-col gap-5 group cursor-pointer"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Photo */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
        {!imgErr ? (
          <img
            src={doc.image}
            alt={doc.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">{doc.avatar || '👨‍⚕️'}</div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700 ${
          doc.available
            ? 'bg-emerald-500/90 text-white'
            : 'bg-slate-500/80 text-white'
        } backdrop-blur-sm`}>
          <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
          {doc.available ? t('doctors.available') : t('doctors.busy')}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-display font-800 text-xl text-slate-900 dark:text-white mb-1">{doc.name}</h3>
        <p className="text-primary-600 dark:text-primary-400 text-sm font-600 mb-2">{t(specialtyKey)}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">{doc.bio}</p>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 glass rounded-xl">
            <p className="font-700 text-sm text-slate-900 dark:text-white">{doc.experience}y</p>
            <p className="text-[10px] text-slate-500">Experience</p>
          </div>
          <div className="text-center p-2 glass rounded-xl">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="font-700 text-sm text-slate-900 dark:text-white">{doc.rating}</span>
            </div>
            <p className="text-[10px] text-slate-500">Rating</p>
          </div>
          <div className="text-center p-2 glass rounded-xl">
            <p className="font-700 text-sm text-slate-900 dark:text-white">{doc.reviews}</p>
            <p className="text-[10px] text-slate-500">Reviews</p>
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 mb-4">
          <Globe size={12} className="text-slate-400" />
          <div className="flex gap-1.5">
            {doc.languages.map((lang) => (
              <span key={lang} className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase px-2 py-0.5 rounded-lg font-700">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Price + buttons */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-display font-800 text-2xl text-slate-900 dark:text-white">${doc.price}</span>
            <span className="text-xs text-slate-400 ml-1">/session</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => onBook(doc)}
              disabled={!doc.available}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-600 transition-all ${
                doc.available
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              whileHover={doc.available ? { scale: 1.05 } : {}}
              whileTap={doc.available ? { scale: 0.95 } : {}}
            >
              <Calendar size={14} />
              {t('doctors.book')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BookingModal({ doctor, onClose }) {
  const { t } = useTranslation()
  const { selectedRegion } = useLocationStore()
  const [form, setForm] = useState({ name: '', phone: '', date: '', reason: '', region: selectedRegion || 'tashkent_city' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.date) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      toast.success(t('toast.appt_success'))
      setTimeout(onClose, 2000)
    }, 1800)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className="glass-strong rounded-3xl p-5 sm:p-8 w-full max-w-lg shadow-2xl"
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {success ? (
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="font-display font-800 text-2xl text-slate-900 dark:text-white mb-2">Booked!</h3>
            <p className="text-slate-500 dark:text-slate-400">{t('doctors.success')}</p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-800 text-2xl text-slate-900 dark:text-white">{t('doctors.form_title')}</h2>
                <p className="text-sm text-slate-500 mt-1">with {doctor?.name}</p>
              </div>
              <motion.button onClick={onClose} className="btn-ghost" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <X size={20} />
              </motion.button>
            </div>

            {/* Doctor mini card */}
            {doctor && (
              <div className="flex items-center gap-3 p-3 sm:p-4 glass rounded-2xl mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-700 text-sm sm:text-base text-slate-900 dark:text-white truncate">{doctor.name}</p>
                  <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 truncate">{t(`doctors.specialties.${doctor.specialty}`)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-800 text-base sm:text-lg text-slate-900 dark:text-white">${doctor?.price}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">per session</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-700 text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{t('doctors.name')}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="text-xs font-700 text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{t('doctors.phone')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    required
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-700 text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{t('checkout.region')}</label>
                <div className="relative">
                  <select 
                    value={form.region || 'tashkent_city'} 
                    onChange={e => setForm({...form, region: e.target.value})}
                    className="input-base appearance-none pr-10"
                  >
                    {REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{t(`map.regions.${r.id}`)}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-700 text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{t('doctors.date')}</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="input-base"
                />
              </div>
              <div>
                <label className="text-xs font-700 text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{t('doctors.reason')}</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Brief description of your concern..."
                  rows={2}
                  className="input-base resize-none"
                />
              </div>

              {/* Visit type */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  [Video, 'Video Call'],
                  [MessageCircle, 'In-Person'],
                ].map(([Icon, label]) => (
                  <button type="button" key={label} className="flex items-center gap-2 p-3 glass rounded-xl text-sm font-600 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-4 text-base rounded-2xl mt-2"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    Processing...
                  </span>
                ) : (
                  <><Calendar size={16} /> {t('doctors.submit')}</>
                )}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Doctors() {
  const { t } = useTranslation()
  const { selectedRegion, setRegion } = useLocationStore()
  const [selectedDoc, setSelectedDoc] = useState(null)

  const filteredDoctors = doctors.filter(d => d.regionId === selectedRegion)

  return (
    <main className="min-h-screen pt-20 mesh-bg relative">
      <div className="noise absolute inset-0 pointer-events-none" />
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header */}
        <motion.div className="text-center mb-10" {...fadeUp()}>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            {t('doctors.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto mb-8">
            {t('doctors.subtitle')}
          </p>

          {/* Region selector */}
          <div className="flex justify-center mb-10">
            <div className="glass p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full no-scrollbar">
              {['tashkent_city', 'samarkand', 'bukhara', 'fergana', 'andijan'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegion(reg)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-700 whitespace-nowrap transition-all ${
                    selectedRegion === reg ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {t(`map.regions.${reg}`)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-14"
          {...fadeUp(0.1)}
        >
          {[[`${filteredDoctors.length}`, 'Specialists'], ['4.8★', 'Avg. Rating'], ['24/7', 'Services']].map(([val, label]) => (
            <div key={label} className="card text-center px-2 py-4 sm:p-4">
              <p className="font-display font-800 text-2xl gradient-text">{val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Doctor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                layout
              >
                <DoctorCard doc={doc} onBook={() => setSelectedDoc(doc)} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
              <p className="text-4xl mb-4">👨‍⚕️</p>
              <h3 className="font-display font-700 text-xl">No specialist found in this region</h3>
              <p className="text-slate-500 mt-2">Try selecting another region like Tashkent or Samarkand.</p>
            </div>
          )}
        </div>

        {/* Emergency banner */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-center relative overflow-hidden"
          {...fadeUp(0.3)}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <p className="text-4xl mb-3">🚨</p>
            <h3 className="font-display font-800 text-2xl mb-2">Medical Emergency?</h3>
            <p className="text-white/80 mb-5">Call our 24/7 emergency line immediately</p>
            <motion.a
              href="tel:+998711234567"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-rose-600 font-display font-700 shadow-xl"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} />
              +998 71 123-45-67
            </motion.a>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <BookingModal doctor={selectedDoc} onClose={() => setSelectedDoc(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}
