import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Mic, MicOff, Play, Square, Save, 
  Trash2, Plus, CheckCircle2, AlertCircle,
  ChevronRight, ArrowLeft, Camera, FileText
} from 'lucide-react';

export default function ColetaDados() {
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeTab, setActiveTab] = useState('checklist');
  const recognitionRef = useRef<any>(null);

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const { data: selectedProcesso } = useQuery({
    queryKey: ['processo', selectedProcessoId],
    queryFn: () => fetch(`/api/processos/${selectedProcessoId}`).then(res => res.json()),
    enabled: !!selectedProcessoId
  });

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const checklistItems = [
    { id: 1, label: 'Verificar EPIs utilizados', category: 'Segurança' },
    { id: 2, label: 'Medir nível de ruído (dB)', category: 'Agentes Físicos' },
    { id: 3, label: 'Identificar produtos químicos', category: 'Agentes Químicos' },
    { id: 4, label: 'Coletar depoimento do paradigma', category: 'Entrevistas' },
    { id: 5, label: 'Fotografar posto de trabalho', category: 'Documentação' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="ornate-title text-4xl font-bold">Coleta de Dados</h1>
        <p className="text-[#5C4D32]/60">Registre informações em tempo real durante a vistoria.</p>
      </header>

      {/* Process Selector */}
      <div className="gold-card flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-2 block px-1">Selecione o Processo da Vistoria</label>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Collection Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="flex gap-4 p-2 gold-card-inset rounded-2xl overflow-x-auto">
              <button 
                onClick={() => setActiveTab('checklist')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'checklist' ? 'gold-card text-[#B8860B]' : 'text-[#5C4D32]/60'}`}
              >
                <CheckCircle2 size={18} /> Checklist
              </button>
              <button 
                onClick={() => setActiveTab('voz')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'voz' ? 'gold-card text-[#B8860B]' : 'text-[#5C4D32]/60'}`}
              >
                <Mic size={18} /> Notas de Voz
              </button>
              <button 
                onClick={() => setActiveTab('fotos')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'fotos' ? 'gold-card text-[#B8860B]' : 'text-[#5C4D32]/60'}`}
              >
                <Camera size={18} /> Fotos
              </button>
            </div>

            {/* Tab Content */}
            <div className="gold-card min-h-[400px]">
              {activeTab === 'checklist' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b border-black/5 pb-4">Checklist de Vistoria</h3>
                  <div className="space-y-4">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 gold-card-inset rounded-xl group">
                        <input type="checkbox" className="w-6 h-6 rounded-full accent-[#B8860B] cursor-pointer" />
                        <div className="flex-1">
                          <p className="font-bold">{item.label}</p>
                          <p className="text-[10px] uppercase tracking-widest text-[#B8860B]/60 font-bold">{item.category}</p>
                        </div>
                        <button className="p-2 text-[#5C4D32]/20 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-black/5 rounded-xl text-[#5C4D32]/40 font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> Adicionar Item Personalizado
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'voz' && (
                <div className="space-y-8 flex flex-col h-full">
                  <div className="flex justify-between items-center border-b border-black/5 pb-4">
                    <h3 className="text-xl font-bold">Gravação de Notas</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#5C4D32]/60">
                        {isRecording ? 'Gravando...' : 'Pronto'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 gold-card-inset p-6 rounded-2xl relative">
                    {transcript ? (
                      <p className="text-lg leading-relaxed text-[#5C4D32] italic">
                        "{transcript}"
                      </p>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#5C4D32]/20 gap-4">
                        <Mic size={48} />
                        <p className="font-bold">Toque no microfone para começar a falar</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-6 pt-4">
                    <button 
                      onClick={toggleRecording}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl
                        ${isRecording 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'gold-card text-[#B8860B] hover:scale-105'}
                      `}
                    >
                      {isRecording ? <Square size={32} /> : <Mic size={32} />}
                    </button>
                    {transcript && !isRecording && (
                      <button className="w-20 h-20 rounded-full gold-card text-emerald-600 flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                        <Save size={32} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'fotos' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-black/5 pb-4">
                    <h3 className="text-xl font-bold">Galeria da Vistoria</h3>
                    <button className="gold-btn flex items-center gap-2 text-sm">
                      <Camera size={18} /> Abrir Câmera
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-square gold-card-inset flex flex-col items-center justify-center text-[#5C4D32]/20 gap-2 cursor-pointer hover:bg-black/5 transition-all">
                      <Plus size={32} />
                      <span className="text-xs font-bold uppercase tracking-widest">Anexar Foto</span>
                    </div>
                    {/* Placeholder for photos */}
                    <div className="aspect-square rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="aspect-square rounded-xl bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="gold-card space-y-6">
              <h3 className="text-lg font-bold border-b border-black/5 pb-4">Dados da Vistoria</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Local</p>
                  <p className="text-sm font-medium">UTI Pediátrica II - Hospital Dois de Julho</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Data/Hora</p>
                  <p className="text-sm font-medium">28/10/2025 às 09:00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Participantes</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Perito</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Adv. Autor</span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Preposto Réu</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="gold-card-inset space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Progresso da Coleta</h3>
              <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#B8860B] rounded-full"></div>
              </div>
              <p className="text-xs text-right font-bold text-[#5C4D32]/60">33% concluído</p>
            </div>

            <button className="gold-btn w-full py-4 flex items-center justify-center gap-2">
              <FileText size={20} />
              Finalizar Coleta
            </button>
          </div>
        </div>
      ) : (
        <div className="gold-card text-center py-24 space-y-4">
          <AlertCircle size={48} className="mx-auto text-[#B8860B]/20" />
          <p className="text-lg font-medium">Selecione um processo para iniciar a coleta.</p>
          <p className="text-[#5C4D32]/60">A coleta de dados otimiza o trabalho de campo e garante a precisão do laudo.</p>
        </div>
      )}
    </div>
  );
}
