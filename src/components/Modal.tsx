import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  noScroll?: boolean;
}

export function Modal({ onClose, title, children, noScroll = false }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#20126E]/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold font-serif text-[#20126E]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`flex-1 p-8 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
