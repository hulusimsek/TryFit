import React, { useState, useEffect } from 'react';
import { ClothingItem, ClothingCategory } from '../../types';
import { api } from '../../services/api';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  Bookmark,
  Sparkle
} from 'lucide-react';

interface OutfitBuilderProps {
  items: ClothingItem[];
  onAddItem: (item: ClothingItem) => void;
  onRemoveItem: (category: ClothingCategory) => void;
  onClearAll: () => void;
  onSaveOutfit: (title: string, desc: string) => Promise<void>;
  isSaving: boolean;
  onTryOnItem?: (item: ClothingItem) => void;
}

// 10 Curated Trendyol Pieces Default Fallback (3 Hoodies, 3 Dresses, 2 Coats, 2 Pants)
const DEFAULT_CURATED_ITEMS: ClothingItem[] = [
  // 3 Hoodies
  {
    id: 'ty-hoodie-01',
    title: 'Oversize Kanguru Cepli Siyah Kapüşonlu Sweatshirt',
    brand: 'Trendyol Collection',
    price: 599.90,
    currency: 'TL',
    category: 'Top',
    subCategory: 'hoodie',
    detectedColor: 'Siyah',
    hexColor: '#161616',
    fabricElasticity: 'Şardonlu Kalın Pamuk (Az Esnek)',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyol-collection/siyah-kanguru-cepli-oversize-hoodie-p-101',
    selectedSize: 'M',
  },
  {
    id: 'ty-hoodie-02',
    title: 'Fermuarlı İçi Polarlı Gri Melanj Rahat Kesim Sweatshirt',
    brand: 'Trendyolmilla',
    price: 649.90,
    currency: 'TL',
    category: 'Top',
    subCategory: 'hoodie',
    detectedColor: 'Gri',
    hexColor: '#8a8f96',
    fabricElasticity: 'Orta Esnek Pamuk Karışımı',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyolmilla/gri-melanj-fermuarli-hoodie-p-102',
    selectedSize: 'M',
  },
  {
    id: 'ty-hoodie-03',
    title: 'Polo Yaka Nakışlı Ekru Triko Sweatshirt',
    brand: 'Dilvin',
    price: 529.90,
    currency: 'TL',
    category: 'Top',
    subCategory: 'tshirt',
    detectedColor: 'Ekru',
    hexColor: '#f5f2eb',
    fabricElasticity: 'Yüksek Esnek Triko Örgü',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/dilvin/polo-yaka-ekru-triko-p-103',
    selectedSize: 'S',
  },

  // 3 Dresses
  {
    id: 'ty-dress-01',
    title: 'V Yaka Yırtmaçlı Kırmızı Saten Kokteyl Elbisesi',
    brand: 'Trendyol Curve',
    price: 899.90,
    currency: 'TL',
    category: 'Dress',
    subCategory: 'dress',
    detectedColor: 'Kırmızı',
    hexColor: '#a31824',
    fabricElasticity: 'Hafif Likralı İpeksi Saten',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyol-curve/kirmizi-saten-elbise-p-201',
    selectedSize: 'M',
  },
  {
    id: 'ty-dress-02',
    title: 'Kare Yaka Mini Çiçekli Şifon Yazlık Elbise',
    brand: 'Trendyolmilla',
    price: 479.90,
    currency: 'TL',
    category: 'Dress',
    subCategory: 'dress',
    detectedColor: 'Çok Renkli',
    hexColor: '#e6739f',
    fabricElasticity: 'Esnemez Dokuma Şifon (Astarlı)',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyolmilla/cicekli-sifon-mini-elbise-p-202',
    selectedSize: 'S',
  },
  {
    id: 'ty-dress-03',
    title: 'Yırtmaçlı Boğazlı Siyah Bodycon Triko Midi Elbise',
    brand: 'Mango',
    price: 1199.90,
    currency: 'TL',
    category: 'Dress',
    subCategory: 'dress',
    detectedColor: 'Siyah',
    hexColor: '#1a1a1a',
    fabricElasticity: 'Yüksek Likralı Fitilli Triko',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/mango/siyah-bodycon-midi-elbise-p-203',
    selectedSize: 'M',
  },

  // 2 Coats / Jackets
  {
    id: 'ty-coat-01',
    title: 'Kuşaklı Kruvaze Su Geçirmez Bej Klasik Trençkot',
    brand: 'Trendyol Curve',
    price: 1499.90,
    currency: 'TL',
    category: 'Outerwear',
    subCategory: 'coat',
    detectedColor: 'Bej',
    hexColor: '#bca284',
    fabricElasticity: 'Esnemez Dokuma Gabardin Kumaş',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyol-curve/bej-kruvaze-trenckot-p-301',
    selectedSize: 'M',
  },
  {
    id: 'ty-coat-02',
    title: 'Fermuarlı Metal Aksesuarlı Siyah Biker Deri Ceket',
    brand: 'Trendyolmilla',
    price: 1299.00,
    currency: 'TL',
    category: 'Outerwear',
    subCategory: 'jacket',
    detectedColor: 'Siyah',
    hexColor: '#111111',
    fabricElasticity: 'Esnemez Suni Deri / Kalın Astar',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyolmilla/siyah-biker-deri-ceket-p-302',
    selectedSize: 'S',
  },

  // 2 Pants / Jeans
  {
    id: 'ty-pants-01',
    title: 'Yüksek Bel Vintage Yıkamalı Mavi Mom Jean Pantolon',
    brand: 'Trendyolmilla',
    price: 699.90,
    currency: 'TL',
    category: 'Bottom',
    subCategory: 'jeans',
    detectedColor: 'Açık Mavi',
    hexColor: '#395b82',
    fabricElasticity: '%100 Pamuk Tok Denim (Esnemez)',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyolmilla/vintage-mavi-mom-jean-p-401',
    selectedSize: 'S',
  },
  {
    id: 'ty-pants-02',
    title: 'Yüksek Bel Dökümlü Geniş Paça Siyah Palazzo Pantolon',
    brand: 'Trendyol Curve',
    price: 749.90,
    currency: 'TL',
    category: 'Bottom',
    subCategory: 'jeans',
    detectedColor: 'Siyah',
    hexColor: '#1e1e1e',
    fabricElasticity: 'Akıcı Dökümlü Kumaş (Hafif Esnek)',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://www.trendyol.com/trendyol-curve/siyah-palazzo-pantolon-p-402',
    selectedSize: 'M',
  },
];

const CATEGORY_SLOTS: { category: ClothingCategory; label: string; icon: string }[] = [
  { category: 'Outerwear', label: 'Dış Giyim / Ceket', icon: '🧥' },
  { category: 'Top', label: 'Üst Giyim / Bluz', icon: '👚' },
  { category: 'Bottom', label: 'Alt Giyim / Jean / Etek', icon: '👖' },
  { category: 'Dress', label: 'Elbise / Tulum', icon: '👗' },
  { category: 'Shoes', label: 'Ayakkabı', icon: '👠' },
];

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onClearAll,
  onSaveOutfit,
  isSaving,
  onTryOnItem,
}) => {
  const [curatedItems, setCuratedItems] = useState<ClothingItem[]>(DEFAULT_CURATED_ITEMS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hoodie' | 'dress' | 'outerwear' | 'bottom'>('all');
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  // Save Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitTitle, setOutfitTitle] = useState('Hafta Sonu Şıklığı');
  const [outfitDesc, setOutfitDesc] = useState('');

  // Fetch curated items from backend API on mount
  useEffect(() => {
    let isMounted = true;
    api.getCuratedProducts()
      .then(data => {
        if (isMounted && data && data.length > 0) {
          setCuratedItems(data);
        }
      })
      .catch(() => {
        // Keeps DEFAULT_CURATED_ITEMS
      });
    return () => { isMounted = false; };
  }, []);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScraping(true);
    setScrapeError(null);

    try {
      const product = await api.scrapeProduct(urlInput.trim());
      onAddItem(product);
      setUrlInput('');
    } catch (err: any) {
      setScrapeError(err.message || 'Ürün bilgisi çekilemedi.');
    } finally {
      setIsScraping(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const getItemForCategory = (cat: ClothingCategory) => {
    return items.find(i => i.category === cat);
  };

  // Filter curated products
  const filteredCurated = curatedItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hoodie') return item.category === 'Top';
    if (activeFilter === 'dress') return item.category === 'Dress';
    if (activeFilter === 'outerwear') return item.category === 'Outerwear';
    if (activeFilter === 'bottom') return item.category === 'Bottom';
    return true;
  });

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Kombin & Gardırop Stüdyosu</h3>
            <p className="text-xs text-slate-400">10 Küratörlü Trendyol parçası veya ürün linkiyle test edin</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kombini Boşalt</span>
          </button>
        )}
      </div>

      {/* Trendyol URL Scraper Input */}
      <form onSubmit={handleScrape} className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Herhangi Bir Trendyol Ürün Linki ile Ekle
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="https://www.trendyol.com/..."
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isScraping || !urlInput.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20 shrink-0 cursor-pointer"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Çekiliyor...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </>
            )}
          </button>
        </div>
        {scrapeError && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
            {scrapeError}
          </p>
        )}
      </form>

      {/* 10 Curated Trendyol Pieces with Category Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-orange-400" />
            <span>Küratörlü Trendyol Gardırobu (10 Parça Test Seti)</span>
          </span>

          <span className="text-[11px] text-slate-400 font-normal">
            {filteredCurated.length} parça listeleniyor
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Tümü (10)' },
            { id: 'hoodie', label: 'Hoodie / Sweat (3)' },
            { id: 'dress', label: 'Elbise (3)' },
            { id: 'outerwear', label: 'Ceket / Trençkot (2)' },
            { id: 'bottom', label: 'Pantolon / Jean (2)' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Horizontal Scrollable Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          {filteredCurated.map((sample, idx) => {
            const isAdded = items.some(i => i.title === sample.title);
            return (
              <div
                key={sample.id || idx}
                className={`flex flex-col justify-between p-2.5 rounded-2xl border transition-all text-left bg-slate-950/70 group ${
                  isAdded
                    ? 'border-orange-500/70 shadow-lg shadow-orange-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-slate-900">
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {sample.detectedColor && (
                      <span
                        className="absolute bottom-1.5 left-1.5 w-3 h-3 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: sample.hexColor || '#333' }}
                        title={sample.detectedColor}
                      />
                    )}
                    {isAdded && (
                      <span className="absolute top-1.5 right-1.5 bg-orange-500 text-white p-1 rounded-full shadow-md">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <h5 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight">
                    {sample.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sample.brand}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-orange-400 font-mono">
                    {sample.price.toLocaleString('tr-TR')} TL
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => isAdded ? onRemoveItem(sample.category) : onAddItem(sample)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {isAdded ? 'Çıkar' : 'Ekle'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onTryOnItem?.(sample)}
                      className="p-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="AI Try-On'da İncele"
                    >
                      <Sparkles className="w-3 h-3 text-orange-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Outfit Slots */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 block">Kombindeki Parçalar</label>
          <span className="text-[11px] font-mono text-slate-400">{items.length} / 5 yuva dolu</span>
        </div>

        <div className="space-y-2">
          {CATEGORY_SLOTS.map(({ category, label, icon }) => {
            const currentItem = getItemForCategory(category);
            return (
              <div
                key={category}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  currentItem
                    ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                    : 'bg-slate-950/20 border-slate-800/60 border-dashed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden text-base">
                    {currentItem ? (
                      <img src={currentItem.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{icon}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
                    {currentItem ? (
                      <div>
                        <p className="text-xs font-bold text-slate-100 truncate max-w-[200px]">
                          {currentItem.title}
                        </p>
                        <p className="text-[11px] text-orange-400 font-bold font-mono">
                          {currentItem.price.toLocaleString('tr-TR')} {currentItem.currency}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Henüz parça seçilmedi</p>
                    )}
                  </div>
                </div>

                {currentItem && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTryOnItem?.(currentItem)}
                      className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="AI Try-On'da Gör"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI Try-On</span>
                    </button>
                    <a
                      href={currentItem.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded-xl transition-colors"
                      title="Trendyol'da Gör"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onRemoveItem(category)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Kombinden Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary & Save Footer */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Toplam Kombin Tutarı:</span>
          <span className="text-lg font-bold text-orange-400 font-mono">
            {totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setShowSaveModal(true)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>Kombinlerime Kaydet (.NET SQLite)</span>
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-orange-400" />
              Kombini Veritabanına Kaydet
            </h4>
            <p className="text-xs text-slate-400">
              Bu kombin ASP.NET Core Clean Architecture veritabanınıza (SQLite) kaydedilecektir.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kombin Başlığı</label>
                <input
                  type="text"
                  value={outfitTitle}
                  onChange={e => setOutfitTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Not / Açıklama (İsteğe bağlı)</label>
                <textarea
                  rows={2}
                  value={outfitDesc}
                  onChange={e => setOutfitDesc(e.target.value)}
                  placeholder="Örn: Hafta sonu buluşması için rahat kombin..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isSaving || !outfitTitle.trim()}
                onClick={async () => {
                  await onSaveOutfit(outfitTitle, outfitDesc);
                  setShowSaveModal(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
