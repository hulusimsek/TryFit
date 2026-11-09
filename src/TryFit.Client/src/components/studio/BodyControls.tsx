import React from 'react';
import { Activity, Sliders, Palette } from 'lucide-react';

interface BodyControlsProps {
  heightCm: number;
  weightKg: number;
  onHeightChange: (val: number) => void;
  onWeightChange: (val: number) => void;
  skinTone: string;
  onSkinToneChange: (val: string) => void;
}

export const BodyControls: React.FC<BodyControlsProps> = ({
  heightCm,
  weightKg,
  onHeightChange,
  onWeightChange,
  skinTone,
  onSkinToneChange,
}) => {
  // BMI calculation
  const heightInMeters = heightCm / 100;
  const bmi = +(weightKg / (heightInMeters * heightInMeters)).toFixed(1);

  const getBmiBadge = (val: number) => {
    if (val < 18.5) return { label: 'Zayıf', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (val < 24.9) return { label: 'İdeal / Fit', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (val < 29.9) return { label: 'Hafif Kıvrımlı', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'Curve / Büyük Beden', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
  };

  const bmiInfo = getBmiBadge(bmi);

  const presets = [
    { name: 'Standart Manken', h: 176, w: 56 },
    { name: 'Minyon / Petite', h: 158, w: 50 },
    { name: 'Kıvrımlı / Curve', h: 165, w: 75 },
    { name: 'Sportif / Atletik', h: 172, w: 63 },
  ];

  const skinTones = [
    { name: 'Porselen', color: '#f5e2d5' },
    { name: 'Buğday', color: '#e5be9e' },
    { name: 'Sıcak Kum', color: '#cf9b7a' },
    { name: 'Koyu Ten', color: '#8d5536' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Beden & Manken Ölçüleri</h3>
            <p className="text-xs text-slate-400">3D mankeni kendi ölçülerinize göre şekillendirin</p>
          </div>
        </div>

        {/* BMI Badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${bmiInfo.color}`}>
          <Activity className="w-3 h-3" />
          <span>VKİ: {bmi} ({bmiInfo.label})</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-2 block">Hızlı Beden Şablonları</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                onHeightChange(p.h);
                onWeightChange(p.w);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                heightCm === p.h && weightKg === p.w
                  ? 'bg-orange-500/15 border-orange-500 text-orange-300'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-[11px] text-slate-400">{p.h} cm • {p.w} kg</div>
            </button>
          ))}
        </div>
      </div>

      {/* Height Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Boy (cm)</span>
          <span className="text-orange-400 font-bold font-mono text-sm">{heightCm} cm</span>
        </div>
        <input
          type="range"
          min="145"
          max="195"
          step="1"
          value={heightCm}
          onChange={e => onHeightChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>145 cm</span>
          <span>170 cm</span>
          <span>195 cm</span>
        </div>
      </div>

      {/* Weight Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Kilo (kg)</span>
          <span className="text-orange-400 font-bold font-mono text-sm">{weightKg} kg</span>
        </div>
        <input
          type="range"
          min="40"
          max="115"
          step="1"
          value={weightKg}
          onChange={e => onWeightChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>40 kg</span>
          <span>70 kg</span>
          <span>115 kg</span>
        </div>
      </div>

      {/* Skin Tone Selector */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            Manken Ten Tonu
          </span>
        </div>
        <div className="flex gap-2.5">
          {skinTones.map(t => (
            <button
              key={t.name}
              type="button"
              onClick={() => onSkinToneChange(t.color)}
              title={t.name}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                skinTone === t.color ? 'scale-115 border-orange-500 shadow-md ring-2 ring-orange-500/30' : 'border-slate-700 hover:scale-105'
              }`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
