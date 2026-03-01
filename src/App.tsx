import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { useResponsive } from './hooks/useResponsive';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './pages/Dashboard';
import Processos from './pages/Processos';
import ProcessoDetalhe from './pages/ProcessoDetalhe';
import JornadaMunus from './pages/JornadaMunus';
import ColetaDados from './pages/ColetaDados';
import Financeiro from './pages/Financeiro';
import LaudoPericial from './pages/LaudoPericial';
import Honorarios from './pages/Honorarios';
import Vistoria from './pages/Vistoria';
import Peticao from './pages/Peticao';
import Cursos from './pages/Cursos';
import LeitorTexto from './pages/LeitorTexto';
import Configuracoes from './pages/Configuracoes';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useLocalStorage('sidebar-open', !isMobile);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => isMobile && setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#F2E8D5] lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/processos" element={<Processos />} />
            <Route path="/processos/:id" element={<ProcessoDetalhe />} />
            <Route path="/jornada" element={<JornadaMunus />} />
            <Route path="/coleta" element={<ColetaDados />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/laudo" element={<LaudoPericial />} />
            <Route path="/honorarios" element={<Honorarios />} />
            <Route path="/vistoria" element={<Vistoria />} />
            <Route path="/peticao" element={<Peticao />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/leitor" element={<LeitorTexto />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
