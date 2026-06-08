import { create } from 'zustand';
import { ModelInput, PredictionResult, WaterBody } from '../types';

interface AnalysisState {
  waterBody: WaterBody | null;
  manualWaterName: string;
  pH: number | undefined;
  pHSource: 'gps' | 'manual' | 'none';
  locationPermission: 'granted' | 'denied' | 'pending';

  selectedPlants: string[];

  pyrolysisTemp: number;
  targetContaminants: ('Cr' | 'Pb' | 'MP')[];

  result: PredictionResult | null;
  isLoading: boolean;
  error: string | null;

  setWaterBody: (wb: WaterBody | null) => void;
  setManualWaterName: (name: string) => void;
  setPH: (pH: number | undefined, source: 'gps' | 'manual' | 'none') => void;
  setLocationPermission: (p: 'granted' | 'denied' | 'pending') => void;
  togglePlant: (plantId: string) => void;
  setPyrolysisTemp: (temp: number) => void;
  toggleContaminant: (c: 'Cr' | 'Pb' | 'MP') => void;
  setResult: (result: PredictionResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  buildModelInput: () => ModelInput;
}

function getSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  waterBody: null,
  manualWaterName: '',
  pH: undefined,
  pHSource: 'none',
  locationPermission: 'pending',
  selectedPlants: [],
  pyrolysisTemp: 500,
  targetContaminants: ['Cr', 'Pb', 'MP'],
  result: null,
  isLoading: false,
  error: null,

  setWaterBody: (wb) => set({ waterBody: wb }),
  setManualWaterName: (name) => set({ manualWaterName: name }),
  setPH: (pH, source) => set({ pH, pHSource: source }),
  setLocationPermission: (p) => set({ locationPermission: p }),
  togglePlant: (plantId) =>
    set((state) => ({
      selectedPlants: state.selectedPlants.includes(plantId)
        ? state.selectedPlants.filter((p) => p !== plantId)
        : [...state.selectedPlants, plantId],
    })),
  setPyrolysisTemp: (temp) => set({ pyrolysisTemp: temp }),
  toggleContaminant: (c) =>
    set((state) => ({
      targetContaminants: state.targetContaminants.includes(c)
        ? state.targetContaminants.filter((x) => x !== c)
        : [...state.targetContaminants, c],
    })),
  setResult: (result) => set({ result }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      waterBody: null,
      manualWaterName: '',
      pH: undefined,
      pHSource: 'none',
      selectedPlants: [],
      pyrolysisTemp: 500,
      targetContaminants: ['Cr', 'Pb', 'MP'],
      result: null,
      error: null,
    }),

  buildModelInput: () => {
    const state = get();
    return {
      selectedPlants: state.selectedPlants,
      pyrolysisTemp: state.pyrolysisTemp,
      pH: state.pH,
      pHSource: state.pHSource,
      targetContaminants: state.targetContaminants,
      season: getSeason(),
    };
  },
}));
