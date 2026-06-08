import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { useAnalysisStore } from '../store/analysisStore';
import { PLANTS } from '../constants/plants';
import { PlantCard } from '../components/PlantCard';

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

export default function Step2Plants() {
  const router = useRouter();
  const { selectedPlants, togglePlant } = useAnalysisStore();
  const canProceed = selectedPlants.length > 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ProgressBar step={2} total={3} />

      <Text style={styles.title}>Какие растения есть рядом?</Text>
      <Text style={styles.subtitle}>
        Выбери всё что видишь — ИИ выберет лучшее для твоей воды
      </Text>

      <View style={styles.grid}>
        {PLANTS.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            selected={selectedPlants.includes(plant.id)}
            onPress={() => togglePlant(plant.id)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedPlants.length === 0
            ? 'Выбери хотя бы одно растение'
            : `Выбрано: ${selectedPlants.length} ${selectedPlants.length === 1 ? 'растение' : selectedPlants.length < 5 ? 'растения' : 'растений'}`}
        </Text>
        <TouchableOpacity
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          onPress={() => router.push('/step3-method')}
          disabled={!canProceed}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, !canProceed && styles.nextBtnTextDisabled]}>
            Далее →
          </Text>
        </TouchableOpacity>
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 24,
  },
  footer: { gap: 12 },
  selectedCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextBtnDisabled: {
    backgroundColor: COLORS.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  nextBtnTextDisabled: {
    color: COLORS.textSecondary,
  },
});
