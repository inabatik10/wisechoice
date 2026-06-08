import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { useAnalysisStore } from '../store/analysisStore';
import { findNearestWaterBody } from '../services/locationService';
import { WaterBodySearch } from '../components/WaterBodySearch';
import { WaterBody } from '../types';

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

export default function Step1Location() {
  const router = useRouter();
  const { waterBody, pH, pHSource, setWaterBody, setPH } = useAnalysisStore();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsResult, setGpsResult] = useState<{
    found: boolean;
    distance?: number;
    tried: boolean;
  }>({ found: false, tried: false });

  async function handleGPS() {
    setGpsLoading(true);
    try {
      const { waterBody: wb, distance } = await findNearestWaterBody(20);
      if (wb) {
        setWaterBody(wb);
        if (wb.pH !== undefined) {
          setPH(wb.pH, 'gps');
        }
        setGpsResult({ found: true, distance: distance ?? undefined, tried: true });
      } else {
        setGpsResult({ found: false, tried: true });
      }
    } finally {
      setGpsLoading(false);
    }
  }

  function handleWaterBodySelect(wb: WaterBody) {
    setWaterBody(wb);
    if (wb.pH !== undefined) {
      setPH(wb.pH, 'manual');
    }
  }

  function handleSkipPH() {
    setPH(undefined, 'none');
    router.push('/step2-plants');
  }

  function handleNext() {
    router.push('/step2-plants');
  }

  const contaminationText = waterBody?.contamination
    ? [
        waterBody.contamination.Cr ? `Cr: ${waterBody.contamination.Cr} мг/л` : null,
        waterBody.contamination.Pb ? `Pb: ${waterBody.contamination.Pb} мг/л` : null,
        waterBody.contamination.MP ? `Микропластик: ${waterBody.contamination.MP} шт/л` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  const pHSourceLabel: Record<string, string> = {
    measured: 'измерено',
    literature: 'из литературы',
    estimated: 'оценочно',
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ProgressBar step={1} total={3} />

      <Text style={styles.title}>Где твой водоём?</Text>
      <Text style={styles.subtitle}>
        pH воды влияет на точность рецептуры. Можно пропустить — модель всё равно сработает.
      </Text>

      {/* Section A: GPS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>А. Автоопределение</Text>
        {Platform.OS === 'web' ? (
          <View style={styles.webNote}>
            <Text style={styles.webNoteText}>
              GPS недоступен в браузере. Используй поиск ниже.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={handleGPS}
            disabled={gpsLoading}
            activeOpacity={0.8}
          >
            {gpsLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.gpsBtnText}>📍 Определить моё местоположение</Text>
            )}
          </TouchableOpacity>
        )}

        {gpsResult.tried && gpsResult.found && waterBody && (
          <View style={styles.wbCard}>
            <Text style={styles.wbName}>📍 {waterBody.nameRu}</Text>
            {gpsResult.distance && (
              <Text style={styles.wbMeta}>{(gpsResult.distance / 1000).toFixed(1)} км от вас</Text>
            )}
            {waterBody.pH !== undefined && (
              <Text style={styles.wbPH}>
                pH: {waterBody.pH}{' '}
                <Text style={styles.wbPHSource}>
                  ({pHSourceLabel[waterBody.pHSource] ?? waterBody.pHSource})
                </Text>
              </Text>
            )}
            {contaminationText && (
              <Text style={styles.wbContamination}>Загрязнение: {contaminationText}</Text>
            )}
          </View>
        )}

        {gpsResult.tried && !gpsResult.found && (
          <Text style={styles.gpsNotFound}>Водоём в радиусе 20 км не найден</Text>
        )}
      </View>

      {/* Section B: Manual search */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Б. Поиск по названию</Text>
        <WaterBodySearch onSelect={handleWaterBodySelect} selectedId={waterBody?.id} />
        {waterBody && pHSource === 'manual' && (
          <View style={styles.wbCard}>
            <Text style={styles.wbName}>✅ {waterBody.nameRu}</Text>
            {waterBody.pH !== undefined && (
              <Text style={styles.wbPH}>
                pH: {waterBody.pH}{' '}
                <Text style={styles.wbPHSource}>
                  ({pHSourceLabel[waterBody.pHSource] ?? waterBody.pHSource})
                </Text>
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Section C: Skip */}
      <View style={styles.section}>
        <TouchableOpacity onPress={handleSkipPH} style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Пропустить — pH неизвестен</Text>
        </TouchableOpacity>
        <Text style={styles.skipNote}>Рецептура будет менее точной, но рабочей</Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>Далее →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: 20, paddingBottom: 48 },
  progressContainer: {
    marginBottom: 24,
  },
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
  gpsBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gpsBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  webNote: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
  },
  webNoteText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  wbCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    gap: 4,
  },
  wbName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  wbMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  wbPH: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  wbPHSource: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  wbContamination: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  gpsNotFound: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  skipBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipBtnText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  skipNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nextBtn: {
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
  nextBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
