"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Moon, 
  Utensils, 
  Baby, 
  Sparkles, 
  Syringe, 
  Clock,
  TrendingUp,
  Award,
  Plus,
  Check,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "dashboard" | "rotina" | "atividades" | "sono" | "vacinas";

interface SleepRecord {
  id: string;
  start_time: string;
  duration_minutes: number;
  quality: string;
}

interface Vaccine {
  id: string;
  name: string;
  age_recommendation: string;
  type: string;
  completed: boolean;
}

interface Activity {
  id: string;
  title: string;
  ageRange: string;
  category: "sensorial" | "motora" | "cognitiva";
  description: string;
}

interface Routine {
  id: string;
  type: string;
  title: string;
  time: string;
  completed: boolean;
}

interface Profile {
  baby_name: string | null;
  full_name: string | null;
}

export default function BabyZoom() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const activities: Activity[] = [
    {
      id: "1",
      title: "Hora do Espelho",
      ageRange: "0-6 meses",
      category: "sensorial",
      description: "Coloque o bebê em frente ao espelho para estimular o reconhecimento visual"
    },
    {
      id: "2",
      title: "Música e Movimento",
      ageRange: "0-6 meses",
      category: "sensorial",
      description: "Toque músicas suaves e balance suavemente o bebê no ritmo"
    },
    {
      id: "3",
      title: "Tummy Time",
      ageRange: "0-6 meses",
      category: "motora",
      description: "Coloque o bebê de bruços por 5-10 minutos para fortalecer pescoço e costas"
    },
    {
      id: "4",
      title: "Brinquedos Texturizados",
      ageRange: "3-9 meses",
      category: "sensorial",
      description: "Ofereça objetos com diferentes texturas para exploração tátil"
    },
  ];

  const sleepRoutines = [
    { age: "0-3 meses", total: "14-17h", naps: "4-5 sonecas", night: "8-9h" },
    { age: "4-6 meses", total: "12-15h", naps: "3-4 sonecas", night: "10-12h" },
    { age: "7-12 meses", total: "12-14h", naps: "2-3 sonecas", night: "11-12h" },
  ];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      setUserId(session.user.id);
      await loadUserData(session.user.id);
      await initializeUserData(session.user.id, session.user.email || '');
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (uid: string) => {
    try {
      // Carregar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Carregar sonecas
      const { data: napsData } = await supabase
        .from('naps')
        .select('*')
        .eq('user_id', uid)
        .order('start_time', { ascending: false })
        .limit(5);
      
      if (napsData) {
        setSleepRecords(napsData);
      }

      // Carregar vacinas
      const { data: vaccinesData } = await supabase
        .from('vaccines')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: true });
      
      if (vaccinesData) {
        setVaccines(vaccinesData);
      }

      // Carregar rotinas
      const { data: routinesData } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', uid)
        .eq('date', new Date().toISOString().split('T')[0])
        .order('time', { ascending: true });
      
      if (routinesData) {
        setRoutines(routinesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const initializeUserData = async (uid: string, email: string) => {
    try {
      // Verificar se perfil existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', uid)
        .single();

      if (!existingProfile) {
        // Criar perfil
        await supabase.from('profiles').insert({
          id: uid,
          email: email,
          full_name: 'Novo Usuário',
          baby_name: 'Meu Bebê',
          baby_birth_date: new Date().toISOString().split('T')[0]
        });
      }

      // Verificar se vacinas existem
      const { data: existingVaccines } = await supabase
        .from('vaccines')
        .select('id')
        .eq('user_id', uid)
        .limit(1);

      if (!existingVaccines || existingVaccines.length === 0) {
        // Criar vacinas padrão
        const defaultVaccines = [
          { name: "BCG", age_recommendation: "Ao nascer", type: "mandatory" },
          { name: "Hepatite B", age_recommendation: "Ao nascer", type: "mandatory" },
          { name: "Pentavalente (1ª dose)", age_recommendation: "2 meses", type: "mandatory" },
          { name: "VIP (1ª dose)", age_recommendation: "2 meses", type: "mandatory" },
          { name: "Rotavírus (1ª dose)", age_recommendation: "2 meses", type: "mandatory" },
          { name: "Pneumocócica (1ª dose)", age_recommendation: "2 meses", type: "mandatory" },
          { name: "Meningocócica B", age_recommendation: "3 meses", type: "optional" },
          { name: "Meningocócica ACWY", age_recommendation: "3 meses", type: "optional" },
        ];

        await supabase.from('vaccines').insert(
          defaultVaccines.map(v => ({ ...v, user_id: uid }))
        );
      }

      // Verificar se rotinas existem
      const { data: existingRoutines } = await supabase
        .from('routines')
        .select('id')
        .eq('user_id', uid)
        .limit(1);

      if (!existingRoutines || existingRoutines.length === 0) {
        // Criar rotinas padrão
        const defaultRoutines = [
          { type: "sleep", title: "Acordar", time: "08:00" },
          { type: "sleep", title: "Soneca 1", time: "10:30" },
          { type: "sleep", title: "Soneca 2", time: "14:30" },
          { type: "sleep", title: "Dormir", time: "19:00" },
          { type: "feeding", title: "Mamada", time: "08:30" },
          { type: "feeding", title: "Mamada", time: "11:00" },
          { type: "feeding", title: "Mamada", time: "14:00" },
          { type: "feeding", title: "Mamada", time: "17:00" },
          { type: "play", title: "Tummy Time", time: "09:00" },
          { type: "play", title: "Música", time: "12:00" },
          { type: "play", title: "Banho", time: "18:00" },
        ];

        await supabase.from('routines').insert(
          defaultRoutines.map(r => ({ ...r, user_id: uid }))
        );
      }

      // Recarregar dados
      await loadUserData(uid);
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const toggleVaccine = async (id: string) => {
    const vaccine = vaccines.find(v => v.id === id);
    if (!vaccine) return;

    const newCompleted = !vaccine.completed;
    
    await supabase
      .from('vaccines')
      .update({ 
        completed: newCompleted,
        completed_date: newCompleted ? new Date().toISOString().split('T')[0] : null
      })
      .eq('id', id);

    setVaccines(vaccines.map(v => 
      v.id === id ? { ...v, completed: newCompleted } : v
    ));
  };

  const addNap = async () => {
    if (!userId) return;

    const now = new Date();
    const startTime = new Date(now.getTime() - 90 * 60000); // 90 minutos atrás

    const { data, error } = await supabase
      .from('naps')
      .insert({
        user_id: userId,
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        duration_minutes: 90,
        quality: 'good',
        date: now.toISOString().split('T')[0]
      })
      .select()
      .single();

    if (data && !error) {
      setSleepRecords([data, ...sleepRecords]);
    }
  };

  const totalVaccines = vaccines.length;
  const completedVaccines = vaccines.filter(v => v.completed).length;
  const vaccineProgress = totalVaccines > 0 ? (completedVaccines / totalVaccines) * 100 : 0;

  const totalSleepToday = sleepRecords
    .filter(r => r.start_time.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((acc, r) => acc + (r.duration_minutes || 0), 0);

  const completedRoutines = routines.filter(r => r.completed).length;
  const totalRoutines = routines.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-pulse">
          <Baby className="w-16 h-16 text-[#00BFFF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0D0D0D]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#FF69B4] flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#FF69B4] bg-clip-text text-transparent">
                  BabyZoom
                </h1>
                <p className="text-xs text-white/50">
                  {profile?.baby_name || 'Carregando...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Award className="w-4 h-4 text-[#00BFFF]" />
                <span className="text-sm font-medium">{completedVaccines} badges</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-[73px] z-40 backdrop-blur-xl bg-[#0D0D0D]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "rotina", label: "Rotina", icon: Clock },
              { id: "atividades", label: "Atividades", icon: Sparkles },
              { id: "sono", label: "Sono", icon: Moon },
              { id: "vacinas", label: "Vacinas", icon: Syringe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#00BFFF] to-[#FF69B4] text-white shadow-lg shadow-[#00BFFF]/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
              <div className="text-sm text-white/50">Última atualização: agora</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-[#00BFFF]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                      <Moon className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {(totalSleepToday / 60).toFixed(1)}h
                  </div>
                  <div className="text-sm text-white/50">Sono hoje</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-[#FF69B4]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF69B4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FF69B4]/10 flex items-center justify-center">
                      <Utensils className="w-6 h-6 text-[#FF69B4]" />
                    </div>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {completedRoutines}/{totalRoutines}
                  </div>
                  <div className="text-sm text-white/50">Rotinas</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-[#00BFFF]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{sleepRecords.length}</div>
                  <div className="text-sm text-white/50">Sonecas</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-[#FF69B4]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF69B4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FF69B4]/10 flex items-center justify-center">
                      <Syringe className="w-6 h-6 text-[#FF69B4]" />
                    </div>
                    <div className="text-xs font-medium text-[#FF69B4]">{Math.round(vaccineProgress)}%</div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{completedVaccines}/{totalVaccines}</div>
                  <div className="text-sm text-white/50">Vacinas</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                {sleepRecords.slice(0, 3).map((record, i) => (
                  <div key={record.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00BFFF]/20">
                      <Moon className="w-5 h-5 text-[#00BFFF]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Soneca registrada</div>
                      <div className="text-sm text-white/50">
                        {new Date(record.start_time).toLocaleString('pt-BR', { 
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {record.duration_minutes} min
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rotina */}
        {activeTab === "rotina" && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Rotina Personalizada</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { 
                  icon: Moon, 
                  title: "Sono", 
                  items: routines.filter(r => r.type === 'sleep'),
                  color: "#00BFFF" 
                },
                { 
                  icon: Utensils, 
                  title: "Alimentação", 
                  items: routines.filter(r => r.type === 'feeding'),
                  color: "#FF69B4" 
                },
                { 
                  icon: Sparkles, 
                  title: "Brincadeiras", 
                  items: routines.filter(r => r.type === 'play'),
                  color: "#00BFFF" 
                },
              ].map((section, i) => (
                <div key={i} className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}20` }}>
                      <section.icon className="w-6 h-6" style={{ color: section.color }} />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                        <span className="text-sm flex-1">{item.time} - {item.title}</span>
                        {item.completed && <Check className="w-4 h-4 text-green-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atividades */}
        {activeTab === "atividades" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Ideias de Atividades</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <div key={activity.id} className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-[#00BFFF]/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] text-xs font-medium">
                          {activity.ageRange}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#FF69B4]/10 text-[#FF69B4] text-xs font-medium capitalize">
                          {activity.category}
                        </span>
                      </div>
                    </div>
                    <Sparkles className="w-6 h-6 text-[#00BFFF] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="text-white/70 text-sm mb-4">{activity.description}</p>
                  <button className="w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#00BFFF] hover:to-[#FF69B4] text-white font-medium transition-all duration-300">
                    Marcar como Concluída
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sono */}
        {activeTab === "sono" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Registro de Sono</h2>
              <button 
                onClick={addNap}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#FF69B4] text-white font-medium hover:shadow-lg hover:shadow-[#00BFFF]/20 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Soneca</span>
              </button>
            </div>

            {/* Sleep Records */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Sonecas Recentes</h3>
              <div className="space-y-3">
                {sleepRecords.length === 0 ? (
                  <p className="text-white/50 text-center py-8">Nenhuma soneca registrada ainda</p>
                ) : (
                  sleepRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-[#00BFFF]" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {new Date(record.start_time).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-sm text-white/50">{record.duration_minutes} minutos</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        record.quality === "excellent" ? "bg-green-500/10 text-green-400" :
                        record.quality === "good" ? "bg-blue-500/10 text-blue-400" :
                        record.quality === "fair" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {record.quality === "excellent" ? "Excelente" :
                         record.quality === "good" ? "Boa" :
                         record.quality === "fair" ? "Média" : "Ruim"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sleep Routines by Age */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Sugestões por Faixa Etária</h3>
              <div className="space-y-3">
                {sleepRoutines.map((routine, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-[#00BFFF]">{routine.age}</span>
                      <span className="text-2xl font-bold">{routine.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-[#FF69B4]" />
                        <span className="text-white/70">{routine.naps}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00BFFF]" />
                        <span className="text-white/70">{routine.night} noturno</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vacinas */}
        {activeTab === "vacinas" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Cartão de Vacinas</h2>
              <div className="text-sm text-white/50">
                {completedVaccines} de {totalVaccines} concluídas
              </div>
            </div>

            {/* Progress Bar */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Progresso Geral</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#FF69B4] bg-clip-text text-transparent">
                  {Math.round(vaccineProgress)}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00BFFF] to-[#FF69B4] transition-all duration-500 rounded-full"
                  style={{ width: `${vaccineProgress}%` }}
                />
              </div>
            </div>

            {/* Vaccines List */}
            <div className="space-y-3">
              {vaccines.length === 0 ? (
                <p className="text-white/50 text-center py-8">Carregando vacinas...</p>
              ) : (
                vaccines.map((vaccine) => (
                  <div 
                    key={vaccine.id}
                    onClick={() => toggleVaccine(vaccine.id)}
                    className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                      vaccine.completed
                        ? "bg-gradient-to-br from-[#00BFFF]/10 to-[#FF69B4]/10 border-[#00BFFF]/30"
                        : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        vaccine.completed
                          ? "bg-gradient-to-br from-[#00BFFF] to-[#FF69B4]"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        {vaccine.completed ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <Syringe className="w-6 h-6 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{vaccine.name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            vaccine.type === "mandatory"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}>
                            {vaccine.type === "mandatory" ? "Obrigatória" : "Opcional"}
                          </span>
                        </div>
                        <div className="text-sm text-white/50">{vaccine.age_recommendation}</div>
                      </div>
                      {vaccine.completed && (
                        <Award className="w-6 h-6 text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
