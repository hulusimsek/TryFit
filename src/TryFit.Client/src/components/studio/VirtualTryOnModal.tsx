import React, { useState } from 'react';
import { ClothingItem } from '../../types';
import { api, TryOnResponse } from '../../services/api';
import { 
  Sparkles, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight,
  User,
  ShieldCheck
} from 'lucide-react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ClothingItem | null;
  allItems: ClothingItem[];
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  allItems,
}) => {
  const [activeItem, setActiveItem] = useState<ClothingItem | null>(selectedItem || allItems[0] || null);
  const [bodyType, setBodyType] = useState<'petite' | 'standard' | 'curve'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentItem = activeItem || selectedItem || allItems[0];

  const handleRunTryOn = async () => {
    if (!currentItem) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.generateTryOn({
        garmentImageUrl: currentItem.imageUrl,
        garmentTitle: currentItem.title,
        category: currentItem.category,
        modelBodyType: bodyType,
      });

      if (res.success && res.resultImageUrl) {
        setResult(res);
      } else {
        setError(res.errorMessage || 'Yapay zeka görseli oluşturulamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Ücretsiz yapay zeka sunucusuna bağlanılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Yapay Zeka Canlı Giydirme Stüdyosu</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  0 TL Ücretsiz API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trendyol fotoğrafındaki kıyafeti kapüşon, cep ve kumaş dökümüyle canlı mankene giydirir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Garment Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">
              Denemek İstediğiniz Kıyafeti Seçin:
            </label>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {allItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveItem(item);
                    setResult(null);
                    setError(null);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                    currentItem?.title === item.title
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <img src={item.imageUrl} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-950" />
                  <div className="text-left pr-2">
                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <p className="text-xs font-semibold max-w-[130px] truncate">{item.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Body Type Selector */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" />
              Manken Vücut Tipi:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'standard', label: 'Standart / Fit', desc: '168 cm • 58 kg' },
                { id: 'petite', label: 'Minyon / Petite', desc: '158 cm • 49 kg' },
                { id: 'curve', label: 'Kıvrımlı / Curve', desc: '166 cm • 75 kg' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setBodyType(t.id as any);
                    setResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    bodyType === t.id
                      ? 'bg-orange-500/15 border-orange-500 text-orange-300 shadow-sm'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">{t.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          {!result && !isLoading && (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={handleRunTryOn}
                disabled={!currentItem}
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-8 rounded-2xl text-sm flex items-center justify-center gap-2.5 mx-auto shadow-xl shadow-orange-500/25 transition-all cursor-pointer hover:scale-102"
              >
                <Sparkles className="w-4 h-4" />
                <span>Yapay Zeka ile Canlı Mankende Gör (0 TL)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Açık kaynak IDM-VTON motoru kullanılır; cebinizden hiçbir ücret çıkmaz.
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {isLoading && (
            <div className="text-center py-12 space-y-4 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 animate-spin text-orange-500 opacity-80" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Yapay Zeka Kıyafeti Mankene Giydiriyor...</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Kıyafetin kumaş dökümü, kapüşonu, cebi ve omuzları analiz ediliyor. Ücretsiz Hugging Face sunucusunda işlem ortalama 15-25 saniye sürer.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <span className="font-bold block">Üretim Hatası</span>
                <p className="text-[11px] text-red-300/90 mt-0.5">{error}</p>
                <button
                  onClick={handleRunTryOn}
                  className="mt-2 text-xs font-semibold text-white bg-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          )}

          {/* Result Showcase */}
          {result && result.resultImageUrl && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yapay Zeka Giydirmesi Tamamlandı ({Math.round(result.durationMs / 1000)} sn)</span>
                </div>
                <a
                  href={result.resultImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Görseli İndir</span>
                </a>
              </div>

              {/* Side-by-side comparison: Trendyol Item vs Live AI Render */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Trendyol Ürünü
                  </span>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={currentItem?.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-bold text-white mt-2 truncate">{currentItem?.title}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-orange-500/40 text-center shadow-lg shadow-orange-500/10">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-2">
                    ✨ Canlı Mankende Sonuç (AI Try-On)
                  </span>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={result.resultImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-bold text-emerald-400 mt-2">Fotogerçekçi Kumaş & Kalıp</p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleRunTryOn}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Farklı Bedenle Yeniden Dene
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
