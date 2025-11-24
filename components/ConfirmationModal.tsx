import React, { useEffect, useState } from 'react';
import { IOSButton } from './IOSButton';
import { audioService } from '../services/audioService';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      audioService.playTap(); // Sound prompt when alert appears
    } else {
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel}></div>

      {/* Alert Box */}
      <div className={`
        relative w-full max-w-[270px] bg-white/90 backdrop-blur-xl rounded-[14px] shadow-2xl overflow-hidden text-center transform transition-transform duration-200
        ${isOpen ? 'scale-100' : 'scale-95'}
      `}>
        <div className="p-4 pt-5">
          <h3 className="text-[17px] font-semibold text-black mb-1">{title}</h3>
          <p className="text-[13px] leading-relaxed text-black/80">{message}</p>
        </div>

        <div className="flex border-t border-gray-300/50 divide-x divide-gray-300/50">
          <button
            onClick={() => {
              audioService.playTap();
              onCancel();
            }}
            className="flex-1 py-3 text-[17px] text-[#007AFF] font-normal active:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              // Delete sound handled by parent or here
              onConfirm();
            }}
            className="flex-1 py-3 text-[17px] text-[#FF3B30] font-semibold active:bg-gray-200 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
