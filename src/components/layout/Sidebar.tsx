import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Calendar, Trophy, 
  Mic, BookOpen, DollarSign, Award, Clipboard, 
  Search, Settings, Scale, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    label: 'Sistema',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Processos', icon: FileText, path: '/processos' },
      { name: 'Agenda', icon: Calendar, path: '/agenda' },
      { name: 'Jornada do Múnus', icon: Trophy, path: '/jornada' },
      { name: 'Coleta de Dados', icon: Mic, path: '/coleta' },
      { name: 'Leitor de Texto', icon: BookOpen, path: '/leitor' },
      { name: 'Financeiro', icon: DollarSign, path: '/financeiro' },
      { name: 'Curso Pericial', icon: Award, path: '/cursos' },
    ]
  },
  {
    label: 'Documentos',
    items: [
      { name: 'Laudo (Form. 8)', icon: Clipboard, path: '/laudo' },
      { name: 'Honorários', icon: DollarSign, path: '/honorarios' },
      { name: 'Vistoria', icon: Search, path: '/vistoria' },
      { name: 'Petição', icon: Scale, path: '/peticao' },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isMobile } = useResponsive();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#F2E8D5] p-6 flex flex-col gap-8 
        gold-card rounded-none border-r border-black/5 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="text-[#B8860B]" size={32} />
            <h1 className="ornate-title text-2xl font-bold">Perícia Pro</h1>
          </div>
          {isMobile && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-8">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs uppercase tracking-widest text-[#B8860B]/60 font-bold mb-4 px-2">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all
                        ${isActive 
                          ? 'gold-card-inset text-[#B8860B]' 
                          : 'hover:bg-black/5 text-[#5C4D32]'}
                      `}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-black/5">
          <Link 
            to="/configuracoes"
            onClick={onClose}
            className={`
              flex items-center gap-3 p-3 rounded-xl transition-all
              ${location.pathname === '/configuracoes' 
                ? 'gold-card-inset text-[#B8860B]' 
                : 'hover:bg-black/5 text-[#5C4D32]'}
            `}
          >
            <Settings size={20} />
            <span className="font-medium">Configurações</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
