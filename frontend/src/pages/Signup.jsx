import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(name, email, password);
    if (success) {
      toast.success(t('auth.signup_success'));
      navigate('/');
    } else {
      toast.error('Ro\'yxatdan o\'tishda xatolik yuz berdi'); // Fallback
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass relative z-10 mx-4 border border-slate-200 dark:border-white/10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30"
          >
            <UserPlus className="w-8 h-8 text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">{t('auth.signup')}</h1>
          <p className="text-slate-900 dark:text-white/60">{t('auth.signup_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white/80">{t('auth.name')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-900 dark:text-white/40" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none"
                placeholder="Ali Valiyev"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white/80">{t('auth.email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-900 dark:text-white/40" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none"
                placeholder="nom@misol.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white/80">{t('auth.password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-900 dark:text-white/40" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none"
                placeholder="Kamida 6ta belgi"
                minLength="6"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? t('auth.signup_loading') : t('auth.signup_btn')}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-slate-900 dark:text-white/60">
          {t('auth.has_account')}{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
            {t('auth.login_btn')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
