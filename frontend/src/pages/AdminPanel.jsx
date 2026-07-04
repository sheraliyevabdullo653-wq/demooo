import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ShoppingCart, Activity } from 'lucide-react';
import { fetchAdminUsers, fetchAdminAppointments, fetchAdminOrders, fetchStats } from '../api/client';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error('Bu sahifaga kirish huquqingiz yo\'q');
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, uData, aData, oData] = await Promise.all([
        fetchStats(),
        fetchAdminUsers(),
        fetchAdminAppointments(),
        fetchAdminOrders()
      ]);
      setStats(sData);
      setUsers(uData || []);
      setAppointments(aData || []);
      setOrders(oData || []);
    } catch (err) {
      toast.error('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') return <div className="min-h-screen pt-24" />;

  const tabs = [
    { id: 'overview', label: 'Umumiy', icon: Activity },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'appointments', label: 'Qabullar', icon: Calendar },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-white/10 mb-6">
            <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.name.charAt(0)}</span>
            </div>
            <h2 className="text-center font-bold text-lg">{user.name}</h2>
            <p className="text-center text-slate-500 dark:text-white/50 text-sm">Administrator</p>
          </div>
          
          <div className="glass p-2 rounded-2xl border border-slate-200 dark:border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-white/70'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="glass p-8 rounded-3xl border border-white/10 flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border border-slate-200 dark:border-white/10"
            >
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Umumiy ko'rsatkichlar</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Foydalanuvchilar (Bot)" value={stats?.users || 0} icon={Users} color="text-blue-600 dark:text-blue-400" bg="bg-blue-500/10 dark:bg-blue-500/20" />
                    <StatCard title="Web Foydalanuvchilar" value={users.length} icon={Users} color="text-purple-600 dark:text-purple-400" bg="bg-purple-500/10 dark:bg-purple-500/20" />
                    <StatCard title="Qabullar" value={stats?.appointments || appointments.length} icon={Calendar} color="text-green-600 dark:text-green-400" bg="bg-green-500/10 dark:bg-green-500/20" />
                    <StatCard title="Buyurtmalar" value={stats?.orders || orders.length} icon={ShoppingCart} color="text-orange-600 dark:text-orange-400" bg="bg-orange-500/10 dark:bg-orange-500/20" />
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Web Foydalanuvchilar</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 text-sm">
                          <th className="pb-3 font-medium">ID</th>
                          <th className="pb-3 font-medium">Ism</th>
                          <th className="pb-3 font-medium">Email</th>
                          <th className="pb-3 font-medium">Rol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="py-4">{u.id}</td>
                            <td className="py-4 font-medium">{u.name}</td>
                            <td className="py-4 text-slate-600 dark:text-white/70">{u.email}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80'}`}>
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr><td colSpan="4" className="py-4 text-center text-slate-400 dark:text-white/50">Ma'lumot yo'q</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Qabullar</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 text-sm">
                          <th className="pb-3 font-medium">User ID</th>
                          <th className="pb-3 font-medium">Shifokor / Mutaxassislik</th>
                          <th className="pb-3 font-medium">Sana & Vaqt</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map(a => (
                          <tr key={a.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="py-4">{a.user_id}</td>
                            <td className="py-4 font-medium">{a.doctor_name || a.specialty}</td>
                            <td className="py-4 text-slate-600 dark:text-white/70">{a.date_time}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-amber-500/10 dark:bg-yellow-500/20 text-amber-600 dark:text-yellow-400 font-600">
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {appointments.length === 0 && (
                          <tr><td colSpan="4" className="py-4 text-center text-slate-400 dark:text-white/50">Ma'lumot yo'q</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Buyurtmalar</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 text-sm">
                          <th className="pb-3 font-medium">Buyurtma ID</th>
                          <th className="pb-3 font-medium">User ID</th>
                          <th className="pb-3 font-medium">Umumiy narx</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="py-4">#{o.id}</td>
                            <td className="py-4 font-medium">{o.user_id}</td>
                            <td className="py-4 text-slate-600 dark:text-white/70">{o.total_price ? `${o.total_price} so'm` : 'Hisoblanmagan'}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-amber-500/10 dark:bg-yellow-500/20 text-amber-600 dark:text-yellow-400 font-600">
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan="4" className="py-4 text-center text-slate-400 dark:text-white/50">Ma'lumot yo'q</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-slate-500 dark:text-white/50 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
