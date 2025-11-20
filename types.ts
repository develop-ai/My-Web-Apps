import React from 'react';

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  AI = 'AI',
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  type: 'standard' | 'ai';
  timestamp: number;
}

export interface AIResponse {
  result: string;
  explanation: string;
}

export enum CalcActionType {
  ADD_DIGIT,
  CHOOSE_OPERATION,
  CLEAR,
  DELETE,
  EVALUATE,
  PERCENTAGE,
  NEGATE
}

export interface CalcState {
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;
  overwrite: boolean;
}

export type IconProps = React.SVGProps<SVGSVGElement>;