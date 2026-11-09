import React, { useEffect, useState } from 'react';
import { ClothingItem, FitAnalysisResult, SizeChartEntry } from '../../types';
import { api } from '../../services/api';
import { 
  Ruler, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  HelpCircle,
  Tag
} from 'lucide-react';

interface FitAdvisorCardProps {
  heightCm: number;
  weightKg: number;
  onHeightChange: (val: number) => void;
  onWeightChange: (val: number) => void;
  items: ClothingItem[];
  customMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    inseam?: number;
  };
  onCustomMeasurementsChange?: (measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    inseam?: number;
  }) => void;
}

export const FitAdvisorCard: React.FC<FitAdvisorCardProps> = ({
  heightCm,
  weightKg,
  onHeightChange,
  onWeightChange,
  items,
  customMeasurements,
  onCustomMeasurementsChange,
}) => {
  const [analysis, setAnalysis] = useState<FitAnalysisResult | null>(null);
  const [showDetailedInputs, setShowDetailedInputs] = useState(false);
  const [selectedGarmentIdx, setSelectedGarmentIdx] = useState(0);

  // Custom measurement states
  const [customChest, setCustomChest] = useState<number | undefined>(customMeasurements?.chest);
  const [customWaist, setCustomWaist] = useState<number | undefined>(customMeasurements?.waist);
  const [customHips, setCustomHips] = useState<number | undefined>(customMeasurements?.hips);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      try {
        const res = await api.analyzeFit(heightCm, weightKg, items, {
          chest: customChest,
          waist: customWaist,
          hips: customHips,
        });
        if (isMounted) setAnalysis(res);
      } catch {
        // Fallback calculation in client
        if (isMounted) {
          const hM = heightCm / 100;
          const bmi = +(weightKg / (hM * hM)).toFixed(1);
          const estChest = customChest || Math.round(heightCm * 0.52 + (weightKg - 50) * 0.7);
          const estWaist = customWaist || Math.round(heightCm * 0.40 + (weightKg - 50) * 0.6);
          const estHips = customHips || Math.round(heightCm * 0.56 + (weightKg - 50) * 0.8);

          setAnalysis({
            userHeightCm: heightCm,
            userWeightKg: weightKg,
            userChestCm: estChest,
            userWaistCm: estWaist,
            userHipsCm: estHips,
            userInseamCm: Math.round(heightCm * 0.46),
            bmi,
            bmiCategory: bmi < 19 ? 'Zayıf / Minyon' : bmi < 25 ? 'İdeal / Fit' : bmi < 30 ? 'Hafif Kıvrımlı' : 'Curve',
            harmonyScore: 94,
            paletteName: 'Doğal & Toprak Tonları',
            overallStylingAdvice: `${heightCm} cm boy ve ${weightKg} kg için ölçüleriniz analiz edildi. Kumaş toleranslarına göre beden önerisi hazırlanmıştır.`,
            itemFits: items.map(i => ({
              title: i.title,
              category: i.category,
              recommendedSize: bmi < 22 ? 'S (36)' : 'M (38)',
              lengthAnalysis: `${heightCm} cm boyunuza göre dengeli durur.`,
              fitAdvice: 'Rahat ve modern kalıp.',
              silhouetteNote: 'Orantılı silüet.'
            })),
            detailedReports: items.map(i => ({
              garmentTitle: i.title,
              category: i.category.toString(),
              recommendedSize: bmi < 22 ? 'S (36)' : 'M (38)',
              fabricElasticity: i.fabricElasticity || 'Tok Dokuma',
              primaryFitAdvice: `Göğüs ölçünüz ${estChest} cm; M bedende daha konforlu hareket payı elde edersiniz.`,
              lengthMarker: 'Diz Kapağı Hizasında',
              estimatedLengthFromShoulderCm: 85,
              sizeMatrix: [
                { size: 'XS (34)', chestCm: 84, waistCm: 64, hipsCm: 90, lengthCm: 80, diffChest: 84 - estChest, diffWaist: 64 - estWaist, diffHips: 90 - estHips, fitStatus: 'tight', fitNote: 'Dar' },
                { size: 'S (36)',  chestCm: 88, waistCm: 68, hipsCm: 94, lengthCm: 82, diffChest: 88 - estChest, diffWaist: 68 - estWaist, diffHips: 94 - estHips, fitStatus: 'snug', fitNote: 'Tam Oturan' },
                { size: 'M (38)',  chestCm: 94, waistCm: 74, hipsCm: 100, lengthCm: 84, diffChest: 94 - estChest, diffWaist: 74 - estWaist, diffHips: 100 - estHips, fitStatus: 'ideal', fitNote: 'İdeal Rahatlık' },
                { size: 'L (40)',  chestCm: 100, waistCm: 80, hipsCm: 106, lengthCm: 86, diffChest: 100 - estChest, diffWaist: 80 - estWaist, diffHips: 106 - estHips, fitStatus: 'oversize', fitNote: 'Bol / Dökümlü' },
              ]
            }))
          });
        }
      }
    };

    fetchAnalysis();
    return () => { isMounted = false; };
  }, [heightCm, weightKg, items, customChest, customWaist, customHips]);

  const handleUpdateCustom = (type: 'chest' | 'waist' | 'hips', val: number) => {
    if (type === 'chest') {
      setCustomChest(val);
      onCustomMeasurementsChange?.({ chest: val, waist: customWaist, hips: customHips });
    } else if (type === 'waist') {
      setCustomWaist(val);
      onCustomMeasurementsChange?.({ chest: customChest, waist: val, hips: customHips });
    } else if (type === 'hips') {
      setCustomHips(val);
      onCustomMeasurementsChange?.({ chest: customChest, waist: customWaist, hips: val });
    }
  };

  const presets = [
    { name: 'Minyon / Petite', h: 158, w: 49 },
    { name: 'Standart / Fit', h: 168, w: 57 },
    { name: 'Kıvrımlı / Curve', h: 165, w: 74 },
    { name: 'Uzun Boylu', h: 178, w: 64 },
  ];

  const activeReport = analysis?.detailedReports?.[selectedGarmentIdx] || analysis?.detailedReports?.[0];

  const getDeltaBadge = (diff: number) => {
    const formatted = diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0);
    if (diff < -2) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {formatted} cm (Dar)
        </span>
      );
    } else if (diff <= 2) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {formatted} cm (Tam)
        </span>
      );
    } else if (diff <= 8) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {formatted} cm (İdeal)
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
        {formatted} cm (Oversize)
      </span>
    );
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Title & Harmony Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Beden & Kalıp Analiz Danışmanı</h3>
            <p className="text-xs text-slate-400">Ürün beden tablosu ile vücut ölçülerinizi santimetre bazında karşılaştırın</p>
          </div>
        </div>

        {analysis && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-orange-400">
            <Tag className="w-3.5 h-3.5" />
            <span>BMI: {analysis.bmi} ({analysis.bmiCategory})</span>
          </div>
        )}
      </div>

      {/* Preset Buttons */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-2 block">Hızlı Beden Şablonları</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                onHeightChange(p.h);
                onWeightChange(p.w);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                heightCm === p.h && weightKg === p.w
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{p.name}</div>
              <div className="text-[11px] text-slate-400">{p.h} cm • {p.w} kg</div>
            </button>
          ))}
        </div>
      </div>

      {/* Height & Weight Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-400">Boyunuz</span>
            <span className="font-bold text-orange-400 font-mono text-sm">{heightCm} cm</span>
          </div>
          <input
            type="range"
            min={145}
            max={200}
            value={heightCm}
            onChange={e => onHeightChange(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-400">Kilonuz</span>
            <span className="font-bold text-orange-400 font-mono text-sm">{weightKg} kg</span>
          </div>
          <input
            type="range"
            min={40}
            max={120}
            value={weightKg}
            onChange={e => onWeightChange(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Expandable Custom Measurements Section */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowDetailedInputs(!showDetailedInputs)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Detaylı Vücut Ölçülerim (Santimetre Girişi)</span>
          </span>
          {showDetailedInputs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetailedInputs && (
          <div className="p-4 pt-1 border-t border-slate-800/80 grid grid-cols-3 gap-3 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Göğüs Çevresi</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customChest ?? analysis?.userChestCm ?? 88}
                  onChange={e => handleUpdateCustom('chest', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">cm</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Bel Çevresi</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customWaist ?? analysis?.userWaistCm ?? 70}
                  onChange={e => handleUpdateCustom('waist', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">cm</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Kalça Çevresi</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customHips ?? analysis?.userHipsCm ?? 96}
                  onChange={e => handleUpdateCustom('hips', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">cm</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Garment Selector Tabs if multiple items */}
      {items.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGarmentIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedGarmentIdx === idx
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {item.title.length > 20 ? item.title.slice(0, 20) + '...' : item.title}
            </button>
          ))}
        </div>
      )}

      {/* Size Chart Delta Matrix Table */}
      {activeReport && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeReport.garmentTitle}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kumaş: <span className="text-amber-300 font-semibold">{activeReport.fabricElasticity}</span> • Boy Hizasında: <span className="text-sky-300 font-semibold">{activeReport.lengthMarker}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Önerilen Beden</span>
              <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg inline-block">
                {activeReport.recommendedSize}
              </span>
            </div>
          </div>

          {/* Sizing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="py-2 font-semibold">Beden</th>
                  <th className="py-2 font-semibold">Göğüs (cm)</th>
                  <th className="py-2 font-semibold">Bel (cm)</th>
                  <th className="py-2 font-semibold">Kalça (cm)</th>
                  <th className="py-2 font-semibold">Bolluk Farkı</th>
                  <th className="py-2 font-semibold">Uyum Değerlendirmesi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {activeReport.sizeMatrix.map((spec: SizeChartEntry) => {
                  const isRec = spec.size.includes(activeReport.recommendedSize) || activeReport.recommendedSize.includes(spec.size);
                  return (
                    <tr
                      key={spec.size}
                      className={`transition-colors ${
                        isRec ? 'bg-orange-500/10 font-bold' : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-2.5 font-mono text-white flex items-center gap-1.5">
                        {spec.size}
                        {isRec && <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-sans font-bold">Öneri</span>}
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {spec.chestCm > 0 ? `${spec.chestCm} cm` : '-'}
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {spec.waistCm > 0 ? `${spec.waistCm} cm` : '-'}
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {spec.hipsCm > 0 ? `${spec.hipsCm} cm` : '-'}
                      </td>
                      <td className="py-2.5">
                        {getDeltaBadge(spec.diffChest !== 0 ? spec.diffChest : spec.diffWaist)}
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {spec.fitNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Primary Fit Advice Box */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeReport.primaryFitAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default FitAdvisorCard;
