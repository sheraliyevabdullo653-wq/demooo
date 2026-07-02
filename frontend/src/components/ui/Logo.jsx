import { motion } from 'framer-motion'

export default function Logo({ size = 32 }) {
  return (
    <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400 }}>
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/30"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 22 22" fill="none">
          <rect x="9" y="2" width="4" height="18" rx="2" fill="white" />
          <rect x="2" y="9" width="18" height="4" rx="2" fill="white" />
          <circle cx="17" cy="5" r="2.5" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif', fontSize: size * 0.56, letterSpacing: '-0.02em' }}>
          Medi<span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-violet-500">Core</span>
        </span>
        <span className="text-teal-500 tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: size * 0.28 }}>
          Health AI
        </span>
      </div>
    </motion.div>
  )
}
