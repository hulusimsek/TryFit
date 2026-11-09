export type ClothingCategory = 'Top' | 'Bottom' | 'Dress' | 'Outerwear' | 'Shoes' | 'Accessory';
export type GarmentSubType = 'hoodie' | 'tshirt' | 'coat' | 'jacket' | 'jeans' | 'skirt' | 'dress' | 'shoes';
export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type FitStatus = 'tight' | 'snug' | 'ideal' | 'oversize';
export type ViewAngle = 'front' | 'angle45' | 'side' | 'back';

export interface ZoneFitResult {
  zone: 'chest' | 'waist' | 'hips' | 'length';
  zoneLabel: string;
  userCm: number;
  garmentCm: number;
  diffCm: number;
  status: FitStatus;
  statusText: string;
  colorHex: string;
}

export interface ProductMultiAngles {
  front: string;
  angle45: string;
  side: string;
  back: string;
}

export interface ProductSizeSpec {
  size: string;
  chestCm: number;
  waistCm: number;
  hipsCm: number;
  lengthCm: number;
}

export interface SizeChartEntry {
  size: string;
  chestCm: number;
  waistCm: number;
  hipsCm: number;
  lengthCm: number;
  diffChest: number;
  diffWaist: number;
  diffHips: number;
  fitStatus: FitStatus;
  fitNote: string;
}

export interface DetailedFitReport {
  garmentTitle: string;
  category: string;
  recommendedSize: string;
  fabricElasticity: string;
  primaryFitAdvice: string;
  lengthMarker: string;
  estimatedLengthFromShoulderCm: number;
  sizeMatrix: SizeChartEntry[];
}

export interface ClothingItem {
  id?: string;
  title: string;
  brand?: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  category: ClothingCategory;
  subType?: GarmentSubType;
  subCategory?: string;
  detectedColor?: string;
  hexColor?: string;
  customColor?: string;
  selectedSize?: GarmentSize | string;
  fabricElasticity?: string;
  lengthType?: 'crop' | 'waist' | 'hip' | 'knee' | 'midi' | 'maxi' | 'ankle';
  shoulderToHemCm?: number;
  multiAngles?: ProductMultiAngles;
  sizeChart?: ProductSizeSpec[];
}

export interface Outfit {
  id: string;
  title: string;
  description?: string;
  totalPrice: number;
  mannequinHeightCm: number;
  mannequinWeightKg: number;
  createdAt: string;
  items: ClothingItem[];
}

export interface BodyMetrics {
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: string;
  scaleY: number;
  scaleX: number;
  scaleZ: number;
}

export interface GarmentFitDetail {
  title: string;
  category: ClothingCategory;
  recommendedSize: string;
  lengthAnalysis: string;
  fitAdvice: string;
  silhouetteNote: string;
}

export interface FitAnalysisResult {
  userHeightCm: number;
  userWeightKg: number;
  userChestCm: number;
  userWaistCm: number;
  userHipsCm: number;
  userInseamCm: number;
  bmi: number;
  bmiCategory: string;
  harmonyScore: number;
  paletteName: string;
  overallStylingAdvice: string;
  itemFits: GarmentFitDetail[];
  detailedReports: DetailedFitReport[];
}
