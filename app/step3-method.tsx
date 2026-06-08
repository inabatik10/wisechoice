import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/colors';
import { useAnalysisStore } from '../store/analysisStore';
import { predictOptimalBiochar } from '../services/mockAI';

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(step / total) * 100}%` as any }]} />
      </View>
      <Text style={styles.progressLabel}>
        Шаг {step} из {total}
      </Text>
    </View>
  );
}

function getTempIndicator(temp: number): { label: string; color: string } {
  if (temp <= 350) return { label: 'Недостаточно (биочар не сформируется)', color: '#4A90D9' };
  if (temp <= 450) return { label: 'Хорошо', color: '#F5A623' };
  if (temp <= 550) return { label: 'Отлично (оптимум для полыни)', color: COLORS.success };
  if (temp <= 650) return { label: 'Очень хорошо', color: COLORS.success };
  return { label: 'Слишком горячо (теряются функциональные группы)', color: '#E85D00' };
}

const TEMP_STEPS = [300, 350, 400, 450, 500, 550, 600, 650, 700];

function TempSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View>
      <View style={sliderStyles.track}>
        {TEMP_STEPS.map((step) => {
          const active = step <= value;
          return (
            <TouchableOpacity
              key={step}
              style={[sliderStyles.segment, active && sliderStyles.segmentActive]}
              onPress={() => onChange(step)}
            />
          );
        })}
        <View
          style={[
            sliderStyles.thumb,
            {
              left: `${((value - 300) / 400) * 96}%` as any,
            },
          ]}
        />
      </View>
      <View style={sliderStyles.labels}>
        <Text style={sliderStyles.labelText}>300°C</Text>
        <Text style={sliderStyles.labelText}>500°C</Text>
        <Text style={sliderStyles.labelText}>700°C</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'visible',
    position: 'relative',
    marginVertical: 12,
  },
  segment: {
    flex: 1,
    height: '100%',
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: COLORS.surface,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
  },
  thumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});

const CONTAMINANTS: { id: 'Cr' | 'Pb' | 'MP'; label: string; desc: string }[] = [
  { id: 'Cr', label: 'Хром Cr(VI)', desc: 'от промышленных стоков' },
  { id: 'Pb', label: 'Свинец Pb(II)', desc: 'от дорог и автомобилей' },
  { id: 'MP', label: 'Микропластик', desc: 'от шин и пластикового мусора' },
];

export default function Step3Method() {
  const router = useRouter();
  const {
    pyrolysisTemp,
    setPyrolysisTemp,
    targetContaminants,
    toggleContaminant,
    buildModelInput,
    setResult,
    setLoading,
    setError,
    isLoading,
  } = useAnalysisStore();

  const indicator = getTempIndicator(pyrolysisTemp);

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    try {
      const input = buildModelInput();
      const result = await predictOptimalBiochar(input);
      setResult(result);
      router.push('/result');
    } catch (e: any) {
      setError(e.message ?? 'Ошибка расчёта');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ProgressBar step={3} total={3} />

      <Text style={styles.title}>Параметры обработки</Text>
      <Text style={styles.subtitle}>Укажи температуру и выбери что нужно очистить</Text>

      {/* Temperature slider */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Температура костра / мангала</Text>
        <Text style={styles.tempValue}>{pyrolysisTemp}°C</Text>
        <TempSlider value={pyrolysisTemp} onChange={setPyrolysisTemp} />
        <View style={[styles.tempIndicator, { borderLeftColor: indicator.color }]}>
          <View style={[styles.tempDot, { backgroundColor: indicator.color }]} />
          <Text style={[styles.tempIndicatorText, { color: indicator.color }]}>
            {indicator.label}
          </Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Не знаешь температуру? Обычный костёр в углях = 450-550°C — это как раз оптимум!
          </Text>
        </View>
      </View>

      {/* Contaminants */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Что чистим?</Text>
        {CONTAMINANTS.map((c) => {
          const checked = targetContaminants.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.checkRow, checked && styles.checkRowSelected]}
              onPress={() => toggleContaminant(c.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View>
                <Text style={styles.checkLabel}>{c.label}</Text>
                <Text style={styles.checkDesc}>{c.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.calcBtn, (isLoading || targetContaminants.length === 0) && styles.calcBtnDisabled]}
        onPress={handleCalculate}
        disabled={isLoading || targetContaminants.length === 0}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <Text style={styles.calcBtnText}>Рассчитать биосорбент 🤖</Text>
        )}
      </TouchableOpacity>

      {isLoading && (
        <Text style={styles.loadingNote}>
          Рассчитываю оптимальную рецептуру...
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: 20, paddingBottom: 48 },
  progressContainer: { marginBottom: 24 },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tempValue: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  tempIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingLeft: 10,
    gap: 8,
  },
  tempDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tempIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  tipBox: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    padding: 12,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  checkRowSelected: {
    backgroundColor: COLORS.offWhite,
    borderColor: COLORS.accent,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkMark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  checkDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  calcBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  calcBtnDisabled: {
    opacity: 0.5,
  },
  calcBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  loadingNote: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
});
