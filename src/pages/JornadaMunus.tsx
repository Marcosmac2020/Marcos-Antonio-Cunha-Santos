import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Trophy, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, ArrowRight, Scale, FileText, 
  Calendar, DollarSign, Search, Award
} from 'lucide-react';

const JORNADA_STEPS = [
  { id: 'nomeacao', label: 'Notificação', icon: AlertCircle, description: 'Recebimento da nomeação pelo PJE.' },
  { id: 'aceitacao', label: 'Aceitação', icon: Scale, description: 'Petição de aceite e honorários provisionais.' },
  { id: 'aguardando_pericia', label: 'Quesitos', icon: Search, description: 'Análise de quesitos e agendamento da vistoria.' },
  { id: 'pericia_realizada', label: 'Laudo', icon: FileText, description: 'Realização da perícia e elaboração do laudo.' },
  { id: 'laudo_entregue', label: 'Esclarecimentos', icon: Award, description: 'Entrega do laudo e resposta a impugnações.' },
  { id: 'honorarios_solicitados', label: 'Alvará', icon: DollarSign, description: 'Pedido de levantamento de honorários.' },
  { id: 'honorarios_recebidos', label: 'Conclusão', icon: Trophy, description: 'Honorários recebidos e processo arquivado.' },
];

export default function JornadaMunus() {
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const { data: selectedProcesso, isLoading } = useQuery({
    queryKey: ['processo', selectedProcessoId],
    queryFn: () => fetch(`/api/processos/${selectedProcessoId}`).then(res => res.json()),
    enabled: !!selectedProcessoId
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => fetch(`/api/processos/${selectedProcessoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processo', selectedProcessoId] });
      queryClient.invalidateQueries({ queryKey: ['processos'] });
    }
  });

  const currentStepIndex = selectedProcesso 
    ? JORNADA_STEPS.findIndex(s => s.id === selectedProcesso.status)
    : -1;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="ornate-title text-4xl font-bold">Jornada do Múnus</h1>
        <p className="text-[#5C4D32]/60">Acompanhe o ciclo de vida de cada perícia.</p>
      </header>

      {/* Process Selector */}
      <div className="gold-card flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-2 block px-1">Selecione o Processo</label>
          <select 
            className="gold-input"
            value={selectedProcessoId || ''}
            onChange={(e) => setSelectedProcessoId(e.target.value)}
          >
            <option value="">Escolha um processo...</option>
            {processos.map((p: any) => (
              <option key={p.id} value={p.id}>{p.numero} - {p.reclamante}</option>
            ))}
          </select>
        </div>
        {selectedProcesso && (
          <div className="flex items-center gap-4 gold-card-inset py-3 px-6 rounded-2xl">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C4D32]/40">Status Atual</p>
              <p className="text-sm font-bold text-[#B8860B]">{JORNADA_STEPS[currentStepIndex]?.label}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B]">
              <Trophy size={20} />
            </div>
          </div>
        )}
      </div>

      {selectedProcesso ? (
        <div className="space-y-12">
          {/* Timeline */}
          <div className="relative pt-8 pb-12">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-black/5 -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {JORNADA_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center text-center gap-4 group">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 z-10
                      ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : ''}
                      ${isCurrent ? 'gold-card text-[#B8860B] scale-110 ring-4 ring-[#B8860B]/20' : ''}
                      ${isPending ? 'bg-white/50 text-[#5C4D32]/20 border-2 border-dashed border-black/5' : ''}
                    `}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-bold ${isCurrent ? 'text-[#B8860B]' : 'text-[#5C4D32]'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#5C4D32]/40 leading-tight px-2">
                        {step.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-[#B8860B] text-white px-3 py-1 rounded-full animate-pulse">
                          Em Foco
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="gold-card space-y-6">
              <h2 className="text-xl font-bold border-b border-black/5 pb-4">Avançar Estágio</h2>
              <div className="space-y-4">
                <p className="text-sm text-[#5C4D32]/60">
                  Ao concluir as tarefas deste estágio, você pode avançar o processo para a próxima fase da jornada.
                </p>
                <div className="flex flex-wrap gap-4">
                  {JORNADA_STEPS.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => updateStatusMutation.mutate(step.id)}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-bold transition-all
                        ${selectedProcesso.status === step.id 
                          ? 'gold-card-inset text-[#B8860B]' 
                          : 'hover:bg-black/5 text-[#5C4D32]/40'}
                      `}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="gold-card space-y-6">
              <h2 className="text-xl font-bold border-b border-black/5 pb-4">Checklist do Estágio</h2>
              <div className="space-y-4">
                {currentStepIndex === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Baixar ata de audiência no PJE</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Verificar prazo para aceite</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Identificar objeto da perícia</span>
                    </div>
                  </div>
                )}
                {currentStepIndex === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Gerar petição de aceite</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Calcular honorários provisionais</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#B8860B]" />
                      <span>Protocolar no PJE</span>
                    </div>
                  </div>
                )}
                <p className="text-xs italic text-[#5C4D32]/40 pt-4">
                  * Complete os itens acima para garantir a conformidade do processo.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gold-card text-center py-24 space-y-4">
          <AlertCircle size={48} className="mx-auto text-[#B8860B]/20" />
          <p className="text-lg font-medium">Selecione um processo para ver sua jornada.</p>
          <p className="text-[#5C4D32]/60">A jornada ajuda você a não perder prazos e manter o fluxo de trabalho organizado.</p>
        </div>
      )}
    </div>
  );
}
