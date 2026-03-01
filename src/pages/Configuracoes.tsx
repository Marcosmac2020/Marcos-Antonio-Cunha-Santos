import React, { useState } from 'react';
import { 
  Settings, User, Award, Shield, 
  Bell, Save, Trash2, Camera, 
  Mail, Phone, MapPin, Globe,
  Scale, FileText, Download, Plus
} from 'lucide-react';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('perfil');

  const tabs = [
    { id: 'perfil', label: 'Perfil Profissional', icon: User },
    { id: 'documentos', label: 'Modelos de Documentos', icon: FileText },
    { id: 'assinatura', label: 'Assinatura Digital', icon: Award },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="ornate-title text-4xl font-bold">Configurações</h1>
        <p className="text-[#5C4D32]/60">Gerencie seus dados profissionais e preferências do sistema.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold text-sm
                ${activeTab === tab.id 
                  ? 'gold-card text-[#B8860B]' 
                  : 'text-[#5C4D32]/60 hover:text-[#5C4D32] hover:bg-black/5'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'perfil' && (
            <div className="gold-card space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row items-center gap-8 border-b border-black/5 pb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full gold-card-inset flex items-center justify-center text-[#B8860B]/20 overflow-hidden">
                    <User size={64} />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full gold-card text-[#B8860B] hover:scale-110 transition-all">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left space-y-1">
                  <h2 className="text-2xl font-bold">Marcos Antonio Cunha Santos</h2>
                  <p className="text-[#5C4D32]/60 font-medium">Engenheiro de Segurança do Trabalho & Perito Judicial</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-1 rounded-full">CREA-BA 12345</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1 rounded-full">TRT-5 Cadastrado</span>
                  </div>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Nome Completo</label>
                  <input className="gold-input" defaultValue="Marcos Antonio Cunha Santos" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">E-mail Profissional</label>
                  <input className="gold-input" defaultValue="marcos.perito@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Telefone/WhatsApp</label>
                  <input className="gold-input" defaultValue="(71) 98888-7777" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Registro Profissional (CREA/CORECON)</label>
                  <input className="gold-input" defaultValue="12345-BA" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Endereço do Escritório</label>
                  <input className="gold-input" defaultValue="Av. Tancredo Neves, 1234, Ed. Empresarial, Sala 501, Salvador/BA" />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <button type="submit" className="gold-btn flex items-center gap-2 px-8">
                    <Save size={18} /> Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'assinatura' && (
            <div className="gold-card space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold border-b border-black/5 pb-4">Assinatura Digital</h2>
              <p className="text-sm text-[#5C4D32]/60 leading-relaxed">
                Sua assinatura será aplicada automaticamente em todos os documentos gerados pelo sistema (Laudos, Petições, Honorários).
              </p>
              
              <div className="gold-card-inset p-12 flex flex-col items-center justify-center border-2 border-dashed border-black/5">
                <div className="w-64 h-32 flex items-center justify-center italic font-serif text-2xl text-[#5C4D32]/30">
                  Assinatura não carregada
                </div>
                <button className="gold-btn flex items-center gap-2 text-sm mt-4">
                  <Download size={18} /> Carregar Imagem da Assinatura
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Certificado Digital</h3>
                <div className="flex items-center justify-between p-4 gold-card-inset rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="text-emerald-500" size={24} />
                    <div>
                      <p className="text-sm font-bold">e-CPF A3 (Token/Cartão)</p>
                      <p className="text-xs text-[#5C4D32]/60">Válido até 15/12/2026</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Ativo</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="gold-card space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold border-b border-black/5 pb-4">Modelos de Documentos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="gold-card-inset p-4 space-y-4 group hover:bg-black/5 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <FileText className="text-[#B8860B]" size={24} />
                    <button className="p-2 text-[#5C4D32]/20 group-hover:text-[#B8860B]"><Settings size={16} /></button>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Petição de Aceite Padrão</p>
                    <p className="text-xs text-[#5C4D32]/60">Modelo TRT-5 com honorários provisionais.</p>
                  </div>
                </div>
                <div className="gold-card-inset p-4 space-y-4 group hover:bg-black/5 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <Scale className="text-[#B8860B]" size={24} />
                    <button className="p-2 text-[#5C4D32]/20 group-hover:text-[#B8860B]"><Settings size={16} /></button>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Laudo de Insalubridade</p>
                    <p className="text-xs text-[#5C4D32]/60">Formulário 8 com análise de NRs.</p>
                  </div>
                </div>
              </div>
              <button className="gold-btn w-full flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Criar Novo Modelo Personalizado
              </button>
            </div>
          )}

          {/* Other tabs placeholder */}
          {['notificacoes', 'seguranca'].includes(activeTab) && (
            <div className="gold-card text-center py-24 space-y-4 animate-in fade-in duration-500">
              <Settings size={48} className="mx-auto text-[#B8860B]/20 animate-spin-slow" />
              <p className="text-lg font-medium">Configurações avançadas em breve.</p>
              <p className="text-[#5C4D32]/60">Estamos trabalhando para trazer mais controle para você.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
