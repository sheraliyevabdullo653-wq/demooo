import { useState, useMemo, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Clock, Navigation, Locate, CheckCircle, XCircle, Building2, Pill as PillIcon, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { pharmacies, clinics, REGIONS } from '../data'
import { useLocationStore } from '../store'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})


const LocationCard = forwardRef(({ item, index, type }, ref) => {
  const { t } = useTranslation()
  const isPharmacy = type === 'pharmacy'

  return (
    <motion.div
      ref={ref}
      layout
      className="card flex flex-col sm:flex-row items-start sm:items-center gap-5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
        item.open ? 'bg-primary-500/10' : 'bg-slate-100 dark:bg-slate-800'
      }`}>
        {isPharmacy ? '💊' : '🏥'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-display font-700 text-slate-900 dark:text-white leading-tight">{item.name}</h3>
          <span className={`badge text-[10px] ${item.open ? 'badge-success' : 'badge-error'}`}>
            {item.open ? <><CheckCircle size={9} />{t('map.open')}</> : <><XCircle size={9} />{t('map.closed')}</>}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary-500" />{item.address}</span>
          <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary-500" />{item.hours}</span>
          <span className="flex items-center gap-1.5"><Navigation size={12} className="text-primary-500" />{item.distance} {t('map.distance')}</span>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
        <motion.a
          href={`tel:${item.phone}`}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 glass rounded-xl text-sm font-600 hover:bg-primary-500/10 hover:text-primary-600 transition-all"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <Phone size={14} /> {t('map.call')}
        </motion.a>
        <motion.button
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-600 shadow-lg shadow-primary-500/20"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => window.open(`https://www.google.com/maps?q=${item.lat},${item.lng}`, '_blank')}
        >
          <Navigation size={14} /> {t('map.directions')}
        </motion.button>
      </div>
    </motion.div>
  )
})

export default function MapPage() {
  const { t } = useTranslation()
  const { coords, selectedRegion, setRegion, loading, error, fetch } = useLocationStore()
  const [viewType, setViewType] = useState('pharmacy') // pharmacy | clinic

  const currentRegionData = useMemo(() => REGIONS.find(r => r.id === selectedRegion), [selectedRegion])

  const filteredItems = useMemo(() => {
    const list = viewType === 'pharmacy' ? pharmacies : clinics
    return list.filter(item => item.regionId === selectedRegion)
  }, [viewType, selectedRegion])

  const handleLocate = () => {
    fetch()
    if (!navigator.geolocation) {
      toast.error(t('toast.location_error'))
    } else {
      toast.success('Detecting your location...')
    }
  }

  return (
    <main className="min-h-screen pt-20 mesh-bg pb-20 relative">
      <div className="noise absolute inset-0 pointer-events-none" />
      <div className="container-max px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display font-800 text-4xl sm:text-6xl text-slate-900 dark:text-white mb-4 tracking-tight">
              {t('map.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
              Find the nearest medical help in your region. We support all 12 regions of Uzbekistan.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          >
            <div className="relative group w-full sm:w-auto">
              <select
                value={selectedRegion}
                onChange={(e) => setRegion(e.target.value)}
                className="appearance-none w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-3.5 pr-12 text-sm font-700 text-slate-800 dark:text-white focus:border-primary-500 outline-none transition-all shadow-lg cursor-pointer"
              >
                {REGIONS.map(r => <option key={r.id} value={r.id}>{t(`map.regions.${r.id}`)}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            <motion.button
              onClick={handleLocate}
              disabled={loading}
              className="btn-primary w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> Locating...</>
              ) : (
                <><Locate size={16} /> Locate Me</>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Toggle & Stats */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
          <div className="flex p-1.5 glass rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setViewType('pharmacy')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-700 transition-all ${
                viewType === 'pharmacy' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <PillIcon size={16} /> Pharmacies
            </button>
            <button
              onClick={() => setViewType('clinic')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-700 transition-all ${
                viewType === 'clinic' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 size={16} /> Clinics
            </button>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <div className="flex-1 glass px-3 py-3 rounded-2xl text-center min-w-[100px] sm:min-w-[120px]">
              <p className="text-[10px] text-slate-400 font-800 uppercase tracking-wider mb-0.5">Found</p>
              <p className="font-display font-800 text-lg sm:text-xl text-slate-900 dark:text-white">{filteredItems.length}</p>
            </div>
            <div className="flex-1 glass px-3 py-3 rounded-2xl text-center min-w-[100px] sm:min-w-[120px] overflow-hidden">
              <p className="text-[10px] text-slate-400 font-800 uppercase tracking-wider mb-0.5">Region</p>
              <p className="font-display font-800 text-lg sm:text-xl gradient-text truncate">{t(`map.regions.${selectedRegion}`).split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="w-full h-[500px] glass rounded-3xl overflow-hidden relative border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            <iframe
              src="https://maps.google.com/maps?q=41.35986,69.25585&z=12&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Location Map"
            />
          </div>
          {coords && (
            <motion.p className="mt-4 text-sm text-indigo-600 font-600 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Real-time location active: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </motion.p>
          )}
        </motion.div>

        {/* Results List */}
        <div className="grid grid-cols-1 gap-4 relative">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <LocationCard key={item.id} item={item} index={i} type={viewType} />
            ))}
          </AnimatePresence>
          {filteredItems.length === 0 && (
            <motion.div
              className="glass p-20 text-center rounded-3xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <p className="text-5xl mb-6">🔍</p>
              <h3 className="font-display font-800 text-2xl text-slate-900 dark:text-white mb-2">No results in this region</h3>
              <p className="text-slate-500">Try selecting a different region or change the category.</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
