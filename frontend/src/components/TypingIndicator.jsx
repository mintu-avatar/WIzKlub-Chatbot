import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2 justify-start"
    >
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-wiz-purple to-wiz-blue flex items-center justify-center text-white text-xs font-bold shadow-sm">
        W
      </div>

      {/* Dots */}
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </motion.div>
  );
}
