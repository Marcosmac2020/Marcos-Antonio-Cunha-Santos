import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, 
  ChevronRight, Calendar, User, Building2,
  FileText, AlertCircle
} from 'lucide-react';

export default function Processos() {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const addMutation = useMutation({
    mutationFn: (newProcesso: any) => fetch('/api/processos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProcesso)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      setIsAdding(false);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    addMutation.mutate(data);
  };

  const filteredProcessos = processos.filter((p: any) => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reclamante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reclamada.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nomeacao': return 'bg-blue-100 text-blue-700';
      case 'aceitacao': return 'bg-amber-100 text-amber-700';
      case 'aguardando_pericia': return 'bg-purple-100 text-purple-700';
      case 'pericia_realizada': return 'bg-indigo-100 text-indigo-700';
      case 'elaborando_laudo': return 'bg-orange-100 text-orange-700';
      case 'laudo_entregue': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Processos</h1>
          <p className="text-[#5C4D32]/60">Gerencie sua carteira de perícias.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="gold-btn flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Processo
        </button>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4D32]/40" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por número, reclamante ou reclamada..." 
            className="gold-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="gold-btn p-3 flex items-center gap-2">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Add Form Modal (Simplified) */}
      {isAdding && (
        <div className="gold-card animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6">Cadastrar Novo Processo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">Número do Processo</label>
              <input name="numero" required className="gold-input" placeholder="0000000-00.2025.5.05.0000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">Data da Nomeação</label>
              <input name="data_nomeacao" type="date" required className="gold-input" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">Reclamante</label>
              <input name="reclamante" required className="gold-input" placeholder="Nome do Autor" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">Reclamada</label>
              <input name="reclamada" required className="gold-input" placeholder="Nome da Empresa" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">Objeto da Perícia</label>
              <textarea name="objeto_pericia" className="gold-input min-h-[100px]" placeholder="Ex: Insalubridade e Periculosidade..." />
            </div>
            <div className="md:col-span-2 flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 font-bold text-[#5C4D32]/60 hover:text-[#5C4D32]">Cancelar</button>
              <button type="submit" className="gold-btn px-8">Salvar Processo</button>
            </div>
          </form>
        </div>
      )}

      {/* Process List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#B8860B] border-t-transparent rounded-full mb-4"></div>
            <p>Carregando processos...</p>
          </div>
        ) : filteredProcessos.length === 0 ? (
          <div className="gold-card text-center py-12">
            <AlertCircle size={48} className="mx-auto text-[#B8860B]/20 mb-4" />
            <p className="text-lg font-medium">Nenhum processo encontrado.</p>
            <p className="text-[#5C4D32]/60">Comece cadastrando seu primeiro processo.</p>
          </div>
        ) : (
          filteredProcessos.map((processo: any) => (
            <Link 
              key={processo.id} 
              to={`/processos/${processo.id}`}
              className="gold-card flex flex-col md:flex-row items-start md:items-center gap-6 hover:translate-x-1 transition-transform group"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#B8860B]">{processo.numero}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${getStatusColor(processo.status)}`}>
                    {processo.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-[#5C4D32]/40" />
                    <span className="font-medium">{processo.reclamante}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-[#5C4D32]/40" />
                    <span className="font-medium">{processo.reclamada}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-[#5C4D32]/40" />
                    <span>Nomeação: {new Date(processo.data_nomeacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C4D32]/40">Prazo</p>
                  <p className="text-sm font-bold text-red-600">22/01/2026</p>
                </div>
                <ChevronRight className="text-[#5C4D32]/20 group-hover:text-[#B8860B] transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
