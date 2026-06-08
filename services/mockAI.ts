/**
 * MOCK RANDOM FOREST MODEL
 *
 * Simulates future RF model behaviour using formulas from scientific literature:
 * - Khater et al. Scientific Reports 14:2625 (2024)
 * - Yaseen & Alhalimi Scientific Reports 15:13434 (2025)
 *
 * ALL predictions are flagged isMockMode: true and shown to the user.
 */

import { ModelInput, PredictionResult } from '../types';
import { PLANTS } from '../constants/plants';
import { predictBiocharProperties } from '../constants/biocharKnowledge';

export const IS_MOCK_MODE = true;

export async function predictOptimalBiochar(
  input: ModelInput
): Promise<PredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const selectedPlantObjects = PLANTS.filter((p) =>
    input.selectedPlants.includes(p.id)
  );

  if (selectedPlantObjects.length === 0) {
    throw new Error('Не выбрано ни одного растения');
  }

  const primaryTarget: 'Cr' | 'Pb' | 'MP' = input.targetContaminants.includes(
    'Cr'
  )
    ? 'Cr'
    : input.targetContaminants.includes('Pb')
    ? 'Pb'
    : 'MP';

  const bestPlant = selectedPlantObjects.reduce((best, plant) => {
    return plant.knownEfficiency[primaryTarget] >
      best.knownEfficiency[primaryTarget]
      ? plant
      : best;
  });

  let optimalTemp = bestPlant.optimalPyrolysisTemp;
  if (input.pH !== undefined) {
    if (input.pH < 6)
      optimalTemp = Math.max(bestPlant.pyrolysisTempRange[0], optimalTemp - 50);
    if (input.pH > 8)
      optimalTemp = Math.min(bestPlant.pyrolysisTempRange[1], optimalTemp + 50);
  }

  const biocharProps = predictBiocharProperties(optimalTemp, bestPlant.id);

  const baseEfficiency = { ...bestPlant.knownEfficiency };

  if (input.pH !== undefined) {
    if (primaryTarget === 'Cr' && input.pH > 7) {
      baseEfficiency.Cr = Math.max(
        60,
        baseEfficiency.Cr - (input.pH - 7) * 3
      );
    }
    if (primaryTarget === 'Pb' && input.pH < 5) {
      baseEfficiency.Pb = Math.max(
        50,
        baseEfficiency.Pb - (5 - input.pH) * 4
      );
    }
  }

  const seasonMultiplier: Record<string, number> = {
    spring: 1.0,
    summer: 1.02,
    autumn: 0.98,
    winter: 0.94,
  };

  const mult = seasonMultiplier[input.season] ?? 1.0;

  const finalEfficiency = {
    Cr: Math.min(99, Math.round(baseEfficiency.Cr * mult)),
    Pb: Math.min(99, Math.round(baseEfficiency.Pb * mult)),
    MP: Math.min(99, Math.round(baseEfficiency.MP * mult)),
  };

  const biocharRatio = 55;
  const clayRatio = 35;
  const otherRatio = 10;

  const tips: string[] = [];

  if (!input.pH) {
    tips.push(
      'pH воды неизвестен. Рецептура рассчитана без учёта pH. Для более точного результата используй тест-полоску pH (130 тенге).'
    );
  }

  if (biocharProps.OH_groups < 0.3) {
    tips.push(
      `При ${optimalTemp}°C большинство -OH групп разрушается. Попробуй снизить температуру до 400-450°C для лучшего связывания Pb.`
    );
  }

  if (biocharProps.BET_m2g > 100) {
    tips.push(
      `Большая площадь поверхности ${biocharProps.BET_m2g} м²/г — отлично для захвата микропластика!`
    );
  }

  const pyrolysisTime = optimalTemp < 450 ? 30 : optimalTemp < 550 ? 45 : 60;

  const instructions = [
    `Высуши ${bestPlant.nameRu} при солнце 2-3 дня (или в духовке 80°C, 2 часа)`,
    `Измельчи до кусочков 1-5 см`,
    `Плотно набей металлическую банку (1 л) с крышкой`,
    `Проделай отверстие 2-3 мм в крышке для выхода газов`,
    `Поставь в костёр или мангал на ${pyrolysisTime} минут`,
    `Дождись пока дым из отверстия станет прозрачным или пропадёт`,
    `ВАЖНО: дай банке остыть ЗАКРЫТОЙ (горячий уголь вспыхнет на воздухе!)`,
    `Измельчи биочар до фракции 2-4 мм`,
    `Смешай: ${biocharRatio}% биочара + ${clayRatio}% глины + ${otherRatio}% сырой ${bestPlant.nameRu}`,
    `Засыпь слоями в пластиковую бутылку 5л (фильтр готов!)`,
    `Промой дистиллированной водой перед первым использованием`,
  ];

  return {
    optimalPlant: bestPlant.id,
    optimalPyrolysisTemp: optimalTemp,
    pyrolysisTime,
    biocharRatio,
    clayRatio,
    otherRatio,
    biocharProperties: biocharProps,
    efficiency: finalEfficiency,
    confidence: input.pH !== undefined ? 0.82 : 0.71,
    isMockMode: IS_MOCK_MODE,
    pHUsed: input.pH !== undefined,
    tips,
    instructions,
  };
}
