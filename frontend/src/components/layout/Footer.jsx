import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, Mail, Phone, MapPin, Send } from 'lucide-react'
import Logo from '../ui/Logo'
import { TELEGRAM_BOT_URL } from '../../api/client'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="relative mt-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo size={36} />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span>Made with</span>
              <Heart size={12} className="text-red-400 fill-red-400" />
              <span>for better health</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-display font-700 text-sm mb-5 text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.links')}
            </p>
            <nav className="flex flex-col gap-3">
              {[['/', t('nav.home')], ['/qa', t('nav.qa')], ['/pharmacy', t('nav.pharmacy')], ['/doctors', t('nav.doctors')], ['/map', t('nav.map')]].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Telegram Bot */}
          <div>
            <p className="font-display font-700 text-sm mb-5 text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.telegram')}
            </p>
            <motion.a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#229ED9] to-[#1a85b8] text-white text-sm font-600 shadow-lg hover:shadow-xl transition-all duration-300 w-fit"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Send size={16} />
              <div>
                <p className="font-700">@Medicore1_bot</p>
                <p className="text-xs text-white/70">{t('footer.telegram_desc')}</p>
              </div>
            </motion.a>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-[200px]">
              {t('telegram_bot.desc').split('—')[0]}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display font-700 text-sm mb-5 text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.contact')}
            </p>
            <div className="flex flex-col gap-3">
              {[
                [Mail, 'hello@medicore.uz'],
                [Phone, '+998 71 000-00-00'],
                [MapPin, 'Tashkent, Uzbekistan'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Icon size={14} className="text-primary-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2025 MediCore. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#229ED9] hover:text-[#1a85b8] transition-colors font-600"
              whileHover={{ scale: 1.05 }}
            >
              <Send size={12} />
              Telegram Bot
            </motion.a>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">v1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
