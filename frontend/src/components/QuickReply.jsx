import React from 'react';
import { motion } from 'framer-motion';

export default function QuickReply({ options, onSelect, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-4 pb-3"
    >
      {options.map((opt, i) => (
        <motion.button
          key={opt.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ scale: disabled ? 1 : 1.04 }}
          whileTap={{ scale: disabled ? 1 : 0.96 }}
          onClick={() => !disabled && onSelect(opt.value, opt.label)}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
            ${disabled
              ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
              : 'bg-white border-wiz-purple/40 text-wiz-purple hover:bg-wiz-purple hover:text-white hover:border-wiz-purple shadow-sm cursor-pointer'
            }`}
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
