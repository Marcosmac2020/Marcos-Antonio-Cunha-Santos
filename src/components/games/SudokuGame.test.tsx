import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SudokuGame from './SudokuGame';

describe('SudokuGame Component', () => {
  test('renders game interface', () => {
    render(<SudokuGame />);
    
    // Verifica elementos principais
    expect(screen.getByText('🧭 Sudoku Georota')).toBeInTheDocument();
    expect(screen.getByText('POLIEDRO SUDOKU DIGITAL · Identidade Georota')).toBeInTheDocument();
    
    // Verifica botões de dificuldade
    expect(screen.getByText('FÁCIL')).toBeInTheDocument();
    expect(screen.getByText('MÉDIO')).toBeInTheDocument();
    expect(screen.getByText('DIFÍCIL')).toBeInTheDocument();
    expect(screen.getByText('↺ NOVO')).toBeInTheDocument();
  });

  test('starts new game on difficulty click', () => {
    render(<SudokuGame />);
    
    const easyButton = screen.getByText('FÁCIL');
    fireEvent.click(easyButton);
    
    // Verifica se o timer foi iniciado
    expect(screen.getByText('00:00')).toBeInTheDocument();
    
    // Verifica se a grade foi criada
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(81); // 9x9 = 81 células
  });

  test('shows help modal', () => {
    render(<SudokuGame />);
    
    const helpButton = screen.getByText('?');
    fireEvent.click(helpButton);
    
    expect(screen.getByText('📜 Como Jogar')).toBeInTheDocument();
    expect(screen.getByText('ENTENDIDO')).toBeInTheDocument();
  });

  test('renders keyboard with icons', () => {
    render(<SudokuGame />);
    
    // Verifica se os ícones Georota estão presentes
    expect(screen.getByText('🧭')).toBeInTheDocument(); // Bússola
    expect(screen.getByText('🗺️')).toBeInTheDocument(); // Mapa
    expect(screen.getByText('⚡')).toBeInTheDocument(); // Energia
    expect(screen.getByText('✕')).toBeInTheDocument(); // Apagar
  });

  test('handles cell selection', () => {
    render(<SudokuGame />);
    
    // Inicia um jogo
    const easyButton = screen.getByText('FÁCIL');
    fireEvent.click(easyButton);
    
    // Seleciona uma célula (a primeira não fixa)
    const cells = document.querySelectorAll('.cell:not(.opacity-70)');
    if (cells.length > 0) {
      fireEvent.click(cells[0]);
      
      // Verifica se a célula foi selecionada (tem ring)
      expect(cells[0]).toHaveClass('ring-2');
    }
  });

  test('shows score bar', () => {
    render(<SudokuGame />);
    
    // Inicia um jogo
    const easyButton = screen.getByText('FÁCIL');
    fireEvent.click(easyButton);
    
    expect(screen.getByText(/NÍVEL:/)).toBeInTheDocument();
    expect(screen.getByText(/ERROS:/)).toBeInTheDocument();
  });
});
