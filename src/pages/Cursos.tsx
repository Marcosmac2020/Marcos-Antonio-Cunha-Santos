import React, { useState } from 'react';
import { 
  Award, BookOpen, CheckCircle2, Clock, 
  ChevronRight, ArrowRight, Star, Trophy,
  Play, FileText, Download, AlertCircle,
  Search, Filter
} from 'lucide-react';

const COURSES = [
  { id: 'nr15', title: 'NR-15: Atividades e Operações Insalubres', modules: 12, progress: 100, status: 'Concluído', icon: Award },
  { id: 'nr16', title: 'NR-16: Atividades e Operações Perigosas', modules: 8, progress: 75, status: 'Em andamento', icon: BookOpen },
  { id: 'pericia_judicial', title: 'Perícia Judicial para Engenheiros e Médicos', modules: 15, progress: 30, status: 'Em andamento', icon: Star },
  { id: 'ergonomia', title: 'NR-17: Ergonomia e Análise Ergonômica', modules: 10, progress: 0, status: 'Não iniciado', icon: FileText },
];

const MODULES = [
  { id: 1, title: 'Introdução à Perícia Trabalhista', duration: '45 min', status: 'completed' },
  { id: 2, title: 'Legislação Aplicada: CLT e CPC', duration: '60 min', status: 'completed' },
  { id: 3, title: 'Metodologia de Vistoria in loco', duration: '90 min', status: 'current' },
  { id: 4, title: 'Redação de Laudos Periciais', duration: '120 min', status: 'pending' },
  { id: 5, title: 'Resposta a Quesitos e Impugnações', duration: '75 min', status: 'pending' },
];

export default function Cursos() {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="ornate-title text-4xl font-bold">Curso Pericial</h1>
          <p className="text-[#5C4D32]/60">Educação continuada e atualização técnica nas NRs.</p>
        </div>
        <div className="flex gap-4">
          <button className="gold-btn flex items-center gap-2 text-sm">
            <Trophy size={18} /> Meus Certificados
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-[#B8860B]" />
            Cursos Disponíveis
          </h2>
          <div className="space-y-4">
            {COURSES.map((course) => (
              <div 
                key={course.id} 
                onClick={() => setSelectedCourse(course)}
                className={`
                  gold-card flex items-center gap-4 cursor-pointer transition-all hover:translate-x-1
                  ${selectedCourse.id === course.id ? 'ring-2 ring-[#B8860B]/20 bg-[#B8860B]/5' : ''}
                `}
              >
                <div className={`p-3 rounded-xl gold-card-inset ${course.progress === 100 ? 'text-emerald-600' : 'text-[#B8860B]'}`}>
                  <course.icon size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm leading-tight">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B8860B] rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-[#5C4D32]/40">{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gold-card-inset space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B8860B]">Próxima Aula Sugerida</h3>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/50 text-[#B8860B]">
                <Play size={16} />
              </div>
              <div>
                <p className="text-xs font-bold">Metodologia de Vistoria</p>
                <p className="text-[10px] text-[#5C4D32]/60">NR-16: Atividades Perigosas</p>
              </div>
            </div>
            <button className="gold-btn w-full text-xs py-2">Retomar Estudo</button>
          </div>
        </div>

        {/* Course Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="gold-card space-y-8">
            <div className="flex justify-between items-start border-b border-black/5 pb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#5C4D32]/40">
                  <span className="flex items-center gap-1"><Clock size={12} /> 12 horas totais</span>
                  <span className="flex items-center gap-1"><FileText size={12} /> {selectedCourse.modules} módulos</span>
                  <span className="flex items-center gap-1 text-[#B8860B]"><Star size={12} /> 4.9 (120 avaliações)</span>
                </div>
              </div>
              <button className="gold-btn flex items-center gap-2 text-sm bg-[#B8860B] text-white">
                <Play size={18} /> Iniciar Módulo
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Conteúdo Programático</h3>
              <div className="space-y-4">
                {MODULES.map((module) => (
                  <div key={module.id} className="gold-card-inset flex items-center gap-4 p-4 hover:bg-black/5 transition-all cursor-pointer group">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${module.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : ''}
                      ${module.status === 'current' ? 'bg-[#B8860B] text-white' : ''}
                      ${module.status === 'pending' ? 'bg-white/50 text-[#5C4D32]/20' : ''}
                    `}>
                      {module.status === 'completed' ? <CheckCircle2 size={18} /> : module.id}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${module.status === 'pending' ? 'text-[#5C4D32]/40' : ''}`}>{module.title}</p>
                      <p className="text-xs text-[#5C4D32]/40">{module.duration}</p>
                    </div>
                    {module.status === 'current' ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[#B8860B] text-white px-2 py-1 rounded-full animate-pulse">
                        Em curso
                      </span>
                    ) : (
                      <ChevronRight className="text-[#5C4D32]/20 group-hover:text-[#B8860B] transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gold-card-inset flex items-center justify-center text-[#B8860B]">
                  <Download size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">Material de Apoio (PDF)</p>
                  <p className="text-xs text-[#5C4D32]/60">Apostila completa e modelos de laudo</p>
                </div>
              </div>
              <button className="text-sm font-bold text-[#B8860B] hover:underline">Baixar Agora</button>
            </div>
          </div>

          <div className="gold-card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle size={20} className="text-[#B8860B]" />
              Fórum de Dúvidas
            </h3>
            <div className="space-y-4">
              <div className="gold-card-inset p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#B8860B]">Marcos Silva - há 2 dias</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C4D32]/40">Respondido</span>
                </div>
                <p className="text-sm font-medium">"Como proceder quando a reclamada não disponibiliza o LTCAT no momento da vistoria?"</p>
                <p className="text-xs text-[#5C4D32]/60 italic pl-4 border-l-2 border-[#B8860B]/20">
                  "O perito deve registrar a recusa em ata de vistoria e solicitar ao juízo a intimação da reclamada sob pena de multa..."
                </p>
              </div>
              <button className="gold-btn w-full text-sm">Fazer uma Pergunta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
