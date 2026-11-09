import React, { useState, useEffect } from 'react';
import { ClothingItem } from '../../types';
import { removeImageBackground } from '../../utils/imageProcessing';
import { Sparkles, ExternalLink, Tag } from 'lucide-react';

interface DressingMirrorProps {
  heightCm: number;
  weightKg: number;
  outfitItems: ClothingItem[];
}

export const DressingMirror: React.FC<DressingMirrorProps> = ({
  heightCm,
  weightKg,
  outfitItems,
}) => {
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});

  // Background removal on items
  useEffect(() => {
    let isMounted = true;
    outfitItems.forEach(async (item) => {
      if (!processedImages[item.imageUrl]) {
        try {
          const res = await removeImageBackground(item.imageUrl);
          if (isMounted) {
            setProcessedImages(prev => ({ ...prev, [item.imageUrl]: res.transparentDataUrl }));
          }
        } catch {
          if (isMounted) {
            setProcessedImages(prev => ({ ...prev, [item.imageUrl]: item.imageUrl }));
          }
        }
      }
    });
    return () => { isMounted = false; };
  }, [outfitItems]);

  // Proportions
  const heightRatio = heightCm / 168.0;
  const bmi = weightKg / ((heightCm / 100) * (heightCm / 100));
  const widthRatio = Math.pow(bmi / 21.26, 0.65);

  const topItem = outfitItems.find(i => i.category === 'Top');
  const bottomItem = outfitItems.find(i => i.category === 'Bottom');
  const dressItem = outfitItems.find(i => i.category === 'Dress');
  const outerItem = outfitItems.find(i => i.category === 'Outerwear');
  const shoesItem = outfitItems.find(i => i.category === 'Shoes');

  return (
    <div className="relative w-full h-full min-h-[580px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6">
      {/* Luxury Dressing Room Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(242,122,26,0.12)_0%,rgba(15,23,42,0)_70%)] pointer-events-none" />

      {/* Floating Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200">Dijital Giyinme Aynası</span>
        <span className="text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono">Dekupe Fit</span>
      </div>

      {/* Full-Length Boutique Mirror Frame */}
      <div 
        className="relative w-full max-w-[360px] h-[520px] rounded-full border-4 border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-slate-950/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col items-center justify-end pb-8 overflow-hidden transition-all duration-300"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.7)',
        }}
      >
        {/* Mirror Reflection Highlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Elegant Silhouette Background (Adjusts with Height & Weight) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300"
          style={{
            transform: `scale(${widthRatio}, ${heightRatio})`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Subtle female silhouette vector behind garments */}
          <svg className="w-56 h-[460px] opacity-25 text-slate-400 fill-current" viewBox="0 0 100 240">
            {/* Head */}
            <ellipse cx="50" cy="18" rx="8" ry="11" />
            {/* Neck */}
            <path d="M47,28 L53,28 L54,38 L46,38 Z" />
            {/* Shoulders & Torso */}
            <path d="M33,40 Q50,37 67,40 Q71,60 63,80 Q50,85 37,80 Q29,60 33,40 Z" />
            {/* Waist & Hips */}
            <path d="M39,78 Q50,82 61,78 Q68,98 68,115 Q50,118 32,115 Q32,98 39,78 Z" />
            {/* Legs */}
            <path d="M36,115 Q43,150 42,205 Q41,230 40,235 L47,235 Q49,200 48,115 Z" />
            <path d="M64,115 Q57,150 58,205 Q59,230 60,235 L53,235 Q51,200 52,115 Z" />
          </svg>
        </div>

        {/* CLOTHING LAYERS CONTAINER */}
        <div 
          className="relative w-full h-full flex flex-col items-center justify-center z-10 transition-transform duration-300"
          style={{
            transform: `scale(${widthRatio}, ${heightRatio})`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Dress (If active, takes precedence over top/bottom) */}
          {dressItem && (
            <div className="absolute top-[85px] w-52 z-15 flex justify-center animate-in fade-in zoom-in-95 duration-300">
              <img
                src={processedImages[dressItem.imageUrl] || dressItem.imageUrl}
                alt={dressItem.title}
                className="max-h-[300px] object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]"
              />
            </div>
          )}

          {/* Top (Upper Garment) */}
          {!dressItem && topItem && (
            <div className="absolute top-[75px] w-48 z-10 flex justify-center animate-in fade-in zoom-in-95 duration-300">
              <img
                src={processedImages[topItem.imageUrl] || topItem.imageUrl}
                alt={topItem.title}
                className="max-h-[170px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
              />
            </div>
          )}

          {/* Bottom (Pants / Skirt) */}
          {!dressItem && bottomItem && (
            <div className="absolute top-[205px] w-44 z-12 flex justify-center animate-in fade-in zoom-in-95 duration-300">
              <img
                src={processedImages[bottomItem.imageUrl] || bottomItem.imageUrl}
                alt={bottomItem.title}
                className="max-h-[220px] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)]"
              />
            </div>
          )}

          {/* Outerwear (Jacket / Trench coat layered on top of everything) */}
          {outerItem && (
            <div className="absolute top-[60px] w-56 z-20 flex justify-center animate-in fade-in zoom-in-95 duration-300">
              <img
                src={processedImages[outerItem.imageUrl] || outerItem.imageUrl}
                alt={outerItem.title}
                className="max-h-[290px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)]"
              />
            </div>
          )}

          {/* Shoes (At the base) */}
          {shoesItem && (
            <div className="absolute bottom-[20px] w-36 z-25 flex justify-center animate-in fade-in zoom-in-95 duration-300">
              <img
                src={processedImages[shoesItem.imageUrl] || shoesItem.imageUrl}
                alt={shoesItem.title}
                className="max-h-[70px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
              />
            </div>
          )}

          {/* Empty State */}
          {outfitItems.length === 0 && (
            <div className="text-center p-6 space-y-2 z-10">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">Giyinme Aynası Boş</p>
              <p className="text-xs text-slate-400 max-w-[200px]">
                Kombin parçalarınızı sağdaki listeden ekleyerek burada üzerinizde görün.
              </p>
            </div>
          )}
        </div>

        {/* Floor Shadow on Mirror Base */}
        <div className="w-48 h-3 rounded-full bg-black/60 blur-md -mb-3 z-5" />
      </div>

      {/* Outfit Tags / Summary underneath */}
      {outfitItems.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 z-10 max-w-md">
          {outfitItems.map(item => (
            <a
              key={item.category}
              href={item.productUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px] text-slate-300 hover:text-orange-400 hover:border-orange-500/50 transition-all shadow-sm"
            >
              <Tag className="w-3 h-3 text-orange-400" />
              <span className="font-semibold">{item.title.split(' ').slice(0, 3).join(' ')}</span>
              <span className="font-mono text-orange-400 font-bold">{item.price} TL</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
