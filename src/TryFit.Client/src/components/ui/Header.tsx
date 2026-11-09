import React from 'react';
import { Bookmark } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenTryOnModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ savedCount, onOpenSavedModal, onOpenTryOnModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <span className="text-xl">👗</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TryFit
                <span className="text-orange-500 text-xs px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 font-bold uppercase tracking-wider">
                  Trendyol 3D + AI
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Kadın Giyim İçin Kişiselleştirilmiş 3 Boyutlu Manken & Canlı AI Giydirme Stüdyosu
            </p>
          </div>
        </div>

        {/* Tech Badges & Actions */}
        <div className="flex items-center gap-3">
          {/* AI Try-On Glow Button */}
          {onOpenTryOnModal && (
            <button
              onClick={onOpenTryOnModal}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-102"
            >
              <span>✨ Canlı AI Dene</span>
              <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">0 TL</span>
            </button>
          )}

          {/* Saved Outfits Button */}
          <button
            onClick={onOpenSavedModal}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700/80 hover:border-slate-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span>Kayıtlı Kombinler</span>
            {savedCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
