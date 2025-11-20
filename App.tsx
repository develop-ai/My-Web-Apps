import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Sparkles, History, RotateCcw } from 'lucide-react';
import { Button } from './components/Button';
import { CalculatorScreen } from './components/CalculatorScreen';
import { AISolver } from './components/AISolver';
import { CalcState, CalculatorMode, HistoryItem } from './types';

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Calculator Core State
  const [state, setState] = useState<CalcState>({
    currentOperand: null,
    previousOperand: null,
    operation: null,
    overwrite: false,
  });

  const clear = () => {
    setState({
      currentOperand: null,
      previousOperand: null,
      operation: null,
      overwrite: false,
    });
  };

  const deleteDigit = () => {
    if (state.overwrite) {
      setState({ ...state, currentOperand: null, overwrite: false });
      return;
    }
    if (state.currentOperand == null) return;
    if (state.currentOperand.length === 1) {
      setState({ ...state, currentOperand: null });
    } else {
      setState({ ...state, currentOperand: state.currentOperand.slice(0, -1) });
    }
  };

  const addDigit = (digit: string) => {
    if (state.overwrite) {
      setState({
        ...state,
        currentOperand: digit,
        overwrite: false,
      });
      return;
    }
    if (digit === '.' && state.currentOperand?.includes('.')) return;
    if (digit === '0' && state.currentOperand === '0') return;
    
    setState({
      ...state,
      currentOperand: `${state.currentOperand || ''}${digit}`,
    });
  };

  const chooseOperation = (operation: string) => {
    if (state.currentOperand == null && state.previousOperand == null) return;
    
    if (state.currentOperand == null) {
      setState({ ...state, operation });
      return;
    }

    if (state.previousOperand == null) {
      setState({
        ...state,
        operation,
        previousOperand: state.currentOperand,
        currentOperand: null,
      });
      return;
    }

    evaluate();
    setState((prevState) => ({
      ...prevState,
      operation,
      previousOperand: prevState.currentOperand,
      currentOperand: null,
    }));
  };

  const evaluate = () => {
    if (
      state.operation == null ||
      state.currentOperand == null ||
      state.previousOperand == null
    ) {
      return;
    }

    const prev = parseFloat(state.previousOperand);
    const current = parseFloat(state.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    let computation = 0;
    switch (state.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
    }

    const result = computation.toString();
    addToHistory(`${state.previousOperand} ${state.operation} ${state.currentOperand}`, result, 'standard');

    setState({
      overwrite: true,
      previousOperand: null,
      operation: null,
      currentOperand: result,
    });
  };

  const percentage = () => {
    if (state.currentOperand == null) return;
    const current = parseFloat(state.currentOperand);
    setState({
      ...state,
      currentOperand: (current / 100).toString(),
      overwrite: true
    });
  };

  const negate = () => {
    if (state.currentOperand == null) return;
    const current = parseFloat(state.currentOperand);
    setState({
      ...state,
      currentOperand: (current * -1).toString(),
    });
  };

  const addToHistory = (expression: string, result: string, type: 'standard' | 'ai') => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression,
      result,
      type,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  // -- Render --

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-sm bg-black rounded-[3rem] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col h-[850px] sm:h-[800px]">
        
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header / Mode Switcher */}
        <div className="relative z-10 flex items-center justify-between p-6 pb-2">
          <div className="flex bg-zinc-900/80 p-1 rounded-full backdrop-blur-sm border border-zinc-800">
            <button
              onClick={() => setMode(CalculatorMode.STANDARD)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === CalculatorMode.STANDARD 
                  ? 'bg-zinc-700 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CalcIcon size={16} className="mr-2" />
              Calc
            </button>
            <button
              onClick={() => setMode(CalculatorMode.AI)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === CalculatorMode.AI
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles size={16} className="mr-2" />
              AI
            </button>
          </div>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-full transition-colors ${showHistory ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <History size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
          
          {/* History Overlay */}
          {showHistory && (
             <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-white">History</h2>
                  <button 
                    onClick={() => setHistory([])} 
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-900/20 transition-colors"
                  >
                    <RotateCcw size={12} /> Clear
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center text-zinc-600 mt-20">No history yet</div>
                  ) : (
                    history.map(item => (
                      <div key={item.id} className="flex flex-col items-end border-b border-zinc-900 pb-3">
                        <span className="text-zinc-500 text-sm mb-1">{item.expression}</span>
                        <span className="text-white text-xl font-light">{item.result}</span>
                        {item.type === 'ai' && <span className="text-[10px] text-blue-400 mt-1 flex items-center gap-1"><Sparkles size={8}/> AI Solved</span>}
                      </div>
                    ))
                  )}
                </div>
             </div>
          )}

          {/* Standard Mode */}
          {mode === CalculatorMode.STANDARD && (
            <>
              <CalculatorScreen 
                previous={state.previousOperand} 
                current={state.currentOperand} 
                operation={state.operation} 
              />
              
              <div className="flex-1 bg-transparent p-4 sm:p-5 pb-8 grid grid-cols-4 gap-3 sm:gap-4 content-end">
                <Button label="AC" onClick={clear} variant="secondary" />
                <Button label="+/-" onClick={negate} variant="secondary" />
                <Button label="%" onClick={percentage} variant="secondary" />
                <Button label="÷" onClick={() => chooseOperation('÷')} variant="accent" />
                
                <Button label="7" onClick={() => addDigit('7')} />
                <Button label="8" onClick={() => addDigit('8')} />
                <Button label="9" onClick={() => addDigit('9')} />
                <Button label="×" onClick={() => chooseOperation('×')} variant="accent" />
                
                <Button label="4" onClick={() => addDigit('4')} />
                <Button label="5" onClick={() => addDigit('5')} />
                <Button label="6" onClick={() => addDigit('6')} />
                <Button label="-" onClick={() => chooseOperation('-')} variant="accent" />
                
                <Button label="1" onClick={() => addDigit('1')} />
                <Button label="2" onClick={() => addDigit('2')} />
                <Button label="3" onClick={() => addDigit('3')} />
                <Button label="+" onClick={() => chooseOperation('+')} variant="accent" />
                
                <Button label="0" onClick={() => addDigit('0')} span={2} className="pl-8 !justify-start" />
                <Button label="." onClick={() => addDigit('.')} />
                <Button label="=" onClick={evaluate} variant="accent" />
              </div>
            </>
          )}

          {/* AI Mode */}
          {mode === CalculatorMode.AI && (
            <AISolver onSolve={(expr, res) => addToHistory(expr, res, 'ai')} />
          )}

        </div>
      </div>
    </div>
  );
}