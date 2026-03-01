import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

interface SudokuGameProps {
  className?: string;
}

// Ícones Georota
const ICONES = ['🧭','🗺️','⚡','🌊','🔥','🌿','🏔️','🌐','✦'];
const NOMES = ['Bússula','Mapa','Energia','Onda','Fogo','Terra','Pico','Global','Estrela'];
const CORES = ['#00e5ff','#ff2d6b','#f5c400','#00e676','#bf00ff','#ff6d00','#2979ff','#b0b0b0','#40e0d0'];

export default function SudokuGame({ className }: SudokuGameProps) {
  const [matrix, setMatrix] = useState<number[]>(Array(81).fill(0));
  const [solution, setSolution] = useState<number[]>(Array(81).fill(0));
  const [fixedC, setFixedC] = useState<boolean[]>(Array(81).fill(false));
  const [erroMap, setErroMap] = useState<boolean[]>(Array(81).fill(false));
  const [selected, setSelected] = useState<number>(-1);
  const [erros, setErros] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showVictory, setShowVictory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Formatar tempo
  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Utilitários Sudoku
  const shuffle = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const podeColocar = (board: number[], idx: number, n: number): boolean => {
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const boxR = Math.floor(row / 3) * 3;
    const boxC = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i++) {
      if (board[row * 9 + i] === n) return false;
      if (board[i * 9 + col] === n) return false;
      if (board[(boxR + Math.floor(i / 3)) * 9 + (boxC + i % 3)] === n) return false;
    }
    return true;
  };

  const gerarCompleto = (board: number[], pos = 0): boolean => {
    if (pos === 81) return true;
    if (board[pos] !== 0) return gerarCompleto(board, pos + 1);

    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of nums) {
      if (podeColocar(board, pos, n)) {
        board[pos] = n;
        if (gerarCompleto(board, pos + 1)) return true;
        board[pos] = 0;
      }
    }
    return false;
  };

  const removerCasas = (board: number[], clues: number): number[] => {
    const puzzle = [...board];
    const posicoes = shuffle([...Array(81).keys()]);
    let removidos = 0;
    const alvo = 81 - clues;

    for (const pos of posicoes) {
      if (removidos >= alvo) break;
      puzzle[pos] = 0;
      removidos++;
    }
    return puzzle;
  };

  const gerarPuzzle = (p: number): number[] => {
    const clues = p >= 0.65 ? 45 : p >= 0.45 ? 32 : 25;
    const full = Array(81).fill(0);
    gerarCompleto(full);
    setSolution([...full]);
    return removerCasas(full, clues);
  };

  // Iniciar novo jogo
  const startNewGame = (diff: 'easy' | 'medium' | 'hard') => {
    const difficulties = { easy: 0.7, medium: 0.5, hard: 0.35 };
    const p = difficulties[diff];
    setDifficulty(diff);
    setErros(0);
    setSelected(-1);
    setErroMap(Array(81).fill(false));
    setSeconds(0);
    setIsPlaying(true);
    setShowVictory(false);

    const puzzle = gerarPuzzle(p);
    setMatrix(puzzle);
    setFixedC(puzzle.map(v => v !== 0));
  };

  // Selecionar célula
  const selectCell = (i: number) => {
    if (!fixedC[i]) {
      setSelected(i);
    }
  };

  // Inserir número
  const insertNumber = (n: number) => {
    if (selected === -1 || fixedC[selected]) return;

    const newMatrix = [...matrix];
    const newErroMap = [...erroMap];
    
    // Limpa erro anterior
    const foiErro = erroMap[selected];
    newErroMap[selected] = false;
    newMatrix[selected] = n;

    // Valida contra solução
    if (solution[selected] !== n) {
      newErroMap[selected] = true;
      if (!foiErro) {
        setErros(e => e + 1);
      }
    } else {
      if (foiErro) {
        setErros(e => Math.max(0, e - 1));
      }
    }

    setMatrix(newMatrix);
    setErroMap(newErroMap);
    checkVictory(newMatrix);
  };

  // Apagar
  const eraseNumber = () => {
    if (selected === -1 || fixedC[selected]) return;
    
    const newMatrix = [...matrix];
    const newErroMap = [...erroMap];
    
    if (erroMap[selected]) {
      newErroMap[selected] = false;
      setErros(e => Math.max(0, e - 1));
    }
    
    newMatrix[selected] = 0;
    setMatrix(newMatrix);
    setErroMap(newErroMap);
  };

  // Verificar vitória
  const checkVictory = (currentMatrix: number[]) => {
    const completo = currentMatrix.every((v, i) => v !== 0 && v === solution[i]);
    if (completo) {
      setIsPlaying(false);
      setShowVictory(true);
    }
  };

  // Renderizar célula
  const renderCell = (i: number) => {
    const v = matrix[i];
    const isErr = erroMap[i];
    const isSelected = i === selected;
    const isFixed = fixedC[i];

    return (
      <div
        key={i}
        className={cn(
          'w-10 h-10 md:w-12 md:h-12 border border-[#B8860B]/20 rounded flex items-center justify-center cursor-pointer transition-all duration-200',
          'bg-[#F2E8D5] hover:bg-[#E8DCC8]',
          v && 'filled',
          isFixed && 'opacity-70 cursor-not-allowed',
          isSelected && 'ring-2 ring-[#B8860B] bg-[#E8DCC8]',
          isErr && 'bg-red-100 border-red-400 animate-pulse'
        )}
        onClick={() => selectCell(i)}
        style={{
          fontSize: 'clamp(1em, 3.5vw, 1.55em)',
          boxShadow: v && !isErr ? `0 2px 8px ${CORES[v-1]}40` : undefined,
          background: v && !isErr ? `${CORES[v-1]}20` : undefined
        }}
      >
        {v > 0 && ICONES[v - 1]}
      </div>
    );
  };

  // Renderizar teclado
  const renderKeyboard = () => {
    return (
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {ICONES.map((icon, i) => (
          <button
            key={i}
            className={cn(
              'h-12 md:h-14 rounded-lg border border-[#B8860B]/30 transition-all duration-200',
              'hover:scale-105 active:scale-95',
              'flex flex-col items-center justify-center gap-0'
            )}
            style={{
              background: `${CORES[i]}20`,
              boxShadow: `0 2px 8px ${CORES[i]}40`
            }}
            onClick={() => insertNumber(i + 1)}
          >
            <span className="text-lg md:text-xl">{icon}</span>
            <span className="text-xs opacity-70">{NOMES[i]}</span>
          </button>
        ))}
        <button
          className="h-12 md:h-14 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={eraseNumber}
        >
          ✕
        </button>
      </div>
    );
  };

  return (
    <div className={cn('min-h-screen bg-[#F2E8D5] p-4', className)}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="ornate-title text-3xl md:text-4xl font-bold text-[#B8860B]">
            🧭 Sudoku Georota
          </h1>
          <p className="text-[#5C4D32]/60">
            POLIEDRO SUDOKU DIGITAL · Identidade Georota
          </p>
        </div>

        {/* Dashboard */}
        <div className="gold-card p-4 flex flex-wrap items-center justify-center gap-4">
          <div className="font-mono text-lg text-[#B8860B]">
            {formatTime(seconds)}
          </div>
          <div className="flex gap-2">
            <button
              className={cn(
                'px-4 py-2 rounded-lg font-semibold transition-all',
                difficulty === 'easy' && 'bg-green-600 text-white',
                difficulty !== 'easy' && 'bg-green-100 text-green-700 hover:bg-green-200'
              )}
              onClick={() => startNewGame('easy')}
            >
              FÁCIL
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-lg font-semibold transition-all',
                difficulty === 'medium' && 'bg-orange-600 text-white',
                difficulty !== 'medium' && 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              )}
              onClick={() => startNewGame('medium')}
            >
              MÉDIO
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-lg font-semibold transition-all',
                difficulty === 'hard' && 'bg-purple-600 text-white',
                difficulty !== 'hard' && 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              )}
              onClick={() => startNewGame('hard')}
            >
              DIFÍCIL
            </button>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            onClick={() => startNewGame(difficulty)}
          >
            ↺ NOVO
          </button>
          <button
            className="w-10 h-10 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all"
            onClick={() => setShowHelp(true)}
          >
            ?
          </button>
        </div>

        {/* Score Bar */}
        <div className="gold-card p-3 flex justify-center gap-6 text-sm text-[#5C4D32]/60">
          <span>NÍVEL: <span className="text-[#B8860B] font-bold">{difficulty.toUpperCase()}</span></span>
          <span>ERROS: <span className="text-[#B8860B] font-bold">{erros}</span></span>
        </div>

        {/* Grid */}
        <div className="gold-card p-4">
          <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto">
            {Array.from({ length: 81 }, (_, i) => renderCell(i))}
          </div>
        </div>

        {/* Keyboard */}
        <div className="gold-card p-4">
          {renderKeyboard()}
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="gold-card max-w-md w-full p-6 space-y-4">
              <h2 className="ornate-title text-xl text-[#B8860B]">📜 Como Jogar</h2>
              <div className="space-y-2 text-sm text-[#5C4D32]">
                <p><strong>1. CARGA:</strong> Escolha a dificuldade. Células fixas (mais opacas) não podem ser alteradas.</p>
                <p><strong>2. ÍCONES:</strong> Cada símbolo representa 1–9 da Identidade Georota:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {ICONES.map((icon, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: CORES[i] }} />
                      {icon} {NOMES[i]}
                    </div>
                  ))}
                </div>
                <p><strong>3. JOGAR:</strong> Toque numa célula vazia → toque no ícone desejado.</p>
                <p><strong>4. APAGAR:</strong> Botão ✕ remove o ícone da célula selecionada.</p>
              </div>
              <button
                className="w-full py-2 bg-[#B8860B] text-white rounded-lg font-semibold hover:bg-[#A07530] transition-all"
                onClick={() => setShowHelp(false)}
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {showVictory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="gold-card max-w-md w-full p-6 text-center space-y-4">
              <h2 className="ornate-title text-2xl text-[#B8860B]">✦ ROTA COMPLETA ✦</h2>
              <p className="text-[#5C4D32]">
                Tempo: {formatTime(seconds)} | Erros: {erros}
              </p>
              <button
                className="px-6 py-3 bg-[#B8860B] text-white rounded-lg font-semibold hover:bg-[#A07530] transition-all"
                onClick={() => startNewGame(difficulty)}
              >
                NOVA ROTA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
