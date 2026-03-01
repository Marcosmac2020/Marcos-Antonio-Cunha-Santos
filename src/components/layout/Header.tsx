import * as React from 'react';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';
import { useResponsive } from '../../hooks/useResponsive';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const { isMobile } = useResponsive();

  if (!isMobile) return null;

  return (
    <header className="bg-[#F2E8D5] p-4 flex justify-between items-center gold-card rounded-none border-b border-black/5 z-30 lg:hidden">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#B8860B] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PP</span>
        </div>
        <h1 className="ornate-title text-xl font-bold">Perícia Pro</h1>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        <Menu size={20} />
      </Button>
    </header>
  );
}
