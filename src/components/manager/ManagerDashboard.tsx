import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Compass, BookOpen, Coins, Settings, ChevronRight, Calendar, QrCode, Award } from 'lucide-react';
import { useTakonoStore } from '../../services/store';
import { apiMessage, managerApi, ManagerDestination, ManagerExplorePoint, ManagerQuiz, ManagerReward } from '../../services/managerApi';

export const ManagerDashboard: React.FC = () => {
  const { navigateTo, currentUser } = useTakonoStore();
  const [destinations, setDestinations] = useState<ManagerDestination[]>([]);
  const [points, setPoints] = useState<ManagerExplorePoint[]>([]);
  const [quizzes, setQuizzes] = useState<ManagerQuiz[]>([]);
  const [rewards, setRewards] = useState<ManagerReward[]>([]);
  const [dbMessage, setDbMessage] = useState('Memuat status database...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const list = await managerApi.getDestinations();
        if (!active) return;
        setDestinations(list);
        const destinationId = list.find((d) => d.managerId === currentUser.id)?.id || list[0]?.id;
        if (destinationId) {
          const [pointData, quizData, rewardData] = await Promise.all([
            managerApi.getExplorePoints(destinationId), managerApi.getQuizzes(destinationId), managerApi.getRewards(destinationId),
          ]);
          if (!active) return;
          setPoints(pointData); setQuizzes(quizData); setRewards(rewardData);
        }
        const status = await managerApi.getDbStatus();
        if (active) setDbMessage(status.connected ? 'MySQL terhubung' : 'Mode fallback database aktif');
      } catch (cause) { if (active) setError(apiMessage(cause)); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [currentUser.id]);

  const destination = destinations.find((d) => d.managerId === currentUser.id) || destinations[0];
  const cards = [
    { label: 'Titik Jelajah', value: points.length, icon: Compass, route: '/manager/explore-points' },
    { label: 'Kuis Dikonfigurasi', value: quizzes.length, icon: BookOpen, route: '/manager/quizzes' },
    { label: 'Reward Tersedia', value: rewards.length, icon: Award, route: '/manager/rewards' },
    { label: 'QR Code', value: 'Backend', icon: QrCode, route: '/manager/qr-codes' },
  ];

  return <div className="space-y-8 pb-16 max-w-7xl mx-auto">
    <section className="relative rounded-3xl bg-blue-600 text-white p-8 sm:p-10 overflow-hidden shadow-xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3"><span className="px-3 py-1 rounded-full bg-white/15 text-[10px] font-mono font-bold uppercase">Destination Management</span>
          <h1 className="text-3xl sm:text-5xl font-black">{destination?.name || 'Dashboard Manager'}</h1>
          <p className="text-blue-100 text-xs sm:text-sm">Kelola data destinasi yang berasal dari backend TAKONO.</p></div>
        <button type="button" onClick={() => navigateTo('/manager/destinations')} className="px-6 py-3 bg-white text-blue-600 font-extrabold text-xs uppercase rounded-2xl flex items-center gap-2"><Settings className="w-4 h-4" />Konfigurasi Destinasi</button>
      </div>
    </section>
    {loading && <div className="p-4 rounded-2xl bg-blue-50 text-blue-800 text-xs">Memuat data Manager...</div>}
    {error && <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">{error}</div>}
    <div className="text-xs text-neutral-500">Status database: <strong>{dbMessage}</strong></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{cards.map(({ label, value, icon: Icon, route }) => <button type="button" key={label} onClick={() => navigateTo(route)} className="text-left bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm hover:border-blue-300"><div className="flex items-center justify-between text-neutral-400"><span className="text-[11px] font-bold uppercase font-mono">{label}</span><Icon className="w-4 h-4 text-blue-600" /></div><div className="flex items-baseline gap-2 mt-3"><span className="text-3xl font-black font-mono text-neutral-900">{value}</span><ChevronRight className="w-4 h-4 text-blue-600" /></div></button>)}</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-xs"><div className="p-5 bg-white rounded-3xl border"><Users className="w-4 h-4 text-blue-600" /><strong className="block mt-2">Data API aktif</strong><span className="text-neutral-500">Destinasi terhubung backend</span></div><div className="p-5 bg-white rounded-3xl border"><Coins className="w-4 h-4 text-blue-600" /><strong className="block mt-2">Tidak ada mock</strong><span className="text-neutral-500">Angka dashboard berasal API</span></div><div className="p-5 bg-white rounded-3xl border"><Calendar className="w-4 h-4 text-blue-600" /><strong className="block mt-2">Event</strong><span className="text-neutral-500">Endpoint belum tersedia</span></div><div className="p-5 bg-white rounded-3xl border"><BarChart3 className="w-4 h-4 text-blue-600" /><strong className="block mt-2">Analytics</strong><span className="text-neutral-500">Menunggu endpoint analytics</span></div></div>
  </div>;
};
export default ManagerDashboard;
