import React, { useEffect, useRef } from 'react';

interface CalculatorScreenProps {
  previous: string | null;
  current: string | null;
  operation: string | null;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ previous, current, operation }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to format large numbers with commas
  const formatOperand = (operand: string | null) => {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) {
      return new Intl.NumberFormat('en-US').format(parseInt(integer));
    }
    return `${new Intl.NumberFormat('en-US').format(parseInt(integer))}.${decimal}`;
  };

  return (
    <div className="flex flex-col items-end justify-end h-40 sm:h-48 p-6 w-full break-all bg-gradient-to-b from-black/20 to-transparent">
      <div className="text-zinc-400 text-xl sm:text-2xl font-light h-8 mb-1 flex items-center space-x-2">
        <span>{formatOperand(previous)}</span>
        {operation && <span className="text-accent">{operation}</span>}
      </div>
      <div 
        ref={containerRef}
        className="text-white text-6xl sm:text-7xl font-light tracking-tight overflow-hidden w-full text-right"
      >
        {formatOperand(current) || '0'}
      </div>
    </div>
  );
};