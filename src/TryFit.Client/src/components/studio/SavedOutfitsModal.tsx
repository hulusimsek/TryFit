import React from 'react';
import { Outfit } from '../../types';
import { X, Trash2, ArrowRight, Calendar, ShoppingBag, Ruler } from 'lucide-react';

interface SavedOutfitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  onLoadOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
}

export const SavedOutfitsModal: React.FC<SavedOutfitsModalProps> = ({
  isOpen,
  onClose,
  outfits,
  onLoadOutfit,
  onDeleteOutfit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Kayıtlı Kombinlerim</h3>
              <p className="text-xs text-slate-400">Veritabanında kayıtlı kombinlerinizi görüntüleyin ve mankene giydirin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin">
          {outfits.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-orange-400" />
              <p className="text-sm font-medium">Henüz kayıtlı bir kombin yok.</p>
              <p className="text-xs text-slate-500 mt-1">Trendyol parçalarınızı ekleyip "Kombinlerime Kaydet" butonuna basarak kaydedebilirsiniz.</p>
            </div>
          ) : (
            outfits.map(outfit => (
              <div
                key={outfit.id}
                className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-100 truncate">{outfit.title}</h4>
                    <span className="text-[11px] font-mono text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 shrink-0">
                      {outfit.totalPrice.toLocaleString('tr-TR')} TL
                    </span>
                  </div>

                  {outfit.description && (
                    <p className="text-xs text-slate-400 truncate">{outfit.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-slate-500" />
                      Manken: {outfit.mannequinHeightCm} cm / {outfit.mannequinWeightKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {/* Thumbnail strip of items */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {outfit.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.imageUrl}
                        alt={item.title}
                        title={`${item.title} (${item.price} TL)`}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-slate-900"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onLoadOutfit(outfit);
                      onClose();
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <span>Mankene Giydir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-xl transition-colors"
                    title="Kombini Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
