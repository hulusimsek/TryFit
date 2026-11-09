import * as THREE from 'three';
import { ClothingCategory, GarmentSubType, GarmentSize, ZoneFitResult } from '../types';

/**
 * Procedural PBR fabric texture generators for high-fashion 3D garments.
 * Eliminates the flat 'plastic' look and provides authentic tactile fabric finishes.
 */

// 1. Denim Weave Texture (Authentic twill pattern)
export function createDenimTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2a4468';
  ctx.fillRect(0, 0, 128, 128);

  // Diagonal twill weave
  ctx.strokeStyle = '#3d5c87';
  ctx.lineWidth = 1.5;
  for (let i = -128; i < 256; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 128, 128);
    ctx.stroke();
  }

  // Cross subtle grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let x = 0; x < 128; x += 4) {
    for (let y = 0; y < 128; y += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 16);
  return texture;
}

// 2. Ribbed Knit Texture (Fine vertical ridges for tops & sweaters)
export function createKnitRibTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, 64, 64);

  // Vertical knit ribs
  for (let x = 0; x < 64; x += 6) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(x, 0, 3, 64);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(x + 3, 0, 3, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

// 3. Fleece / Hoodie Heavy Cotton Texture (Soft brushed matte finish)
export function createFleeceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#202020';
  ctx.fillRect(0, 0, 128, 128);

  // Organic fleece micro-fibers
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const r = Math.random() * 2 + 0.8;
    const alpha = Math.random() * 0.12 + 0.03;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// 4. Trench Coat / Gabardine Weave
export function createCoatTwillTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#bfa58a';
  ctx.fillRect(0, 0, 64, 64);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  for (let i = -64; i < 128; i += 3) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 64, 64);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return texture;
}

// 5. Garment SubType Classifier (Hoodie, T-Shirt, Coat, Jeans, Skirt, Dress, Shoes)
export function resolveGarmentSubType(title: string, category: ClothingCategory): GarmentSubType {
  const t = title.toLowerCase();
  if (t.includes('hoodie') || t.includes('kapüşon') || t.includes('kapuson') || t.includes('sweatshirt')) {
    return 'hoodie';
  }
  if (t.includes('trençkot') || t.includes('trench') || t.includes('kaban') || t.includes('palto') || t.includes('parka')) {
    return 'coat';
  }
  if (t.includes('ceket') || t.includes('blazer') || t.includes('hırka') || t.includes('mont') || t.includes('bomber')) {
    return 'jacket';
  }
  if (t.includes('etek') || t.includes('skirt') || t.includes('mini etek') || t.includes('pileli')) {
    return 'skirt';
  }
  if (t.includes('jean') || t.includes('kot') || t.includes('pantolon') || t.includes('tayt') || t.includes('jogger')) {
    return 'jeans';
  }
  if (t.includes('elbise') || t.includes('dress') || t.includes('tulum')) {
    return 'dress';
  }
  if (t.includes('ayakkabı') || t.includes('bot') || t.includes('sneaker') || t.includes('topuklu') || t.includes('çizme')) {
    return 'shoes';
  }

  // Fallbacks by category
  if (category === 'Outerwear') return 'coat';
  if (category === 'Bottom') return 'jeans';
  if (category === 'Dress') return 'dress';
  if (category === 'Shoes') return 'shoes';
  return 'tshirt';
}

// 6. Smart Garment Color Resolver (Prioritizes explicit colors & filters out skin tones)
export function resolveGarmentColor(
  title: string, 
  category: string, 
  customColor?: string, 
  hexColor?: string
): { color: string; roughness: number; metalness: number } {
  if (customColor) {
    return { color: customColor, roughness: 0.8, metalness: 0.05 };
  }
  if (hexColor && hexColor !== '#262626') {
    return { color: hexColor, roughness: 0.8, metalness: 0.05 };
  }

  const t = title.toLowerCase();

  // Color keywords in Turkish
  if (t.includes('siyah') || t.includes('black') || t.includes('antrasit')) {
    return { color: '#161616', roughness: 0.85, metalness: 0.05 };
  }
  if (t.includes('beyaz') || t.includes('white') || t.includes('krem') || t.includes('ekru')) {
    return { color: '#f5f5f5', roughness: 0.75, metalness: 0.05 };
  }
  if (t.includes('bej') || t.includes('camel') || t.includes('trençkot') || t.includes('kahve') || t.includes('vizon') || t.includes('taş')) {
    return { color: '#bfa07e', roughness: 0.70, metalness: 0.08 };
  }
  if (t.includes('lacivert') || t.includes('indigo') || t.includes('navy')) {
    return { color: '#1c2b48', roughness: 0.80, metalness: 0.05 };
  }
  if (t.includes('mavi') || t.includes('jean') || t.includes('denim')) {
    return { color: '#27456b', roughness: 0.82, metalness: 0.04 };
  }
  if (t.includes('kırmızı') || t.includes('bordo') || t.includes('red') || t.includes('vişne')) {
    return { color: '#9e1b24', roughness: 0.65, metalness: 0.12 };
  }
  if (t.includes('yeşil') || t.includes('haki') || t.includes('olive') || t.includes('zeytin')) {
    return { color: '#385e38', roughness: 0.75, metalness: 0.08 };
  }
  if (t.includes('pembe') || t.includes('pudra') || t.includes('rose')) {
    return { color: '#d89ba9', roughness: 0.70, metalness: 0.06 };
  }
  if (t.includes('gri') || t.includes('melanj') || t.includes('füme')) {
    return { color: '#64748b', roughness: 0.80, metalness: 0.05 };
  }

  // Category defaults
  if (category === 'Outerwear') return { color: '#bfa07e', roughness: 0.72, metalness: 0.08 };
  if (category === 'Bottom') return { color: '#28466e', roughness: 0.85, metalness: 0.04 };
  if (category === 'Top') return { color: '#1a1a1a', roughness: 0.85, metalness: 0.04 };
  if (category === 'Dress') return { color: '#9e1b24', roughness: 0.60, metalness: 0.15 };
  if (category === 'Shoes') return { color: '#f1f5f9', roughness: 0.45, metalness: 0.15 };

  return { color: '#262626', roughness: 0.80, metalness: 0.05 };
}

// 7. Anthropometric Body Measurements Estimation
export function calculateBodyEstimations(heightCm: number, weightKg: number) {
  const chestCm = Math.round(weightKg * 0.66 + heightCm * 0.28 + 1);
  const waistCm = Math.round(weightKg * 0.58 + heightCm * 0.20 - 2);
  const hipsCm = Math.round(weightKg * 0.78 + heightCm * 0.29 + 1);
  const shoulderCm = Math.round(34 + (heightCm - 150) * 0.12 + (weightKg - 50) * 0.08);

  return { chestCm, waistCm, hipsCm, shoulderCm };
}

// 8. Dynamic Fit Heatmap Engine (Compares Garment Size Dimensions vs User Body)
export function calculateFitHeatmap(
  heightCm: number,
  weightKg: number,
  subType: GarmentSubType,
  size: GarmentSize = 'M'
): ZoneFitResult[] {
  const user = calculateBodyEstimations(heightCm, weightKg);
  const results: ZoneFitResult[] = [];

  // Garment measurement charts per subType and size
  const sizeMultipliers: Record<GarmentSize, number> = {
    XS: -6,
    S: -3,
    M: 0,
    L: +4,
    XL: +8,
  };
  const offset = sizeMultipliers[size];

  if (subType === 'hoodie') {
    const garmentChest = 108 + offset;
    const diffChest = garmentChest - user.chestCm;
    results.push(evaluateZone('chest', 'Göğüs / Omuz', user.chestCm, garmentChest, diffChest, 8, 20));

    const garmentWaist = 104 + offset;
    const diffWaist = garmentWaist - user.waistCm;
    results.push(evaluateZone('waist', 'Bel Bölgesi', user.waistCm, garmentWaist, diffWaist, 10, 24));

    const garmentLength = 68 + Math.round(offset * 0.5);
    results.push(evaluateLength('Boy Duruşu', heightCm, garmentLength, 'Kalçayı 10 cm örten dökümlü boy'));
  } else if (subType === 'tshirt') {
    const garmentChest = 96 + offset;
    const diffChest = garmentChest - user.chestCm;
    results.push(evaluateZone('chest', 'Göğüs / Gövde', user.chestCm, garmentChest, diffChest, 3, 10));

    const garmentWaist = 90 + offset;
    const diffWaist = garmentWaist - user.waistCm;
    results.push(evaluateZone('waist', 'Bel', user.waistCm, garmentWaist, diffWaist, 4, 12));

    const garmentLength = 62 + Math.round(offset * 0.5);
    results.push(evaluateLength('Boy Duruşu', heightCm, garmentLength, 'Kemer hizasının 4 cm altında'));
  } else if (subType === 'coat' || subType === 'jacket') {
    const garmentChest = 110 + offset;
    const diffChest = garmentChest - user.chestCm;
    results.push(evaluateZone('chest', 'Göğüs / Kaban Kapama', user.chestCm, garmentChest, diffChest, 10, 22));

    const garmentWaist = 106 + offset;
    const diffWaist = garmentWaist - user.waistCm;
    results.push(evaluateZone('waist', 'Bel Kuşağı', user.waistCm, garmentWaist, diffWaist, 8, 20));

    const garmentLength = 108 + Math.round(offset * 0.5);
    results.push(evaluateLength('Etek Boyu', heightCm, garmentLength, 'Diz kapağının tam hizasında'));
  } else if (subType === 'jeans' || subType === 'skirt') {
    const garmentWaist = 70 + offset;
    const diffWaist = garmentWaist - user.waistCm;
    results.push(evaluateZone('waist', 'Bel Kemeri', user.waistCm, garmentWaist, diffWaist, 0, 5));

    const garmentHips = 96 + offset;
    const diffHips = garmentHips - user.hipsCm;
    results.push(evaluateZone('hips', 'Basen / Kalça', user.hipsCm, garmentHips, diffHips, 0, 6));

    const garmentInseam = 100 + Math.round(offset * 0.4);
    results.push(evaluateLength('Paça Boyu', heightCm, garmentInseam, 'Bileğin hemen üzerinde modern bitiş'));
  } else {
    // Default Dress
    const garmentChest = 94 + offset;
    const diffChest = garmentChest - user.chestCm;
    results.push(evaluateZone('chest', 'Göğüs', user.chestCm, garmentChest, diffChest, 2, 8));

    const garmentWaist = 72 + offset;
    const diffWaist = garmentWaist - user.waistCm;
    results.push(evaluateZone('waist', 'Bel', user.waistCm, garmentWaist, diffWaist, 2, 8));

    const garmentHips = 100 + offset;
    const diffHips = garmentHips - user.hipsCm;
    results.push(evaluateZone('hips', 'Basen', user.hipsCm, garmentHips, diffHips, 4, 12));
  }

  return results;
}

function evaluateZone(
  zone: 'chest' | 'waist' | 'hips' | 'length',
  zoneLabel: string,
  userCm: number,
  garmentCm: number,
  diffCm: number,
  idealMin: number,
  idealMax: number
): ZoneFitResult {
  if (diffCm < -2) {
    return {
      zone,
      zoneLabel,
      userCm,
      garmentCm,
      diffCm,
      status: 'tight',
      statusText: 'Sıkı / Kasabilir',
      colorHex: '#ef4444', // Red
    };
  } else if (diffCm <= idealMin) {
    return {
      zone,
      zoneLabel,
      userCm,
      garmentCm,
      diffCm,
      status: 'snug',
      statusText: 'Vücuda Tam Oturan',
      colorHex: '#eab308', // Amber/Yellow
    };
  } else if (diffCm <= idealMax) {
    return {
      zone,
      zoneLabel,
      userCm,
      garmentCm,
      diffCm,
      status: 'ideal',
      statusText: 'İdeal / Konforlu Uyum',
      colorHex: '#22c55e', // Green
    };
  } else {
    return {
      zone,
      zoneLabel,
      userCm,
      garmentCm,
      diffCm,
      status: 'oversize',
      statusText: 'Dökümlü Oversize',
      colorHex: '#06b6d4', // Cyan
    };
  }
}

function evaluateLength(
  zoneLabel: string,
  heightCm: number,
  garmentLength: number,
  description: string
): ZoneFitResult {
  return {
    zone: 'length',
    zoneLabel,
    userCm: heightCm,
    garmentCm: garmentLength,
    diffCm: garmentLength,
    status: 'ideal',
    statusText: description,
    colorHex: '#22c55e',
  };
}
