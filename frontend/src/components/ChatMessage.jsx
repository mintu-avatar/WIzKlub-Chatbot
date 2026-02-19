import React from 'react';
import { motion } from 'framer-motion';

/** Render text with **bold** markdown syntax */
const renderText = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
};

export default function ChatMessage({ message }) {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-wiz-purple to-wiz-blue flex items-center justify-center text-white text-xs font-bold shadow-sm">
          W
        </div>
      )}

      {/* Bubble */}
      <div
        className={`relative max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isBot
            ? 'bg-gray-100 text-gray-800 rounded-bl-sm bubble-bot'
            : 'bg-wiz-purple text-white rounded-br-sm bubble-user'
          }`}
      >
        {renderText(message.text)}
      </div>
    </motion.div>
  );
}
