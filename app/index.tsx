import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useAnalysisStore } from '../store/analysisStore';

export default function HomeScreen() {
  const router = useRouter();
  const reset = useAnalysisStore((s) => s.reset);

  function handleStart() {
    reset();
    router.push('/step1-location');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} bounces={false}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.hero}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>💧</Text>
          <View>
            <Text style={styles.logoText}>BioSorb KZ</Text>
            <Text style={styles.logoSub}>биосорбент из местных растений</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Чистая вода{'\n'}для фермеров Актобе</Text>
        <Text style={styles.heroDesc}>
          Создай бесплатный фильтр из полыни и камыша для удаления тяжёлых металлов и
          микропластика
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        {/* Mock mode warning */}
        <View style={styles.mockCard}>
          <Text style={styles.mockIcon}>⚠️</Text>
          <View style={styles.mockText}>
            <Text style={styles.mockTitle}>Демо режим</Text>
            <Text style={styles.mockDesc}>
              ИИ-модель в разработке. Результаты основаны на научных формулах (Khater 2024,
              Yaseen 2025), а не на обученной нейросети.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Начать анализ</Text>
          <Text style={styles.startBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* How it works */}
        <Text style={styles.sectionTitle}>Как это работает</Text>
        <View style={styles.steps}>
          <StepCard icon="🌿" step="1" title="Выбери растения" desc="Полынь, камыш или рогоз рядом с тобой" />
          <View style={styles.stepArrow}>
            <Text style={styles.stepArrowText}>→</Text>
          </View>
          <StepCard icon="🔥" step="2" title="ИИ рассчитает биочар" desc="Оптимальная рецептура для твоей воды" />
          <View style={styles.stepArrow}>
            <Text style={styles.stepArrowText}>→</Text>
          </View>
          <StepCard icon="💧" step="3" title="Чистая вода" desc="Хром, свинец и микропластик удалены" />
        </View>

        {/* Science info */}
        <View style={styles.scienceCard}>
          <Text style={styles.scienceTitle}>🔬 Научная основа</Text>
          <Text style={styles.scienceText}>
            Рецептуры основаны на статьях Khater et al. (Scientific Reports, 2024) и Yaseen &
            Alhalimi (2025). Биочар из полыни удаляет до{' '}
            <Text style={styles.highlight}>91% хрома</Text> и{' '}
            <Text style={styles.highlight}>88% свинца</Text>.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StepCard({
  icon,
  step,
  title,
  desc,
}: {
  icon: string;
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { paddingBottom: 40 },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoIcon: { fontSize: 36 },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logoSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  mockCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.mockBadge,
    borderWidth: 1.5,
    borderColor: COLORS.mockBadgeBorder,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  mockIcon: { fontSize: 22, marginTop: 1 },
  mockText: { flex: 1 },
  mockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 4,
  },
  mockDesc: {
    fontSize: 13,
    color: '#6B4F00',
    lineHeight: 19,
  },
  startBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  startBtnArrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: -8,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  stepIcon: { fontSize: 28, marginBottom: 6 },
  stepTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  stepArrow: { paddingBottom: 16 },
  stepArrowText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  scienceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scienceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  scienceText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  highlight: {
    color: COLORS.accent,
    fontWeight: '700',
  },
});
