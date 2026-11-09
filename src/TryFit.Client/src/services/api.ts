import { ClothingItem, Outfit, BodyMetrics, FitAnalysisResult, ViewAngle } from '../types';

const API_BASE = '/api';

export interface TryOnRequest {
  garmentImageUrl: string;
  garmentTitle: string;
  category: string;
  modelBodyType: 'petite' | 'standard' | 'curve';
  userPhotoBase64?: string;
  viewAngle?: ViewAngle;
}

export interface TryOnResponse {
  success: boolean;
  resultImageUrl?: string;
  errorMessage?: string;
  durationMs: number;
  engineUsed?: string;
  viewAngle?: string;
}

export const api = {
  async getCuratedProducts(): Promise<ClothingItem[]> {
    const res = await fetch(`${API_BASE}/products/curated`);
    if (!res.ok) throw new Error('Küratörlü ürünler alınamadı.');
    return res.json();
  },

  async scrapeProduct(url: string): Promise<ClothingItem> {
    const res = await fetch(`${API_BASE}/products/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Ürün bilgisi alınamadı.');
    }
    return res.json();
  },

  async getOutfits(): Promise<Outfit[]> {
    const res = await fetch(`${API_BASE}/outfits`);
    if (!res.ok) throw new Error('Kombinler yüklenemedi.');
    return res.json();
  },

  async saveOutfit(data: {
    title: string;
    description?: string;
    mannequinHeightCm: number;
    mannequinWeightKg: number;
    items: ClothingItem[];
  }): Promise<Outfit> {
    const res = await fetch(`${API_BASE}/outfits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Kombin kaydedilemedi.');
    return res.json();
  },

  async deleteOutfit(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/outfits/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Kombin silinemedi.');
  },

  async calculateMetrics(height: number, weight: number): Promise<BodyMetrics> {
    const res = await fetch(`${API_BASE}/bodyprofile/calculate?height=${height}&weight=${weight}`);
    if (!res.ok) throw new Error('Ölçü hesaplanamadı.');
    return res.json();
  },

  async analyzeFit(
    height: number, 
    weight: number, 
    items: ClothingItem[],
    customMeasurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      inseam?: number;
    }
  ): Promise<FitAnalysisResult> {
    const res = await fetch(`${API_BASE}/fit/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        heightCm: height,
        weightKg: weight,
        customChestCm: customMeasurements?.chest,
        customWaistCm: customMeasurements?.waist,
        customHipsCm: customMeasurements?.hips,
        customInseamCm: customMeasurements?.inseam,
        items: items.map(i => ({
          title: i.title,
          brand: i.brand,
          price: i.price,
          currency: i.currency,
          imageUrl: i.imageUrl,
          productUrl: i.productUrl,
          category: i.category,
        })),
      }),
    });
    if (!res.ok) throw new Error('Kalıp analizi yapılamadı.');
    return res.json();
  },

  async generateTryOn(data: TryOnRequest): Promise<TryOnResponse> {
    const res = await fetch(`${API_BASE}/tryon/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Yapay zeka deneme servisine ulaşılamadı.');
    }
    return res.json();
  },
};
