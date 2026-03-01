import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Printer, Scale, FileText, AlertCircle, 
  Save, Wand2, Copy, Check
} from 'lucide-react';

export default function Peticao() {
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const { data: selectedProcesso } = useQuery({
    queryKey: ['processo', selectedProcessoId],
    queryFn: () => fetch(`/api/processos/${selectedProcessoId}`).then(res => res.json()),
    enabled: !!selectedProcessoId
  });

  const handleCopy = () => {
    const text = document.getElementById('peticao-content')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Petição — Múnus</h1>
          <p className="text-[#5C4D32]/60">Aceitação do encargo e pedido de honorários provisionais.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleCopy} className="gold-btn flex items-center gap-2 text-sm">
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </button>
          <button onClick={handlePrint} className="gold-btn flex items-center gap-2 text-sm bg-[#B8860B] text-white">
            <Printer size={18} /> Imprimir Petição
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-6 no-print">
            <div className="gold-card min-h-[600px] p-12 font-serif text-lg leading-relaxed shadow-inner bg-white/50" id="peticao-content">
              <div className="text-center mb-12">
                <p className="font-bold">EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DA 31ª VARA DO TRABALHO DE SALVADOR/BA</p>
              </div>

              <div className="space-y-8">
                <p><strong>Processo nº {selectedProcesso.numero}</strong></p>
                <p><strong>Reclamante:</strong> {selectedProcesso.reclamante}</p>
                <p><strong>Reclamada:</strong> {selectedProcesso.reclamada}</p>

                <p className="pt-8">
                  <strong>MARCOS ANTONIO CUNHA SANTOS</strong>, Perito Judicial devidamente nomeado nos autos do processo em epígrafe, vem, mui respeitosamente, à presença de Vossa Excelência, dizer que:
                </p>

                <p className="text-justify">
                  1. <strong>ACEITA</strong> o honroso encargo que lhe foi confiado, comprometendo-se a desempenhá-lo com o costumeiro zelo e imparcialidade.
                </p>

                <p className="text-justify">
                  2. Requer a Vossa Excelência a fixação de <strong>HONORÁRIOS PROVISIONAIS</strong> no valor de <strong>R$ 2.500,00 (dois mil e quinhentos reais)</strong>, destinados a fazer face às despesas iniciais com a realização da perícia, tais como deslocamento, análise documental e diligências.
                </p>

                <p className="text-justify">
                  3. Informa que a vistoria pericial será realizada no dia <strong>28/10/2025 às 09:00 horas</strong>, no endereço indicado na ata de audiência.
                </p>

                <p className="pt-12">Nestes termos, pede deferimento.</p>
                
                <p className="pt-4">Salvador/BA, 28 de Outubro de 2025.</p>

                <div className="pt-16 text-center">
                  <p className="font-bold">MARCOS ANTONIO CUNHA SANTOS</p>
                  <p className="text-sm">Perito Judicial</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h3 className="text-lg font-bold border-b border-black/5 pb-4">Personalizar Petição</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Honorários Provisionais (R$)</label>
                  <input type="number" defaultValue={2500} className="gold-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Data da Vistoria</label>
                  <input type="datetime-local" className="gold-input" />
                </div>
                <button className="gold-btn w-full flex items-center justify-center gap-2 text-sm mt-4">
                  <Wand2 size={18} /> Atualizar com IA
                </button>
              </div>
            </div>

            <div className="gold-card-inset space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Lembrete PJE</h3>
              <p className="text-xs text-[#5C4D32]/80 leading-relaxed italic">
                "Não esqueça de selecionar o tipo de documento 'Petição de Aceite' ao protocolar no PJE para facilitar a triagem pela secretaria."
              </p>
            </div>
          </div>

          {/* Print Preview */}
          <div className="hidden print-only col-span-3">
            <div className="a4-page font-serif text-black p-24">
              <div className="text-center mb-16">
                <p className="font-bold uppercase">Excelentíssimo Senhor Doutor Juiz da 31ª Vara do Trabalho de Salvador/BA</p>
              </div>

              <div className="space-y-8 text-justify">
                <p><strong>Processo nº {selectedProcesso.numero}</strong></p>
                <p><strong>Reclamante:</strong> {selectedProcesso.reclamante}</p>
                <p><strong>Reclamada:</strong> {selectedProcesso.reclamada}</p>

                <p className="pt-8">
                  <strong>MARCOS ANTONIO CUNHA SANTOS</strong>, Perito Judicial devidamente nomeado nos autos do processo em epígrafe, vem, mui respeitosamente, à presença de Vossa Excelência, dizer que:
                </p>

                <p>
                  1. <strong>ACEITA</strong> o honroso encargo que lhe foi confiado, comprometendo-se a desempenhá-lo com o costumeiro zelo e imparcialidade.
                </p>

                <p>
                  2. Requer a Vossa Excelência a fixação de <strong>HONORÁRIOS PROVISIONAIS</strong> no valor de <strong>R$ 2.500,00 (dois mil e quinhentos reais)</strong>, destinados a fazer face às despesas iniciais com a realização da perícia.
                </p>

                <p>
                  3. Informa que a vistoria pericial será realizada no dia <strong>28/10/2025 às 09:00 horas</strong>, no endereço indicado na ata de audiência.
                </p>

                <p className="pt-12">Nestes termos, pede deferimento.</p>
                
                <p className="pt-4">Salvador/BA, 28 de Outubro de 2025.</p>

                <div className="pt-24 text-center">
                  <div className="w-64 h-px bg-black mx-auto mb-2"></div>
                  <p className="font-bold">MARCOS ANTONIO CUNHA SANTOS</p>
                  <p className="text-sm">Perito Judicial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gold-card text-center py-24 space-y-4 no-print">
          <AlertCircle size={48} className="mx-auto text-[#B8860B]/20" />
          <p className="text-lg font-medium">Selecione um processo para gerar a petição.</p>
          <p className="text-[#5C4D32]/60">A petição de aceite é o primeiro passo formal após a nomeação.</p>
        </div>
      )}
    </div>
  );
}
