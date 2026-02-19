import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow.jsx';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed bottom-24 right-5 z-50 w-[370px] max-w-[calc(100vw-24px)] h-[580px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            style={{ boxShadow: '0 24px 60px rgba(124,58,237,0.18), 0 8px 24px rgba(0,0,0,0.12)' }}
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ───────────────────────────────────── */}
      <motion.div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white text-gray-700 text-xs font-medium px-3 py-2 rounded-full shadow-lg border border-gray-100 whitespace-nowrap"
            >
              👋 Hi! Chat with Wiz
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          id="wiz-chat-toggle"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-wiz-purple to-wiz-blue text-white flex items-center justify-center shadow-xl relative"
          style={{ boxShadow: '0 8px 28px rgba(124,58,237,0.45)' }}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping bg-wiz-purple/30 pointer-events-none" />
          )}
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-6 h-6" />
                </motion.span>
              : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle className="w-6 h-6" />
                </motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </>
  );
}
