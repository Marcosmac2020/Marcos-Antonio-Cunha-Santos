import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Printer, Download, FileText, ChevronDown, 
  ChevronUp, AlertCircle, Save, Wand2, Clock
} from 'lucide-react';

export default function LaudoPericial() {
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['identificacao']);

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const { data: selectedProcesso } = useQuery({
    queryKey: ['processo', selectedProcessoId],
    queryFn: () => fetch(`/api/processos/${selectedProcessoId}`).then(res => res.json()),
    enabled: !!selectedProcessoId
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const sections = [
    { id: 'identificacao', title: '1. Identificação', content: 'Dados do processo, partes e perito.' },
    { id: 'local', title: '2. Local Periciado', content: 'Descrição detalhada do ambiente de trabalho.' },
    { id: 'atividades', title: '3. Atividades do Reclamante', content: 'Descrição das funções e rotinas diárias.' },
    { id: 'agentes', title: '4. Agentes de Risco', content: 'Análise de agentes físicos, químicos e biológicos.' },
    { id: 'epi', title: '5. Equipamentos de Proteção', content: 'Verificação de fornecimento e uso de EPIs.' },
    { id: 'conclusao', title: '6. Conclusão Técnica', content: 'Parecer final sobre insalubridade/periculosidade.' },
    { id: 'quesitos', title: '7. Resposta aos Quesitos', content: 'Respostas fundamentadas às perguntas das partes.' },
    { id: 'anexos', title: '8. Anexos e Fotos', content: 'Documentação fotográfica e medições.' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Laudo Pericial</h1>
          <p className="text-[#5C4D32]/60">Elaboração do Laudo Técnico (Formulário 8).</p>
        </div>
        <div className="flex gap-4">
          <button className="gold-btn flex items-center gap-2 text-sm">
            <Save size={18} /> Salvar Rascunho
          </button>
          <button onClick={handlePrint} className="gold-btn flex items-center gap-2 text-sm bg-[#B8860B] text-white">
            <Printer size={18} /> Imprimir Laudo
          </button>
        </div>
      </header>

      {/* Process Selector */}
      <div className="gold-card flex flex-col md:flex-row items-center gap-6 no-print">
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
      </div>

      {selectedProcesso ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor Area */}
          <div className="lg:col-span-3 space-y-6 no-print">
            {sections.map((section) => (
              <div key={section.id} className="gold-card p-0 overflow-hidden">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex justify-between items-center p-6 hover:bg-black/5 transition-colors"
                >
                  <h3 className="text-lg font-bold text-[#B8860B]">{section.title}</h3>
                  {expandedSections.includes(section.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.includes(section.id) && (
                  <div className="p-6 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#5C4D32]/60 font-medium">{section.content}</p>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] flex items-center gap-1 hover:underline">
                        <Wand2 size={12} /> Sugerir com IA
                      </button>
                    </div>
                    {section.id === 'identificacao' ? (
                      <div className="grid grid-cols-2 gap-4 gold-card-inset p-4">
                        <div className="text-sm"><strong>Processo:</strong> {selectedProcesso.numero}</div>
                        <div className="text-sm"><strong>Vara:</strong> 31ª Vara do Trabalho de Salvador</div>
                        <div className="text-sm"><strong>Autor:</strong> {selectedProcesso.reclamante}</div>
                        <div className="text-sm"><strong>Réu:</strong> {selectedProcesso.reclamada}</div>
                      </div>
                    ) : (
                      <textarea 
                        className="gold-input min-h-[150px] text-sm leading-relaxed"
                        placeholder={`Digite aqui o conteúdo da seção ${section.title}...`}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar / Preview */}
          <div className="lg:col-span-1 space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h3 className="text-lg font-bold border-b border-black/5 pb-4">Status do Laudo</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Progresso</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-[#B8860B] rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                    <CheckCircle2 size={14} /> Identificação OK
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5C4D32]/40 font-bold">
                    <Clock size={14} /> Local Periciado Pendente
                  </div>
                </div>
              </div>
            </div>

            <div className="gold-card-inset space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Dicas de Redação</h3>
              <p className="text-xs text-[#5C4D32]/80 leading-relaxed italic">
                "Utilize termos técnicos precisos conforme as NRs. Evite adjetivos subjetivos e foque em dados mensuráveis."
              </p>
            </div>
          </div>

          {/* Print Preview (Hidden in UI, visible in Print) */}
          <div className="hidden print-only col-span-4">
            <div className="a4-page space-y-8 text-black">
              <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase">Laudo Pericial Técnico</h1>
                <p className="text-sm">Justiça do Trabalho - TRT 5ª Região</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-gray-300">1. Identificação</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Processo:</strong> {selectedProcesso.numero}</p>
                  <p><strong>Vara:</strong> 31ª Vara do Trabalho de Salvador</p>
                  <p><strong>Reclamante:</strong> {selectedProcesso.reclamante}</p>
                  <p><strong>Reclamada:</strong> {selectedProcesso.reclamada}</p>
                  <p><strong>Perito:</strong> Marcos Antonio Cunha Santos</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-gray-300">2. Local Periciado</h2>
                <p className="text-sm italic text-gray-400">[Conteúdo a ser preenchido]</p>
              </div>

              <div className="pt-24 text-center">
                <div className="w-64 h-px bg-black mx-auto mb-2"></div>
                <p className="text-sm font-bold">Marcos Antonio Cunha Santos</p>
                <p className="text-xs">Perito Judicial</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gold-card text-center py-24 space-y-4 no-print">
          <AlertCircle size={48} className="mx-auto text-[#B8860B]/20" />
          <p className="text-lg font-medium">Selecione um processo para elaborar o laudo.</p>
          <p className="text-[#5C4D32]/60">O Formulário 8 segue os padrões exigidos pela Justiça do Trabalho.</p>
        </div>
      )}
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
