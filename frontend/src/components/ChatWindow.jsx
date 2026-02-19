import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import QuickReply from './QuickReply.jsx';
import { useChat } from '../hooks/useChat.js';

export default function ChatWindow({ onClose }) {
  const {
    messages, currentState, currentStep, isTyping, inputEnabled,
    isComplete, startChat, handleUserInput,
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Start chat once on mount
  useEffect(() => {
    startChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus text input when it unlocks
  useEffect(() => {
    if (inputEnabled && currentStep?.inputType !== 'quick') {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [inputEnabled, currentStep]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const val = inputValue.trim();
    if (!val || !inputEnabled) return;
    handleUserInput(val, val);
    setInputValue('');
  };

  const inputType  = currentStep?.inputType;
  const isQuick    = inputEnabled && inputType === 'quick';
  const showInput  = inputEnabled && ['text', 'phone', 'email'].includes(inputType);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-wiz-purple to-wiz-blue text-white flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-sm shadow">
          W
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight">Wiz — WizKlub Assistant</p>
          <p className="text-xs text-white/70">Typically replies instantly</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { startChat(); setInputValue(''); }}
            title="Restart"
            className="p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-lg leading-none"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick replies ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isQuick && currentStep?.options && (
          <QuickReply
            key={currentState}
            options={currentStep.options}
            onSelect={handleUserInput}
            disabled={false}
          />
        )}
      </AnimatePresence>

      {/* ── Text input ───────────────────────────────── */}
      {showInput && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type={inputType === 'email' ? 'email' : inputType === 'phone' ? 'tel' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentStep?.placeholder ?? 'Type here…'}
            className="flex-1 text-sm px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-wiz-purple/40 focus:border-wiz-purple transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-r from-wiz-purple to-wiz-blue text-white flex items-center justify-center shadow hover:shadow-md hover:opacity-90 transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* ── Completion CTA ───────────────────────────── */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4 flex gap-2"
        >
          <a
            href="https://wizklab.com"
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-xs py-2.5 rounded-full bg-gradient-to-r from-wiz-purple to-wiz-blue text-white font-semibold hover:opacity-90 transition shadow"
          >
            🌐 Explore WizKlub
          </a>
          <button
            onClick={() => { startChat(); setInputValue(''); }}
            className="flex-1 text-center text-xs py-2.5 rounded-full border border-wiz-purple/30 text-wiz-purple font-semibold hover:bg-wiz-purple/5 transition"
          >
            ↩ Start Over
          </button>
        </motion.div>
      )}

      {/* ── Footer branding ──────────────────────────── */}
      <p className="text-center text-[10px] text-gray-400 pb-2">
        Powered by <span className="font-semibold text-wiz-purple">WizKlub</span>
      </p>
    </div>
  );
}
