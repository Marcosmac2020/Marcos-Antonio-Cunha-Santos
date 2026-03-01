import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Printer, Mail, MapPin, Calendar, 
  Clock, Users, AlertCircle, Save, 
  Wand2, Copy, Check, ExternalLink
} from 'lucide-react';

export default function Vistoria() {
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

  const handleCopyEmail = () => {
    const text = document.getElementById('email-content')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenEmail = () => {
    const subject = encodeURIComponent(`Vistoria Pericial - Proc. ${selectedProcesso?.numero}`);
    const body = encodeURIComponent(document.getElementById('email-content')?.innerText || '');
    window.open(`mailto:bbc.advconsultoria@gmail.com;administrativo@fabamed.org.br?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Vistoria Pericial</h1>
          <p className="text-[#5C4D32]/60">Notificação das partes e agendamento da diligência.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleOpenEmail} className="gold-btn flex items-center gap-2 text-sm">
            <ExternalLink size={18} /> Abrir no E-mail
          </button>
          <button onClick={handlePrint} className="gold-btn flex items-center gap-2 text-sm bg-[#B8860B] text-white">
            <Printer size={18} /> Imprimir Notificação
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
          {/* Notification Area */}
          <div className="lg:col-span-2 space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h2 className="text-xl font-bold border-b border-black/5 pb-4">Dados do Agendamento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Data da Vistoria</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4D32]/40" size={18} />
                    <input type="date" className="gold-input pl-10" defaultValue="2025-10-28" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Hora da Vistoria</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4D32]/40" size={18} />
                    <input type="time" className="gold-input pl-10" defaultValue="09:00" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Local da Vistoria</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4D32]/40" size={18} />
                    <input className="gold-input pl-10" defaultValue="UTI Pediátrica II - Hospital Dois de Julho" />
                  </div>
                </div>
              </div>
            </div>

            <div className="gold-card space-y-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <h2 className="text-xl font-bold">E-mail de Convocação</h2>
                <button onClick={handleCopyEmail} className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar Texto'}
                </button>
              </div>
              <div className="gold-card-inset p-6 font-mono text-sm leading-relaxed bg-white/50" id="email-content">
                <p>Prezados Doutores e Assistentes Técnicos,</p>
                <br />
                <p>Informo que a vistoria pericial relativa ao <strong>Processo nº {selectedProcesso.numero}</strong> ({selectedProcesso.reclamante} vs {selectedProcesso.reclamada}) foi agendada para:</p>
                <br />
                <p><strong>DATA:</strong> 28 de Outubro de 2025 (Terça-feira)</p>
                <p><strong>HORA:</strong> 09:00 horas</p>
                <p><strong>LOCAL:</strong> UTI Pediátrica II - Hospital Dois de Julho</p>
                <p><strong>ENDEREÇO:</strong> Avenida Sete de Setembro, nº 4161, Barra, Salvador/BA</p>
                <br />
                <p>Solicito que a Reclamada providencie a presença de preposto que conheça as atividades do Reclamante, bem como a disponibilização de documentos técnicos (PPRA/PGR, PCMSO, LTCAT, Fichas de EPI) no momento da diligência.</p>
                <br />
                <p>Atenciosamente,</p>
                <br />
                <p><strong>MARCOS ANTONIO CUNHA SANTOS</strong></p>
                <p>Perito Judicial - TRT 5ª Região</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 no-print">
            <div className="gold-card space-y-6">
              <h3 className="text-lg font-bold border-b border-black/5 pb-4 flex items-center gap-2">
                <Users size={20} className="text-[#B8860B]" />
                Destinatários
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Autor (Advogado)</h4>
                  <div className="gold-card-inset p-3 text-xs">
                    <p className="font-bold">Dr. Marco Antonio Barros</p>
                    <p className="text-[#5C4D32]/60">bbc.advconsultoria@gmail.com</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Réu (Advogado/RH)</h4>
                  <div className="gold-card-inset p-3 text-xs">
                    <p className="font-bold">Dra. Fernanda Vinhatico</p>
                    <p className="text-[#5C4D32]/60">administrativo@fabamed.org.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="gold-card-inset space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Lembrete de Vistoria</h3>
              <p className="text-xs text-[#5C4D32]/80 leading-relaxed italic">
                "A notificação deve ser enviada com antecedência mínima de 5 dias úteis para garantir o direito ao contraditório e presença dos assistentes técnicos."
              </p>
            </div>
          </div>

          {/* Print Preview */}
          <div className="hidden print-only col-span-3">
            <div className="a4-page font-serif text-black p-24">
              <div className="text-center mb-16">
                <h1 className="text-2xl font-bold uppercase">Notificação de Vistoria Pericial</h1>
                <p className="text-sm">Justiça do Trabalho - TRT 5ª Região</p>
              </div>

              <div className="space-y-8 text-justify">
                <p><strong>Processo nº {selectedProcesso.numero}</strong></p>
                <p><strong>Reclamante:</strong> {selectedProcesso.reclamante}</p>
                <p><strong>Reclamada:</strong> {selectedProcesso.reclamada}</p>

                <p className="pt-8">
                  O Perito Judicial abaixo assinado, em cumprimento ao encargo que lhe foi confiado, comunica às partes e seus assistentes técnicos que realizará a diligência pericial conforme os dados abaixo:
                </p>

                <div className="gold-card-inset p-8 space-y-4 bg-gray-50 border border-gray-200">
                  <p><strong>DATA:</strong> 28 de Outubro de 2025</p>
                  <p><strong>HORA:</strong> 09:00 horas</p>
                  <p><strong>LOCAL:</strong> UTI Pediátrica II - Hospital Dois de Julho</p>
                  <p><strong>ENDEREÇO:</strong> Avenida Sete de Setembro, nº 4161, Barra, Salvador/BA</p>
                </div>

                <p>
                  Solicita-se à Reclamada que disponibilize os documentos técnicos de segurança do trabalho (PGR, PCMSO, LTCAT, Fichas de EPI) e a presença de preposto que conheça as atividades laborais do Reclamante.
                </p>

                <p className="pt-12">Salvador/BA, 28 de Outubro de 2025.</p>

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
          <p className="text-lg font-medium">Selecione um processo para agendar a vistoria.</p>
          <p className="text-[#5C4D32]/60">A notificação formal evita nulidades e garante a presença das partes.</p>
        </div>
      )}
    </div>
  );
}
