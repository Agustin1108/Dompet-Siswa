import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { IOSButton } from './IOSButton';
import { TransactionType } from '../types';
import { audioService } from '../services/audioService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, type: TransactionType, category: string, note: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [note, setNote] = useState('');
  const [animateShow, setAnimateShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimateShow(true);
      setAmount('');
      setNote('');
      setType('EXPENSE');
    } else {
      setTimeout(() => setAnimateShow(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !animateShow) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    audioService.playSuccess();
    onSave(parseFloat(amount), type, category, note);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-md bg-[#F2F2F7] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden
        transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col max-h-[90vh]
        ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-10 sm:scale-95'}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shrink-0">
          <IOSButton variant="ghost" onClick={onClose} className="!p-2 text-sm">Batal</IOSButton>
          <h2 className="text-base font-semibold">Transaksi Baru</h2>
          <div className="w-12"></div> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Amount Input */}
          <div className="text-center py-4 bg-white rounded-xl shadow-sm">
             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jumlah Uang</label>
             <div className="flex justify-center items-center text-4xl font-bold mt-2 px-4">
               <span className="text-gray-400 mr-2 text-2xl">Rp</span>
               <input 
                 type="number" 
                 autoFocus
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="bg-transparent text-center w-full focus:outline-none placeholder-gray-300 text-black min-w-0"
                 placeholder="0"
               />
             </div>
          </div>

          {/* Type Switcher */}
          <div className="flex p-1 bg-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => {
                 setType('EXPENSE');
                 audioService.playTap();
              }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'EXPENSE' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                 setType('INCOME');
                 audioService.playTap();
              }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'INCOME' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
            >
              Pemasukan
            </button>
          </div>

          {/* Category Grid - Changed from scroll to Grid */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide ml-1">Kategori</label>
            <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => {
                    setCategory(cat.name);
                    audioService.playTap();
                  }}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-90`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 transition-all duration-200 ${category === cat.name ? cat.color + ' shadow-lg scale-110 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] text-center w-full truncate ${category === cat.name ? 'font-semibold text-black' : 'text-gray-400'}`}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="bg-white rounded-xl p-3 flex items-center shadow-sm">
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm"
              placeholder="Catatan tambahan (opsional)..."
            />
          </div>

          {/* Submit */}
          <IOSButton type="submit" className="w-full py-3.5 text-base font-semibold mt-4 shadow-lg shadow-blue-500/20">
            Simpan Transaksi
          </IOSButton>

        </form>
      </div>
    </div>
  );
};
