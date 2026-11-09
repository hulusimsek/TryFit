import React, { useState } from 'react';
import { ClothingItem, ClothingCategory } from '../../types';
import { 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  ShoppingBag, 
  Layers, 
  LayoutGrid, 
  Columns3,
  Bookmark
} from 'lucide-react';

interface EditorialLookbookProps {
  items: ClothingItem[];
  onRemoveItem: (category: ClothingCategory) => void;
  onSaveOutfit: () => void;
}

export const EditorialLookbook: React.FC<EditorialLookbookProps> = ({
  items,
  onRemoveItem,
  onSaveOutfit,
}) => {
  const [layoutMode, setLayoutMode] = useState<'editorial' | 'grid' | 'collage'>('editorial');

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const topItem = items.find(i => i.category === 'Top');
  const bottomItem = items.find(i => i.category === 'Bottom');
  const dressItem = items.find(i => i.category === 'Dress');
  const outerItem = items.find(i => i.category === 'Outerwear');
  const shoesItem = items.find(i => i.category === 'Shoes');

  return (
    <div className="relative w-full h-full min-h-[620px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#0e1628] to-slate-950 border border-slate-800 shadow-2xl flex flex-col p-6 lg:p-8">
      {/* Background Haute Couture Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Bar: Editorial Branding & Layout Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] text-orange-400 font-extrabold uppercase font-mono bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              TRENDYOL CAPSULE
            </span>
            <span className="text-xs text-slate-400 font-medium">• Editoryal Kombin Panosu</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Günün Kombin Stüdyosu
          </h2>
        </div>

        {/* Layout Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setLayoutMode('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              layoutMode === 'editorial'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Dergi Kapağı Düzeni"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editoryal</span>
          </button>

          <button
            onClick={() => setLayoutMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Podyum Grid Düzeni"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            onClick={() => setLayoutMode('collage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              layoutMode === 'collage'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Kombin Kolajı"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kolaj</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20 shadow-lg">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Kombin Tahtanız Boş</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sağdaki panelden Trendyol ürün linki yapıştırın veya hızlı deneme parçalarına tıklayarak kombininizi oluşturun.
            </p>
          </div>
        ) : layoutMode === 'editorial' ? (
          /* EDITORIAL MAGAZINE COVER LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Hero Piece (Outerwear or Dress) */}
            <div className="md:col-span-6 relative group">
              {outerItem || dressItem ? (
                <div className="relative bg-slate-900/70 border border-slate-700/80 rounded-2xl p-4 shadow-xl overflow-hidden hover:border-orange-500/40 transition-all">
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative">
                    <img
                      src={(outerItem || dressItem)!.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-400 uppercase tracking-wider border border-slate-700">
                      {(outerItem || dressItem)!.category === 'Outerwear' ? 'Dış Giyim' : 'Elbise'}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[200px]">
                        {(outerItem || dressItem)!.title}
                      </p>
                      <p className="text-[11px] text-orange-400 font-mono font-bold">
                        {(outerItem || dressItem)!.price.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href={(outerItem || dressItem)!.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-orange-400 rounded-lg hover:bg-slate-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveItem((outerItem || dressItem)!.category)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-slate-500">
                  <Sparkles className="w-6 h-6 mb-2 opacity-40 text-orange-400" />
                  <p className="text-xs font-medium">Dış Giyim / Ceket Parçası Ekleyin</p>
                </div>
              )}
            </div>

            {/* Right Side: Complementary Layers (Top, Bottom, Shoes) */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {[topItem, bottomItem, shoesItem].filter(Boolean).map((item) => (
                <div
                  key={item!.category}
                  className="bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex items-center justify-between gap-4 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item!.imageUrl}
                      alt=""
                      className="w-16 h-20 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        {item!.category === 'Top' ? 'Üst Giyim' : item!.category === 'Bottom' ? 'Alt Giyim' : 'Ayakkabı'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">
                        {item!.title}
                      </h4>
                      <p className="text-xs font-semibold text-orange-400 font-mono mt-1">
                        {item!.price.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={item!.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-orange-400 rounded-lg hover:bg-slate-700/50"
                      title="Trendyol'da Gör"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onRemoveItem(item!.category)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700/50"
                      title="Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : layoutMode === 'grid' ? (
          /* PODYUM GRID LAYOUT */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div
                key={item.category}
                className="bg-slate-900/70 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-3 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 relative">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-orange-400 uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-orange-400 font-mono">{item.price} TL</span>
                    <button
                      onClick={() => onRemoveItem(item.category)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* COLLAGE / MOODBOARD LAYOUT */
          <div className="relative min-h-[420px] w-full bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 flex flex-wrap items-center justify-center gap-6">
            {items.map((item, idx) => (
              <div
                key={item.category}
                className={`relative bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl hover:scale-105 transition-all duration-300 w-44 ${
                  idx % 2 === 0 ? '-rotate-2' : 'rotate-2'
                }`}
              >
                <img src={item.imageUrl} alt="" className="w-full h-48 rounded-xl object-cover bg-slate-950" />
                <div className="mt-2">
                  <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                  <p className="text-[11px] text-orange-400 font-mono font-bold">{item.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar: Total & Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-5 mt-6">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Toplam Kombin Değeri:</span>
          <span className="text-2xl font-black text-orange-400 font-mono tracking-tight">
            {totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSaveOutfit}
            disabled={items.length === 0}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span>Kombini Kaydet</span>
          </button>

          <a
            href="https://www.trendyol.com"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Trendyol'da Satın Al</span>
          </a>
        </div>
      </div>
    </div>
  );
};
