import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Eraser } from 'lucide-react';
import { solveWithGemini } from '../services/geminiService';
import { AIResponse } from '../types';

interface AISolverProps {
  onSolve: (expression: string, result: string) => void;
}

export const AISolver: React.FC<AISolverProps> = ({ onSolve }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSolve = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse(null);
    
    const result = await solveWithGemini(input);
    
    setResponse(result);
    setLoading(false);
    if (result.result !== "Error") {
      onSolve(input, result.result);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSolve();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 space-y-4 animate-in fade-in duration-300">
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        {/* Welcome or Empty State */}
        {!response && !loading && (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500 mt-10">
            <Sparkles className="w-12 h-12 mb-3 text-zinc-700" />
            <p className="text-center text-sm">Ask any math question.<br/>"What is the square root of 5 + 20?"</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <span className="text-zinc-400 text-sm font-mono animate-pulse">Crunching numbers...</span>
          </div>
        )}

        {/* Result State */}
        {response && (
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/10 shadow-xl backdrop-blur-md">
            <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2">Answer</div>
            <div className="text-3xl sm:text-4xl text-white font-light mb-4 font-mono">
              {response.result}
            </div>
            <div className="h-px w-full bg-white/10 mb-4" />
            <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2">Explanation</div>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {response.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-auto bg-[#1c1c1c] rounded-3xl p-2 flex items-end border border-zinc-800 focus-within:border-zinc-600 transition-colors">
        <button 
            onClick={() => { setInput(''); setResponse(null); }}
            className="p-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Clear"
        >
            <Eraser size={20} />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a math problem..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 text-lg p-3 outline-none resize-none max-h-32 font-light"
          rows={1}
        />
        <button 
          onClick={handleSolve}
          disabled={loading || !input.trim()}
          className="p-3 bg-white text-black rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};