import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Calendar, User, Building2, 
  MapPin, Phone, Mail, FileText, 
  CheckCircle2, Clock, AlertCircle, Edit,
  Plus, Trash2, Mic, Clipboard, Scale, Search
} from 'lucide-react';

export default function ProcessoDetalhe() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('resumo');
  const queryClient = useQueryClient();

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo', id],
    queryFn: () => fetch(`/api/processos/${id}`).then(res => res.json())
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => fetch(`/api/processos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processo', id] });
    }
  });

  if (isLoading) return <div className="text-center py-24">Carregando...</div>;
  if (!processo) return <div className="text-center py-24">Processo não encontrado.</div>;

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: FileText },
    { id: 'ata', label: 'Ata de Nomeação', icon: Clipboard },
    { id: 'quesitos', label: 'Quesitos', icon: Search },
    { id: 'pericia', label: 'Vistoria', icon: MapPin },
    { id: 'documentos', label: 'Documentos', icon: Scale },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/processos" className="gold-btn p-2">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="ornate-title text-3xl font-bold">{processo.numero}</h1>
            <p className="text-[#5C4D32]/60">{processo.reclamante} vs {processo.reclamada}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={processo.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value)}
            className="gold-input py-2 px-4 text-sm font-bold bg-white/50"
          >
            <option value="nomeacao">Nomeação</option>
            <option value="aceitacao">Aceitação</option>
            <option value="aguardando_pericia">Aguardando Perícia</option>
            <option value="pericia_realizada">Perícia Realizada</option>
            <option value="elaborando_laudo">Elaborando Laudo</option>
            <option value="laudo_entregue">Laudo Entregue</option>
          </select>
          <button className="gold-btn p-2 text-blue-600">
            <Edit size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-4 p-2 gold-card-inset rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap font-bold
              ${activeTab === tab.id 
                ? 'gold-card text-[#B8860B]' 
                : 'text-[#5C4D32]/60 hover:text-[#5C4D32]'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'resumo' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="gold-card space-y-6">
                <h3 className="text-xl font-bold border-b border-black/5 pb-4">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Reclamante</p>
                    <p className="text-lg font-medium">{processo.reclamante}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Reclamada</p>
                    <p className="text-lg font-medium">{processo.reclamada}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Data de Nomeação</p>
                    <p className="text-lg font-medium">{new Date(processo.data_nomeacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Prazo de Entrega</p>
                    <p className="text-lg font-medium text-red-600">22/01/2026</p>
                  </div>
                </div>
                <div className="space-y-1 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Objeto da Perícia</p>
                  <p className="text-lg font-medium">{processo.objeto_pericia || 'Não informado'}</p>
                </div>
              </div>

              <div className="gold-card space-y-6">
                <h3 className="text-xl font-bold border-b border-black/5 pb-4">Contatos e Assistentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#5C4D32]/60 uppercase tracking-widest">Autor</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-[#B8860B]" />
                        <span>bbc.advconsultoria@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-[#B8860B]" />
                        <span>(71) 3018-7775</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#5C4D32]/60 uppercase tracking-widest">Réu</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-[#B8860B]" />
                        <span>administrativo@fabamed.org.br</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-[#B8860B]" />
                        <span>(71) 3033-4528</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="gold-card space-y-6">
                <h3 className="text-xl font-bold border-b border-black/5 pb-4">Próximos Passos</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Aceitação do Múnus</p>
                      <p className="text-xs text-[#5C4D32]/60">Concluído em 29/10/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Agendar Vistoria</p>
                      <p className="text-xs text-[#5C4D32]/60">Pendente</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Entrega do Laudo</p>
                      <p className="text-xs text-[#5C4D32]/60">Prazo: 22/01/2026</p>
                    </div>
                  </div>
                </div>
                <button className="gold-btn w-full text-sm">Ver Jornada Completa</button>
              </div>

              <div className="gold-card-inset space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Honorários Provisionais</h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-[#5C4D32]/60">Valor Solicitado</p>
                    <p className="text-2xl font-bold">R$ 2.500,00</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-700 mb-1">
                    Pendente
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quesitos' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Gestão de Quesitos</h3>
              <button className="gold-btn flex items-center gap-2">
                <Plus size={18} />
                Adicionar Quesito
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Autor', 'Réu', 'Juiz'].map((origem) => (
                <div key={origem} className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] px-2">{origem}</h4>
                  <div className="space-y-4">
                    <div className="gold-card p-4 space-y-3">
                      <p className="text-sm italic">"1. Descreva as atividades do reclamante no setor de UTI pediátrica."</p>
                      <div className="flex justify-between items-center pt-2 border-t border-black/5">
                        <button className="text-[10px] font-bold text-[#B8860B] hover:underline">Responder</button>
                        <Trash2 size={14} className="text-red-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="gold-card p-4 space-y-3">
                      <p className="text-sm italic">"2. Havia exposição a agentes biológicos infectocontagiosos?"</p>
                      <div className="flex justify-between items-center pt-2 border-t border-black/5">
                        <button className="text-[10px] font-bold text-[#B8860B] hover:underline">Responder</button>
                        <Trash2 size={14} className="text-red-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {['ata', 'pericia', 'documentos'].includes(activeTab) && (
          <div className="gold-card text-center py-24 space-y-4">
            <AlertCircle size={48} className="mx-auto text-[#B8860B]/20" />
            <p className="text-lg font-medium">Seção em desenvolvimento.</p>
            <p className="text-[#5C4D32]/60">Esta funcionalidade estará disponível em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
