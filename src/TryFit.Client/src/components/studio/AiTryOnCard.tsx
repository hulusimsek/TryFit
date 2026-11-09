import React, { useState } from 'react';
import { ClothingItem, ViewAngle } from '../../types';
import { api, TryOnResponse } from '../../services/api';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Download, 
  User, 
  ShieldCheck,
  CheckCircle2,
  Upload,
  RefreshCw,
  Eye,
  Camera
} from 'lucide-react';

interface AiTryOnCardProps {
  items: ClothingItem[];
  selectedItem?: ClothingItem | null;
  heightCm: number;
  weightKg: number;
}

export const AiTryOnCard: React.FC<AiTryOnCardProps> = ({
  items,
  selectedItem,
  heightCm: _heightCm,
  weightKg: _weightKg,
}) => {
  const [activeItem] = useState<ClothingItem | null>(selectedItem || items[0] || null);
  const [bodyType, setBodyType] = useState<'petite' | 'standard' | 'curve'>('standard');
  const [tryOnMode, setTryOnMode] = useState<'curated' | 'customPhoto'>('curated');
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewCompare, setViewCompare] = useState<'result' | 'garment'>('result');

  const currentItem = activeItem || selectedItem || items[0];

  // Multi-angle or fallback image getter
  const getAngleUrl = (item: ClothingItem | null, angle: ViewAngle): string => {
    if (!item) return 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80';
    if (item.multiAngles) {
      if (angle === 'angle45') return item.multiAngles.angle45;
      if (angle === 'side') return item.multiAngles.side;
      if (angle === 'back') return item.multiAngles.back;
      return item.multiAngles.front;
    }
    const t = item.title.toLowerCase();
    if (t.includes('hoodie') || t.includes('sweatshirt')) {
      return angle === 'back'
        ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
        : angle === 'side'
        ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
        : angle === 'angle45'
        ? 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80';
    }
    if (t.includes('trençkot') || t.includes('kaban') || t.includes('bej')) {
      return angle === 'side'
        ? 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80';
    }
    if (t.includes('jean') || t.includes('pantolon')) {
      return angle === 'side'
        ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80';
    }
    if (t.includes('elbise')) {
      return angle === 'back'
        ? 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';
    }
    return item.imageUrl;
  };

  const activeDisplayUrl = (result && result.resultImageUrl) || getAngleUrl(currentItem, viewAngle);

  // File upload handler for personal try-on photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel formatı (JPG, PNG) seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const b64 = evt.target?.result as string;
      setUserPhoto(b64);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunTryOn = async () => {
    if (!currentItem) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.generateTryOn({
        garmentImageUrl: currentItem.imageUrl,
        garmentTitle: currentItem.title,
        category: currentItem.category,
        modelBodyType: bodyType,
        userPhotoBase64: tryOnMode === 'customPhoto' ? (userPhoto || undefined) : undefined,
        viewAngle,
      });

      if (res.success && res.resultImageUrl) {
        setResult(res);
        setViewCompare('result');
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
    <div className="bg-gradient-to-b from-slate-900 via-[#0d1527] to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-full min-h-[550px] justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">2D Fotogerçekçi Sanal Deneme</h3>
              <p className="text-[11px] text-slate-400">Tek fotoğraftan yüksek kaliteli giydirme & çok açılı inceleme</p>
            </div>
          </div>

          {/* Mode Switcher: Hazır Önizleme vs Kendi Fotoğrafım */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setTryOnMode('curated'); setResult(null); }}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                tryOnMode === 'curated'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standart Model
            </button>
            <button
              onClick={() => { setTryOnMode('customPhoto'); setResult(null); }}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                tryOnMode === 'customPhoto'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Fotoğrafımı Yükle</span>
            </button>
          </div>
        </div>

        {/* 2.5D Angle Switcher (Ön, 45°, Yan, Arka) */}
        {tryOnMode === 'curated' && (
          <div className="flex items-center justify-between pt-3 pb-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-orange-400" />
              <span>2.5D Açı Görünümü:</span>
            </span>

            <div className="flex gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
              {(['front', 'angle45', 'side', 'back'] as ViewAngle[]).map((ang) => (
                <button
                  key={ang}
                  onClick={() => { setViewAngle(ang); setResult(null); }}
                  className={`px-2.5 py-0.5 text-[11px] rounded font-bold transition-all cursor-pointer ${
                    viewAngle === ang
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ang === 'front' ? 'Ön' : ang === 'angle45' ? '45°' : ang === 'side' ? 'Yan' : 'Arka'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom User Photo Upload Bar */}
        {tryOnMode === 'customPhoto' && (
          <div className="pt-3 pb-1">
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl">
              <label className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{userPhoto ? 'Fotoğrafı Değiştir' : 'Fotoğrafını Seç'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {userPhoto ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fotoğraf hazır!</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Nötr pozda, düz zeminli boy fotoğrafı önerilir</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Center Image Display (With Before/After Toggle & Badges) */}
      <div className="relative my-3 flex-1 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-slate-800/80 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Yapay Zeka Kıyafeti Giydiriyor...</p>
              <p className="text-xs text-slate-400">
                {tryOnMode === 'customPhoto'
                  ? 'Fotoğrafınız üzerindeki kıyafet maskelenip yeni model oturtuluyor'
                  : 'CatVTON / IDM-VTON difüzyon modeli işleniyor'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-2 group">
            <img
              src={viewCompare === 'result' ? activeDisplayUrl : currentItem?.imageUrl}
              alt="Try On"
              className="max-h-[360px] w-auto object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Before / After Floating Pill */}
            {currentItem && (
              <div className="absolute top-3 left-3 z-10 flex gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-md">
                <button
                  onClick={() => setViewCompare('result')}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                    viewCompare === 'result'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Giydirme
                </button>
                <button
                  onClick={() => setViewCompare('garment')}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                    viewCompare === 'garment'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ürün Resmi
                </button>
              </div>
            )}

            {/* Engine Tag */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>{result?.engineUsed || '0 ms Hazır Görsel'}</span>
            </div>

            {/* Download Button */}
            <a
              href={activeDisplayUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all opacity-0 group-hover:opacity-100"
              title="Görseli İndir / Büyüt"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-300 mb-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bottom Controls: Model Selector & Try-On Trigger Button */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        {/* Model Body Type Selector */}
        {tryOnMode === 'curated' && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Manken Tipi:</span>
            </span>

            <div className="flex gap-1.5">
              {[
                { id: 'standard', label: 'Standart (58 kg)' },
                { id: 'petite', label: 'Minyon (49 kg)' },
                { id: 'curve', label: 'Curve (75 kg)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setBodyType(m.id as any); setResult(null); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    bodyType === m.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex gap-2">
          <button
            onClick={handleRunTryOn}
            disabled={isLoading || !currentItem || (tryOnMode === 'customPhoto' && !userPhoto)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Yapay Zeka Giydiriyor...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>{tryOnMode === 'customPhoto' ? 'Kıyafetimi Fotoğrafımda Dene' : 'AI Giydirme Oluştur'}</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy & Zero-Cost Notice */}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Açık rıza koruması (Fotoğraflar sunucuda saklanmaz)</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">0 TL Bütçe</span>
        </div>
      </div>
    </div>
  );
};
export default AiTryOnCard;
