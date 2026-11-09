import React, { useState, useEffect } from 'react';
import { ClothingItem, ClothingCategory, Outfit } from './types';
import { api } from './services/api';
import { Header } from './components/ui/Header';
import { MannequinViewer } from './components/3d/MannequinViewer';
import { FitAdvisorCard } from './components/studio/FitAdvisorCard';
import { OutfitBuilder } from './components/studio/OutfitBuilder';
import { SavedOutfitsModal } from './components/studio/SavedOutfitsModal';
import { VirtualTryOnModal } from './components/studio/VirtualTryOnModal';
import { AiTryOnCard } from './components/studio/AiTryOnCard';
import { EditorialLookbook } from './components/studio/EditorialLookbook';
import { Sparkles, Box, CheckCircle2, SplitSquareVertical, Layers, Ruler } from 'lucide-react';

export const App: React.FC = () => {
  // Body measurements
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(58);
  const skinTone = '#f0e6dc';

  // Custom detailed measurements (Chest, Waist, Hips, Inseam)
  const [customMeasurements, setCustomMeasurements] = useState<{
    chest?: number;
    waist?: number;
    hips?: number;
    inseam?: number;
  }>({
    chest: 88,
    waist: 70,
    hips: 96,
  });

  // Navigation Tabs:
  // 'split' (3'lü Stüdyo - Yan Yana)
  // 'tryon' (Sanal Deneme - AI Try-On)
  // '3d' (3D Bedenim - Simülatör)
  // 'fit' (Beden Tavsiyesi - Kalıp Analizi)
  // 'lookbook' (Kombin Panosu)
  const [viewMode, setViewMode] = useState<'split' | 'tryon' | '3d' | 'fit' | 'lookbook'>('split');

  // Outfit items
  const [outfitItems, setOutfitItems] = useState<ClothingItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [tryOnSelectedItem, setTryOnSelectedItem] = useState<ClothingItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load saved outfits from ASP.NET Core API on mount
  useEffect(() => {
    loadSavedOutfits();
  }, []);

  const loadSavedOutfits = async () => {
    try {
      const data = await api.getOutfits();
      setSavedOutfits(data);

      if (data.length > 0 && outfitItems.length === 0) {
        setOutfitItems(data[0].items);
        setHeightCm(data[0].mannequinHeightCm || 168);
        setWeightKg(data[0].mannequinWeightKg || 58);
      }
    } catch {
      console.warn('API henüz aktif değil veya ulaşılamadı. Offline modda çalışılıyor.');
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddItem = (item: ClothingItem) => {
    setOutfitItems(prev => {
      let filtered = prev.filter(i => i.category !== item.category);
      if (item.category === 'Dress') {
        filtered = filtered.filter(i => i.category !== 'Top' && i.category !== 'Bottom');
      } else if (item.category === 'Top' || item.category === 'Bottom') {
        filtered = filtered.filter(i => i.category !== 'Dress');
      }
      return [...filtered, item];
    });
    setTryOnSelectedItem(item);
    showToast(`"${item.title}" kombine eklendi.`);
  };

  const handleRemoveItem = (category: ClothingCategory) => {
    setOutfitItems(prev => prev.filter(i => i.category !== category));
  };

  const handleClearAll = () => {
    setOutfitItems([]);
    setTryOnSelectedItem(null);
    showToast('Tüm kıyafetler çıkarıldı.');
  };

  const handleSaveOutfit = async (title: string, desc: string) => {
    if (outfitItems.length === 0) return;

    setIsSaving(true);
    try {
      const saved = await api.saveOutfit({
        title,
        description: desc,
        mannequinHeightCm: heightCm,
        mannequinWeightKg: weightKg,
        items: outfitItems,
      });

      setSavedOutfits(prev => [saved, ...prev]);
      showToast(`"${title}" başarıyla kaydedildi!`);
    } catch {
      const localOutfit: Outfit = {
        id: Math.random().toString(),
        title,
        description: desc,
        totalPrice: outfitItems.reduce((s, i) => s + i.price, 0),
        mannequinHeightCm: heightCm,
        mannequinWeightKg: weightKg,
        createdAt: new Date().toISOString(),
        items: [...outfitItems],
      };
      setSavedOutfits(prev => [localOutfit, ...prev]);
      showToast(`"${title}" kaydedildi (Yerel).`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadOutfit = (outfit: Outfit) => {
    setOutfitItems(outfit.items);
    setHeightCm(outfit.mannequinHeightCm || 168);
    setWeightKg(outfit.mannequinWeightKg || 58);
    setTryOnSelectedItem(outfit.items[0] || null);
    showToast(`"${outfit.title}" yüklendi.`);
  };

  const handleDeleteOutfit = async (id: string) => {
    try {
      await api.deleteOutfit(id);
    } catch {
      // ignore
    }
    setSavedOutfits(prev => prev.filter(o => o.id !== id));
    showToast('Kombin silindi.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        savedCount={savedOutfits.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenTryOnModal={() => {
          setTryOnSelectedItem(outfitItems[0] || null);
          setIsTryOnModalOpen(true);
        }}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-orange-500/50 text-orange-300 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col space-y-6">
        {/* Navigation Tab Switcher (3 Ana Deneyim + Birleşik Stüdyo) */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-slate-300 px-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Deneyim Modu:</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {/* Tab 1: Yan Yana Stüdyo */}
            <button
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>3'lü Stüdyo (Tümünü Gör)</span>
            </button>

            {/* Tab 2: Sanal Deneme (2D AI Try-On) */}
            <button
              onClick={() => setViewMode('tryon')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tryon'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Sanal Deneme (AI Try-On)</span>
            </button>

            {/* Tab 3: 3D Bedenim (Simülatör) */}
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>2. 3D Bedenim (Simülatör)</span>
            </button>

            {/* Tab 4: Beden Tavsiyesi (Kalıp Analizi) */}
            <button
              onClick={() => setViewMode('fit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'fit'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>3. Beden Tavsiyesi (Kalıp Analizi)</span>
            </button>

            {/* Tab 5: Kombin Panosu */}
            <button
              onClick={() => setViewMode('lookbook')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'lookbook'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kombin Panosu</span>
            </button>
          </div>
        </div>

        {/* 1. SPLIT MODE: Sol 3D Manken | Sağ AI Fotogerçekçi Try-On | Alt: Beden Analizi + Gardırop */}
        {viewMode === 'split' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Sol: 3D Beden Simülatörü */}
              <div className="h-[600px] w-full">
                <MannequinViewer
                  heightCm={heightCm}
                  weightKg={weightKg}
                  outfitItems={outfitItems}
                  skinTone={skinTone}
                  customMeasurements={customMeasurements}
                />
              </div>

              {/* Sağ: 2D AI Fotogerçekçi Try-On */}
              <div className="h-[600px] w-full">
                <AiTryOnCard
                  items={outfitItems}
                  selectedItem={tryOnSelectedItem}
                  heightCm={heightCm}
                  weightKg={weightKg}
                />
              </div>
            </div>

            {/* Alt Sıra: Beden & Kalıp Analizi + 10 Parçalı Küratörlü Gardırop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <FitAdvisorCard
                  heightCm={heightCm}
                  weightKg={weightKg}
                  onHeightChange={setHeightCm}
                  onWeightChange={setWeightKg}
                  items={outfitItems}
                  customMeasurements={customMeasurements}
                  onCustomMeasurementsChange={setCustomMeasurements}
                />
              </div>
              <div className="lg:col-span-7">
                <OutfitBuilder
                  items={outfitItems}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onClearAll={handleClearAll}
                  onSaveOutfit={handleSaveOutfit}
                  isSaving={isSaving}
                  onTryOnItem={(item) => {
                    setTryOnSelectedItem(item);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SANAL DENEME (2D AI VIRTUAL TRY-ON) */}
        {viewMode === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="h-[650px] w-full">
                <AiTryOnCard
                  items={outfitItems}
                  selectedItem={tryOnSelectedItem}
                  heightCm={heightCm}
                  weightKg={weightKg}
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <FitAdvisorCard
                heightCm={heightCm}
                weightKg={weightKg}
                onHeightChange={setHeightCm}
                onWeightChange={setWeightKg}
                items={outfitItems}
                customMeasurements={customMeasurements}
                onCustomMeasurementsChange={setCustomMeasurements}
              />
              <OutfitBuilder
                items={outfitItems}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onSaveOutfit={handleSaveOutfit}
                isSaving={isSaving}
                onTryOnItem={(item) => {
                  setTryOnSelectedItem(item);
                }}
              />
            </div>
          </div>
        )}

        {/* 3. 3D BEDENİM (SİMÜLATÖR) */}
        {viewMode === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="h-[620px] w-full">
                <MannequinViewer
                  heightCm={heightCm}
                  weightKg={weightKg}
                  outfitItems={outfitItems}
                  skinTone={skinTone}
                  customMeasurements={customMeasurements}
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <FitAdvisorCard
                heightCm={heightCm}
                weightKg={weightKg}
                onHeightChange={setHeightCm}
                onWeightChange={setWeightKg}
                items={outfitItems}
                customMeasurements={customMeasurements}
                onCustomMeasurementsChange={setCustomMeasurements}
              />
              <OutfitBuilder
                items={outfitItems}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onSaveOutfit={handleSaveOutfit}
                isSaving={isSaving}
                onTryOnItem={(item) => {
                  setTryOnSelectedItem(item);
                }}
              />
            </div>
          </div>
        )}

        {/* 4. BEDEN TAVSİYESİ (KALIP ANALİZİ) */}
        {viewMode === 'fit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <FitAdvisorCard
                heightCm={heightCm}
                weightKg={weightKg}
                onHeightChange={setHeightCm}
                onWeightChange={setWeightKg}
                items={outfitItems}
                customMeasurements={customMeasurements}
                onCustomMeasurementsChange={setCustomMeasurements}
              />
            </div>
            <div className="lg:col-span-5">
              <OutfitBuilder
                items={outfitItems}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onSaveOutfit={handleSaveOutfit}
                isSaving={isSaving}
                onTryOnItem={(item) => {
                  setTryOnSelectedItem(item);
                }}
              />
            </div>
          </div>
        )}

        {/* 5. LOOKBOOK PANOSU */}
        {viewMode === 'lookbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <EditorialLookbook
                items={outfitItems}
                onRemoveItem={handleRemoveItem}
                onSaveOutfit={() => {}}
              />
            </div>
            <div className="lg:col-span-5">
              <OutfitBuilder
                items={outfitItems}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onSaveOutfit={handleSaveOutfit}
                isSaving={isSaving}
                onTryOnItem={(item) => {
                  setTryOnSelectedItem(item);
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        selectedItem={tryOnSelectedItem}
        allItems={outfitItems}
      />

      {/* Saved Outfits Modal */}
      <SavedOutfitsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        outfits={savedOutfits}
        onLoadOutfit={handleLoadOutfit}
        onDeleteOutfit={handleDeleteOutfit}
      />
    </div>
  );
};
export default App;
