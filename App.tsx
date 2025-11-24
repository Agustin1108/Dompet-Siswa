import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction } from './types';
import { databaseService } from './services/databaseService';
import { generatePDF } from './services/pdfService';
import { IOSButton } from './components/IOSButton';
import { TransactionModal } from './components/TransactionModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CATEGORIES } from './constants';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  // Initialize data
  useEffect(() => {
    const data = databaseService.getAllTransactions();
    setTransactions(data);
    setBalance(databaseService.calculateBalance(data));
    
    // Attempt to unlock audio context on first user interaction if needed
    const unlockAudio = () => {
        // Just resume context, don't play sound immediately
        audioService.playTap(); 
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
  }, []);

  const handleAddTransaction = (amount: number, type: 'INCOME' | 'EXPENSE', category: string, note: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      date: Date.now(),
      amount,
      type,
      category,
      note
    };
    
    const updated = databaseService.addTransaction(newTx);
    setTransactions(updated);
    setBalance(databaseService.calculateBalance(updated));
    setIsModalOpen(false);
  };

  const initiateDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
        audioService.playDelete();
        const updated = databaseService.deleteTransaction(deleteId);
        setTransactions(updated);
        setBalance(databaseService.calculateBalance(updated));
        setDeleteId(null);
    }
  };

  const handleDownloadPDF = () => {
    audioService.playSuccess();
    generatePDF(transactions, balance);
  };

  // Group transactions by Date for that iOS List look
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  transactions.forEach(tx => {
    const dateKey = new Date(tx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!groupedTransactions[dateKey]) groupedTransactions[dateKey] = [];
    groupedTransactions[dateKey].push(tx);
  });

  const getCategoryIcon = (name: string) => {
    return CATEGORIES.find(c => c.name === name)?.icon || '⚪';
  };

  const getCategoryColor = (name: string) => {
    return CATEGORIES.find(c => c.name === name)?.color || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen pb-24 font-sans text-gray-900 selection:bg-blue-200">
      
      {/* Header & Balance Card */}
      <header className="sticky top-0 z-10 glass border-b border-gray-200/50">
        <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight">Dompet Siswa</h1>
            <IOSButton variant="ghost" onClick={handleDownloadPDF} className="!p-2 text-blue-500">
                <Download size={20} />
            </IOSButton>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-6 space-y-6">
        
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Saldo</p>
                <h2 className={`text-4xl font-bold tracking-tight ${balance < 0 ? 'text-red-500' : 'text-black'}`}>
                    Rp {balance.toLocaleString('id-ID')}
                </h2>
                
                <div className="mt-6 flex justify-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                      <ArrowDownCircle size={16} className="text-green-600"/>
                      <span className="text-xs font-semibold text-green-700">Masuk</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-100">
                      <ArrowUpCircle size={16} className="text-red-600"/>
                      <span className="text-xs font-semibold text-red-700">Keluar</span>
                   </div>
                </div>
            </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-6 animate-slide-up">
            {transactions.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <Wallet className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">Belum ada transaksi</p>
                </div>
            ) : (
                Object.entries(groupedTransactions).map(([date, items]) => (
                    <div key={date}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-2">{date}</h3>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            {items.map((tx, idx) => (
                                <div 
                                    key={tx.id} 
                                    className={`
                                        group relative flex items-center justify-between p-4 transition-colors hover:bg-gray-50
                                        ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg text-white shadow-sm ${getCategoryColor(tx.category)}`}>
                                            {getCategoryIcon(tx.category)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-gray-900">{tx.category}</span>
                                            <span className="text-xs text-gray-500">{tx.note || (tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                                        </span>
                                        {/* Mobile friendly delete button - always visible on touch but subtle, clear on hover */}
                                        <button 
                                            onClick={() => initiateDelete(tx.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 active:text-red-500 transition-colors"
                                            aria-label="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>

      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <IOSButton 
            className="rounded-full w-14 h-14 !bg-black text-white shadow-2xl flex items-center justify-center pointer-events-auto hover:scale-105 active:scale-95 transition-transform" 
            onClick={() => {
                setIsModalOpen(true);
                audioService.playTap();
            }}
          >
             <Plus size={24} strokeWidth={3} />
          </IOSButton>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTransaction} 
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        title="Hapus Transaksi?"
        message="Riwayat ini akan dihapus permanen dari catatan."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default App;
