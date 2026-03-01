import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, Calendar, DollarSign, Trophy, 
  ArrowUpRight, Clock, AlertCircle, CheckCircle2, Mic
} from 'lucide-react';

export default function Dashboard() {
  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const stats = [
    { label: 'Processos Ativos', value: processos.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Perícias Agendadas', value: 3, icon: Calendar, color: 'text-amber-600' },
    { label: 'Honorários Pendentes', value: 'R$ 12.500', icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Laudos Entregues', value: 12, icon: Trophy, color: 'text-purple-600' },
  ];

  const recentActivities = [
    { id: 1, type: 'status', text: 'Processo 0000389-52 alterado para "Laudo Entregue"', time: '2 horas atrás', icon: CheckCircle2 },
    { id: 2, type: 'pericia', text: 'Nova perícia agendada: Hospital Dois de Julho', time: '5 horas atrás', icon: Calendar },
    { id: 3, type: 'prazo', text: 'Prazo vencendo em 3 dias: Proc. 001234-56', time: '1 dia atrás', icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="ornate-title text-4xl font-bold mb-2">Bem-vindo, Perito</h1>
        <p className="text-[#5C4D32]/60">Aqui está o resumo do seu escritório hoje.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="gold-card flex items-center gap-4">
            <div className={`p-3 rounded-xl gold-card-inset ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C4D32]/40">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-[#B8860B]" />
              Atividade Recente
            </h2>
            <button className="text-sm font-bold text-[#B8860B] hover:underline">Ver tudo</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="gold-card flex items-start gap-4 hover:translate-x-1 transition-transform cursor-pointer">
                <div className="p-2 rounded-lg gold-card-inset text-[#B8860B]">
                  <activity.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-xs text-[#5C4D32]/60">{activity.time}</p>
                </div>
                <ArrowUpRight size={16} className="text-[#5C4D32]/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/processos" className="gold-btn flex items-center justify-center gap-2">
              <FileText size={18} />
              Novo Processo
            </Link>
            <Link to="/coleta" className="gold-btn flex items-center justify-center gap-2">
              <Mic size={18} />
              Iniciar Coleta
            </Link>
            <Link to="/financeiro" className="gold-btn flex items-center justify-center gap-2">
              <DollarSign size={18} />
              Lançar Honorários
            </Link>
          </div>

          <div className="gold-card-inset mt-8">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-[#B8860B]">Dica do Dia</h3>
            <p className="text-sm italic text-[#5C4D32]/80">
              "Lembre-se de anexar as fotos da vistoria logo após a coleta para evitar acúmulo de trabalho no final do prazo."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
