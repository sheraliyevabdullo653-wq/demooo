import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.role === 'admin') {
        toast.success(t('auth.login_success'));
        navigate('/admin');
      } else {
        // If logged in user is not admin, log them out immediately
        logout();
        toast.error(t('auth.admin_login_only'));
      }
    } else {
      const errorMsg = useAuthStore.getState().error || 'Email yoki parol noto\'g\'ri';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

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
            className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30"
          >
            <ShieldAlert className="w-8 h-8 text-red-500 dark:text-red-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{t('auth.admin_login')}</h1>
          <p className="text-slate-900 dark:text-white/60">{t('auth.admin_login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none"
                placeholder="admin@misol.com"
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
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? t('auth.login_loading') : t('auth.login_btn')}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
