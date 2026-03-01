import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  DollarSign, TrendingUp, TrendingDown, 
  Plus, Search, Filter, Calendar, 
  ArrowUpRight, ArrowDownRight, MoreVertical
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

export default function Financeiro() {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const { data: lancamentos = [], isLoading } = useQuery({
    queryKey: ['financeiro'],
    queryFn: () => fetch('/api/financeiro').then(res => res.json())
  });

  const addMutation = useMutation({
    mutationFn: (newLancamento: any) => fetch('/api/financeiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLancamento)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      setIsAdding(false);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    addMutation.mutate({
      ...data,
      valor: parseFloat(data.valor as string)
    });
  };

  const totalReceitas = lancamentos
    .filter((l: any) => l.tipo === 'receita')
    .reduce((acc: number, curr: any) => acc + curr.valor, 0);

  const totalDespesas = lancamentos
    .filter((l: any) => l.tipo === 'despesa')
    .reduce((acc: number, curr: any) => acc + curr.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const chartData = [
    { name: 'Receitas', value: totalReceitas },
    { name: 'Despesas', value: totalDespesas },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Fluxo Financeiro</h1>
          <p className="text-[#5C4D32]/60">Controle suas receitas e despesas periciais.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="gold-btn flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Lançamento
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="gold-card flex items-center gap-4">
          <div className="p-3 rounded-xl gold-card-inset text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C4D32]/40">Total Receitas</p>
            <p className="text-2xl font-bold">R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="gold-card flex items-center gap-4">
          <div className="p-3 rounded-xl gold-card-inset text-red-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C4D32]/40">Total Despesas</p>
            <p className="text-2xl font-bold">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="gold-card flex items-center gap-4">
          <div className="p-3 rounded-xl gold-card-inset text-[#B8860B]">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C4D32]/40">Saldo Atual</p>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-1 gold-card space-y-6">
          <h2 className="text-xl font-bold">Resumo Mensal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">Despesas</span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Lançamentos Recentes</h2>
            <div className="flex gap-2">
              <button className="gold-btn p-2 text-sm"><Filter size={16} /></button>
              <button className="gold-btn p-2 text-sm"><Search size={16} /></button>
            </div>
          </div>

          {isAdding && (
            <div className="gold-card-inset animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Tipo</label>
                  <select name="tipo" required className="gold-input text-sm py-2">
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Valor</label>
                  <input name="valor" type="number" step="0.01" required className="gold-input text-sm py-2" placeholder="0,00" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Data</label>
                  <input name="data_lancamento" type="date" required className="gold-input text-sm py-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Descrição</label>
                  <input name="descricao" required className="gold-input text-sm py-2" placeholder="Ex: Honorários Proc. 123" />
                </div>
                <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-xs font-bold text-[#5C4D32]/60 px-4">Cancelar</button>
                  <button type="submit" className="gold-btn text-xs py-2 px-6">Salvar</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center py-8">Carregando...</p>
            ) : lancamentos.length === 0 ? (
              <p className="text-center py-8 text-[#5C4D32]/40 italic">Nenhum lançamento registrado.</p>
            ) : (
              lancamentos.map((l: any) => (
                <div key={l.id} className="gold-card flex items-center gap-4 p-4 hover:translate-x-1 transition-transform">
                  <div className={`p-2 rounded-lg gold-card-inset ${l.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {l.tipo === 'receita' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{l.descricao}</p>
                    <p className="text-xs text-[#5C4D32]/60">{new Date(l.data_lancamento).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${l.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {l.tipo === 'receita' ? '+' : '-'} R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button className="p-2 text-[#5C4D32]/20 hover:text-[#5C4D32] transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
