import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Play, Pause, Square, 
  Wand2, FileText, Search, Copy, 
  Check, Volume2, VolumeX, Filter
} from 'lucide-react';

export default function LeitorTexto() {
  const [text, setText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    u.lang = 'pt-BR';
    u.rate = 1.0;
    u.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, []);

  const handleRead = () => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.cancel();
      utterance!.text = text;
      synth.speak(utterance!);
      setIsReading(true);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const handleExtract = () => {
    // Simulated extraction logic
    const processMatch = text.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/);
    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
    
    setExtractedData({
      processo: processMatch ? processMatch[0] : 'Não encontrado',
      data: dateMatch ? dateMatch[0] : 'Não encontrada',
      perito: text.includes('MARCOS ANTONIO') ? 'Marcos Antonio Cunha Santos' : 'Não identificado',
      vara: text.includes('Vara do Trabalho') ? '31ª Vara do Trabalho de Salvador' : 'Não identificada'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="ornate-title text-4xl font-bold">Leitor de Texto</h1>
        <p className="text-[#5C4D32]/60">Analise atas e documentos com auxílio de voz e IA.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="gold-card space-y-4">
            <div className="flex justify-between items-center border-b border-black/5 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={20} className="text-[#B8860B]" />
                Documento para Análise
              </h2>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="gold-btn p-2 text-xs flex items-center gap-1">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button onClick={() => setText('')} className="gold-btn p-2 text-xs text-red-400">Limpar</button>
              </div>
            </div>
            
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="gold-input min-h-[400px] text-sm leading-relaxed font-serif p-6 bg-white/30"
              placeholder="Cole aqui o texto da ata de audiência ou qualquer documento pericial para análise..."
            />

            <div className="flex justify-center gap-4 pt-4">
              {!isReading || isPaused ? (
                <button onClick={handleRead} className="gold-btn flex items-center gap-2 px-8">
                  <Play size={20} /> {isPaused ? 'Retomar' : 'Ler Texto'}
                </button>
              ) : (
                <button onClick={handlePause} className="gold-btn flex items-center gap-2 px-8">
                  <Pause size={20} /> Pausar
                </button>
              )}
              <button onClick={handleStop} className="gold-btn flex items-center gap-2 px-8 text-red-400">
                <Square size={20} /> Parar
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className="space-y-8">
          <div className="gold-card space-y-6">
            <h3 className="text-lg font-bold border-b border-black/5 pb-4 flex items-center gap-2">
              <Wand2 size={20} className="text-[#B8860B]" />
              Extração Inteligente
            </h3>
            <div className="space-y-4">
              <p className="text-xs text-[#5C4D32]/60">
                Clique no botão abaixo para extrair dados estruturados do texto colado.
              </p>
              <button 
                onClick={handleExtract}
                className="gold-btn w-full flex items-center justify-center gap-2 text-sm"
              >
                <Filter size={18} /> Extrair Dados
              </button>

              {extractedData && (
                <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="gold-card-inset p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Nº Processo</p>
                    <p className="text-xs font-bold">{extractedData.processo}</p>
                  </div>
                  <div className="gold-card-inset p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Data Vistoria</p>
                    <p className="text-xs font-bold">{extractedData.data}</p>
                  </div>
                  <div className="gold-card-inset p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Perito Nomeado</p>
                    <p className="text-xs font-bold">{extractedData.perito}</p>
                  </div>
                  <div className="gold-card-inset p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Vara do Trabalho</p>
                    <p className="text-xs font-bold">{extractedData.vara}</p>
                  </div>
                  <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest bg-[#B8860B] text-white rounded-lg hover:bg-[#B8860B]/90 transition-all">
                    Criar Processo com estes Dados
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="gold-card-inset space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] flex items-center gap-2">
              <Volume2 size={16} /> Configurações de Voz
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5C4D32]/60">Velocidade</label>
                <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full accent-[#B8860B]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5C4D32]/60">Voz</label>
                <select className="gold-input text-xs py-1">
                  <option>Google Português do Brasil (Feminino)</option>
                  <option>Google Português do Brasil (Masculino)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
