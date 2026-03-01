import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Printer, DollarSign, Calculator, Plus, 
  Trash2, AlertCircle, Save, FileText
} from 'lucide-react';

export default function Honorarios() {
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [salarioMinimo, setSalarioMinimo] = useState(1412);
  const [fator, setFator] = useState(3);
  const [items, setItems] = useState([
    { id: 1, descricao: 'Análise de Autos e Documentos', horas: 4, valorHora: 250 },
    { id: 2, descricao: 'Vistoria in loco e Entrevistas', horas: 6, valorHora: 250 },
    { id: 3, descricao: 'Elaboração do Laudo e Resposta a Quesitos', horas: 8, valorHora: 250 },
  ]);

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: () => fetch('/api/processos').then(res => res.json())
  });

  const { data: selectedProcesso } = useQuery({
    queryKey: ['processo', selectedProcessoId],
    queryFn: () => fetch(`/api/processos/${selectedProcessoId}`).then(res => res.json()),
    enabled: !!selectedProcessoId
  });

  const totalHoras = items.reduce((acc, curr) => acc + curr.horas * curr.valorHora, 0);
  const totalSalarios = salarioMinimo * fator;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Honorários Periciais</h1>
          <p className="text-[#5C4D32]/60">Cálculo e proposta de honorários definitivos.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="gold-btn flex items-center gap-2 text-sm bg-[#B8860B] text-white">
            <Printer size={18} /> Imprimir Proposta
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
          {/* Calculation Area */}
          <div className="lg:col-span-2 space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h2 className="text-xl font-bold border-b border-black/5 pb-4 flex items-center gap-2">
                <Calculator size={20} className="text-[#B8860B]" />
                Planilha de Custos
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end gold-card-inset p-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Descrição</label>
                      <input value={item.descricao} className="gold-input text-sm py-2" readOnly />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Horas</label>
                      <input type="number" value={item.horas} className="gold-input text-sm py-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Valor/h</label>
                        <input type="number" value={item.valorHora} className="gold-input text-sm py-2" />
                      </div>
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg mt-5">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-black/5 rounded-xl text-[#5C4D32]/40 font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> Adicionar Item
                </button>
              </div>
            </div>

            <div className="gold-card space-y-6">
              <h2 className="text-xl font-bold border-b border-black/5 pb-4">Base em Salário Mínimo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Salário Mínimo (R$)</label>
                  <input 
                    type="number" 
                    value={salarioMinimo} 
                    onChange={(e) => setSalarioMinimo(parseFloat(e.target.value))}
                    className="gold-input" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Fator Multiplicador (X)</label>
                  <input 
                    type="number" 
                    value={fator} 
                    onChange={(e) => setFator(parseFloat(e.target.value))}
                    className="gold-input" 
                  />
                </div>
              </div>
              <div className="p-4 gold-card-inset bg-[#B8860B]/5 border border-[#B8860B]/20">
                <p className="text-sm font-medium text-[#B8860B]">
                  Resultado: {fator} x R$ {salarioMinimo.toLocaleString('pt-BR')} = <strong>R$ {totalSalarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Summary / Print Preview */}
          <div className="space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h3 className="text-lg font-bold border-b border-black/5 pb-4">Resumo da Proposta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#5C4D32]/60">Total por Horas</span>
                  <span className="font-bold">R$ {totalHoras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#5C4D32]/60">Total por Salários</span>
                  <span className="font-bold">R$ {totalSalarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-[#B8860B]">Valor Final</span>
                  <span className="text-2xl font-bold text-[#B8860B]">R$ {Math.max(totalHoras, totalSalarios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="gold-card-inset space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Justificativa Legal</h3>
              <p className="text-xs text-[#5C4D32]/80 leading-relaxed italic">
                "Os honorários periciais são fixados considerando a complexidade da matéria, o tempo despendido, o zelo profissional e as despesas operacionais, conforme Art. 465 do CPC."
              </p>
            </div>
          </div>

          {/* Print Preview (Hidden in UI, visible in Print) */}
          <div className="hidden print-only col-span-3">
            <div className="a4-page space-y-8 text-black">
              <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase">Proposta de Honorários Periciais</h1>
                <p className="text-sm">Justiça do Trabalho - TRT 5ª Região</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm"><strong>Processo:</strong> {selectedProcesso.numero}</p>
                <p className="text-sm"><strong>Partes:</strong> {selectedProcesso.reclamante} vs {selectedProcesso.reclamada}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-gray-300">Detalhamento dos Custos</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Atividade</th>
                      <th className="border p-2 text-center">Horas</th>
                      <th className="border p-2 text-right">Valor/h</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="border p-2">{item.descricao}</td>
                        <td className="border p-2 text-center">{item.horas}</td>
                        <td className="border p-2 text-right">R$ {item.valorHora.toLocaleString('pt-BR')}</td>
                        <td className="border p-2 text-right">R$ {(item.horas * item.valorHora).toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan={3} className="border p-2 text-right">Total Geral</td>
                      <td className="border p-2 text-right">R$ {totalHoras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-sm text-justify">
                  Diante do exposto, o Perito Judicial requer a fixação dos honorários definitivos no valor de 
                  <strong> R$ {Math.max(totalHoras, totalSalarios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, 
                  equivalente a {fator} salários mínimos vigentes.
                </p>
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
          <p className="text-lg font-medium">Selecione um processo para calcular os honorários.</p>
          <p className="text-[#5C4D32]/60">A proposta detalhada aumenta as chances de deferimento integral pelo Juízo.</p>
        </div>
      )}
    </div>
  );
}
