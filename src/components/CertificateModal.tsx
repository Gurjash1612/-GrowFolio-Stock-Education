import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Printer, X, Shield, Check, Info } from 'lucide-react';
import { gameAudio } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  trackTitle: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  completedCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  trackTitle,
  completedCount,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    gameAudio.playClick();
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const originalHTML = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GrowFolio Professional Certificate - ${playerName}</title>
            <style>
              body { font-family: 'Inter', sans-serif; background: #ffffff; color: #111111; padding: 40px; text-align: center; }
              .cert-border { border: 15px double #b45309; padding: 50px; background: #fffbeb; display: inline-block; max-width: 800px; }
              .title { font-family: 'Georgia', serif; font-size: 36px; color: #78350f; margin-bottom: 20px; }
              .name { font-size: 28px; font-weight: bold; border-bottom: 2px solid #b45309; padding-bottom: 10px; margin: 30px auto; width: 60%; }
              .seal { font-size: 80px; margin: 40px 0; }
              @media print { body { padding: 0; } .cert-border { width: 100%; border-width: 10px; } }
            </style>
          </head>
          <body>
            <div class="cert-border">
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  // Generate unique credential hash
  const certificateId = `GF-${trackTitle.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 border-2 border-yellow-500/30 rounded-[40px] max-w-2xl w-full p-6 md:p-8 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => { gameAudio.playClick(); onClose(); }}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Certificate Printable Canvas */}
          <div 
            ref={printRef}
            className="border-8 border-double border-yellow-600/40 bg-zinc-950 p-6 md:p-10 rounded-[32px] text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-2xl"
          >
            {/* Watermark badge backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Award className="w-96 h-96 text-yellow-500" />
            </div>

            <div className="flex flex-col items-center">
              <Award className="w-14 h-14 text-yellow-500 animate-pulse mb-3" />
              <h3 className="font-serif font-bold text-xl md:text-3xl text-yellow-500 tracking-wide uppercase">
                Certificate of Competency
              </h3>
              <p className="text-[10px] text-yellow-500/60 font-mono tracking-widest mt-1 uppercase">
                GrowFolio Financial Academy
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/40 text-xs italic font-serif">This is proudly presented to</p>
              <h4 className="text-white text-lg md:text-2xl font-black tracking-tight border-b border-yellow-500/20 pb-1 max-w-sm mx-auto">
                {playerName || 'Honorable GrowTrader'}
              </h4>
            </div>

            <p className="text-white/60 text-xs max-w-md mx-auto leading-relaxed font-serif">
              For completing all core modules in the <span className="text-yellow-400 font-bold">{trackTitle} Investment Course</span>, 
              demonstrating comprehensive fluency in stock market mechanisms, portfolio diversification, and technical trend charts.
            </p>

            {/* Seals & Signatures Row */}
            <div className="flex justify-between items-center w-full max-w-md pt-4 border-t border-white/5">
              <div className="text-left space-y-0.5">
                <span className="text-[9px] text-white/40 font-mono">CREDENTIAL ID</span>
                <p className="text-[10px] font-mono font-bold text-white/70">{certificateId}</p>
              </div>

              {/* Graphical Gold Seal */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.25)] select-none">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-yellow-200 flex items-center justify-center">
                  <span className="text-[8px] font-black font-mono text-zinc-950">APPROVED</span>
                </div>
                {/* Wax seal ribbons ribbons */}
                <div className="absolute -bottom-1 w-2.5 h-4 bg-amber-600 rotate-12 -z-10 rounded-b"></div>
                <div className="absolute -bottom-1.5 w-2.5 h-4 bg-amber-600 -rotate-12 -z-10 rounded-b"></div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[9px] text-white/40 font-mono">AUTHORIZED BY</span>
                <p className="text-[10px] font-serif font-black text-white/70">GrowBot CEO</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" /> Export/Print Certificate
            </button>
            <button
              onClick={() => { gameAudio.playClick(); onClose(); }}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CertificateModal;
