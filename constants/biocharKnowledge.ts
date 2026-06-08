import { BiocharProperties } from '../types';

/**
 * Predicts biochar properties from pyrolysis temperature.
 * Based on Khater et al. Scientific Reports 14:2625 (2024) and
 * meta-analyses by He et al. 2022, Shakoor et al. 2020.
 */
export function predictBiocharProperties(
  temp: number,
  _plantId: string
): BiocharProperties {
  // BET surface area — peaks ~500°C for herbaceous plants
  let BET: number;
  if (temp <= 500) {
    BET = 20 + (temp - 300) * 0.5;
  } else {
    BET = 120 - (temp - 500) * 0.4;
  }
  BET = Math.max(15, Math.min(150, BET));

  // Carbon content rises with temperature
  const C_pct = Math.min(56, 25 + temp * 0.052);

  // Surface pH rises with temperature
  const pH_biochar = Math.min(11, 6.5 + temp * 0.005);

  // Functional groups degrade at high temperature
  const OH_groups = Math.max(0, 1.0 - (temp - 200) / 400);
  const COOH_groups = Math.max(0, 1.0 - (temp - 200) / 350);

  const porosity = Math.max(44, 70 - temp * 0.02);

  // Biochar yield decreases with temperature
  const biochar_yield = Math.max(18, 58 - temp * 0.05);

  return {
    BET_m2g: Math.round(BET),
    porosity_pct: Math.round(porosity * 10) / 10,
    pH_biochar: Math.round(pH_biochar * 10) / 10,
    C_pct: Math.round(C_pct * 10) / 10,
    OH_groups: Math.round(OH_groups * 100) / 100,
    COOH_groups: Math.round(COOH_groups * 100) / 100,
    biochar_yield_pct: Math.round(biochar_yield * 10) / 10,
  };
}

export const PROPERTY_EXPLANATIONS: Record<
  string,
  { label: string; unit: string; description: string; goodThreshold: number }
> = {
  BET_m2g: {
    label: 'Площадь поверхности',
    unit: 'м²/г',
    description: 'Больше = лучше захватывает микропластик',
    goodThreshold: 80,
  },
  pH_biochar: {
    label: 'pH поверхности',
    unit: '',
    description: 'Выше = лучше для хрома Cr(VI)',
    goodThreshold: 8.5,
  },
  C_pct: {
    label: 'Содержание углерода',
    unit: '%',
    description: 'Больше = прочнее связывает тяжёлые металлы',
    goodThreshold: 45,
  },
  OH_groups: {
    label: '-OH группы',
    unit: 'усл. ед.',
    description: 'Отвечают за связывание свинца Pb(II)',
    goodThreshold: 0.3,
  },
  biochar_yield_pct: {
    label: 'Выход биочара',
    unit: '%',
    description: 'Сколько биочара получится из 1 кг сырья',
    goodThreshold: 30,
  },
};
