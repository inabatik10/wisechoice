import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { useAnalysisStore } from '../store/analysisStore';
import { PLANTS } from '../constants/plants';
import { MockAIBadge } from '../components/MockAIBadge';
import { BiocharPropertiesCard } from '../components/BiocharPropertiesCard';
import { EfficiencyBar } from '../components/EfficiencyBar';
import { PyrolysisInstructions } from '../components/PyrolysisInstructions';

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function ResultScreen() {
  const router = useRouter();
  const { result, reset } = useAnalysisStore();

  if (!result) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Нет результата. Начни новый анализ.</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => router.replace('/')}>
          <Text style={styles.newBtnText}>На главную</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const plant = PLANTS.find((p) => p.id === result.optimalPlant);

  async function handleShare() {
    if (!result) return;
    try {
      await Share.share({
        message:
          `BioSorb KZ — Рецептура биосорбента\n` +
          `Растение: ${plant?.nameRu ?? result.optimalPlant}\n` +
          `Температура пиролиза: ${result.optimalPyrolysisTemp}°C (${result.pyrolysisTime} мин)\n` +
          `Эффективность: Cr ${result.efficiency.Cr}%, Pb ${result.efficiency.Pb}%, MP ${result.efficiency.MP}%\n` +
          `Состав: ${result.biocharRatio}% биочара + ${result.clayRatio}% глины + ${result.otherRatio}% сырья`,
      });
    } catch {
      // Share not available on all platforms
    }
  }

  function handleNewAnalysis() {
    reset();
    router.replace('/');
  }

  const confidencePct = Math.round(result.confidence * 100);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Mock mode banner */}
      {result.isMockMode && (
        <View style={styles.mockBanner}>
          <MockAIBadge />
          <Text style={styles.mockBannerDesc}>
            Результат рассчитан по формулам Khater 2024 + Yaseen 2025. Реальная RF-модель будет
            добавлена после обучения на датасете.
          </Text>
        </View>
      )}

      {/* Block 1: Recommended plant */}
      <View style={styles.heroCard}>
        <View style={[styles.plantIconCircle, { backgroundColor: (plant?.color ?? COLORS.accent) + '22' }]}>
          <Text style={styles.plantEmoji}>{plant?.emoji ?? '🌿'}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>Биочар из {plant?.nameRu ?? result.optimalPlant}</Text>
          <Text style={styles.heroMeta}>
            при {result.optimalPyrolysisTemp}°C · {result.pyrolysisTime} минут
          </Text>
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>Уверенность модели:</Text>
            <Text style={styles.confidenceValue}>{confidencePct}%</Text>
          </View>
        </View>
      </View>

      {/* Block 2: Biochar properties */}
      <SectionTitle title="Свойства биочара" />
      <BiocharPropertiesCard properties={result.biocharProperties} />

      {/* Block 3: Efficiency */}
      <SectionTitle
        title={`Эффективность очистки${result.pHUsed ? '' : ' (без учёта pH)'}`}
      />
      <View style={styles.card}>
        {result.pHUsed && (
          <Text style={styles.pHNote}>С учётом pH воды</Text>
        )}
        {!result.pHUsed && (
          <Text style={styles.pHNoteWarn}>pH воды не задан — приблизительные данные</Text>
        )}
        <EfficiencyBar
          label="Хром Cr(VI)"
          value={result.efficiency.Cr}
          color="#E03B3B"
        />
        <EfficiencyBar
          label="Свинец Pb(II)"
          value={result.efficiency.Pb}
          color="#7B4B94"
        />
        <EfficiencyBar
          label="Микропластик"
          value={result.efficiency.MP}
          color={COLORS.secondary}
        />
      </View>

      {/* Block 4: Filter composition */}
      <SectionTitle title="Состав фильтра" />
      <View style={styles.card}>
        <Text style={styles.compositionText}>
          {result.biocharRatio}% биочара + {result.clayRatio}% глины + {result.otherRatio}% сырой {plant?.nameRu ?? 'биомассы'}
        </Text>
        <View style={styles.compositionBar}>
          <View style={[styles.compSegment, { flex: result.biocharRatio, backgroundColor: plant?.color ?? COLORS.accent }]} />
          <View style={[styles.compSegment, { flex: result.clayRatio, backgroundColor: '#A08060' }]} />
          <View style={[styles.compSegment, { flex: result.otherRatio, backgroundColor: '#8A9E70' }]} />
        </View>
        <View style={styles.compositionLegend}>
          <LegendItem color={plant?.color ?? COLORS.accent} label="Биочар" />
          <LegendItem color="#A08060" label="Глина" />
          <LegendItem color="#8A9E70" label="Сырьё" />
        </View>
      </View>

      {/* Block 5: Instructions */}
      <SectionTitle title="Инструкция по изготовлению" />
      <View style={styles.card}>
        <PyrolysisInstructions instructions={result.instructions} />
      </View>

      {/* Block 6: Tips */}
      {result.tips.length > 0 && (
        <>
          <SectionTitle title="Советы" />
          <View style={styles.card}>
            {result.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareBtnText}>📤 Поделиться</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newBtn} onPress={handleNewAnalysis} activeOpacity={0.85}>
          <Text style={styles.newBtnText}>🔄 Новый анализ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  mockBanner: {
    backgroundColor: COLORS.mockBadge,
    borderWidth: 1.5,
    borderColor: COLORS.mockBadgeBorder,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  mockBannerDesc: {
    fontSize: 12,
    color: '#6B4F00',
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  plantIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmoji: { fontSize: 32 },
  heroInfo: { flex: 1 },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  heroMeta: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  pHNote: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: 4,
  },
  pHNoteWarn: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
    marginBottom: 4,
  },
  compositionText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  compositionBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    gap: 2,
  },
  compSegment: {
    height: '100%',
  },
  compositionLegend: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 16, marginTop: 1 },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  newBtn: {
    flex: 1,
    backgroundColor: COLORS.amber,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  newBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
