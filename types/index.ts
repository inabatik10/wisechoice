export interface Plant {
  id: string;
  nameRu: string;
  nameKk: string;
  nameLatin: string;
  description: string;
  whereFound: string;
  ligninPct: number;
  cellulosePct: number;
  optimalPyrolysisTemp: number;
  pyrolysisTempRange: [number, number];
  knownEfficiency: {
    Cr: number;
    Pb: number;
    MP: number;
  };
  emoji: string;
  color: string;
}

export interface WaterBody {
  id: string;
  nameRu: string;
  nameKk: string;
  coordinates?: { lat: number; lng: number };
  radius?: number;
  pH?: number;
  pHSource: 'measured' | 'literature' | 'estimated';
  contamination?: {
    Cr?: number;
    Pb?: number;
    MP?: number;
  };
  region: string;
}

export interface ModelInput {
  selectedPlants: string[];
  pyrolysisTemp: number;
  pH?: number;
  pHSource?: 'gps' | 'manual' | 'none';
  targetContaminants: ('Cr' | 'Pb' | 'MP')[];
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface BiocharProperties {
  BET_m2g: number;
  porosity_pct: number;
  pH_biochar: number;
  C_pct: number;
  OH_groups: number;
  COOH_groups: number;
  biochar_yield_pct: number;
}

export interface PredictionResult {
  optimalPlant: string;
  optimalPyrolysisTemp: number;
  pyrolysisTime: number;
  biocharRatio: number;
  clayRatio: number;
  otherRatio: number;
  biocharProperties: BiocharProperties;
  efficiency: {
    Cr: number;
    Pb: number;
    MP: number;
  };
  confidence: number;
  isMockMode: boolean;
  pHUsed: boolean;
  tips: string[];
  instructions: string[];
}
