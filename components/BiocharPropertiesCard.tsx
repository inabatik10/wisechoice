import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BiocharProperties as BiocharPropertiesType } from '../types';
import { COLORS } from '../constants/colors';
import { PROPERTY_EXPLANATIONS } from '../constants/biocharKnowledge';

interface Props {
  properties: BiocharPropertiesType;
}

type PropKey = 'BET_m2g' | 'pH_biochar' | 'C_pct' | 'biochar_yield_pct';

export function BiocharPropertiesCard({ properties }: Props) {
  const keys: PropKey[] = ['BET_m2g', 'pH_biochar', 'C_pct', 'biochar_yield_pct'];

  return (
    <View style={styles.grid}>
      {keys.map((key) => {
        const meta = PROPERTY_EXPLANATIONS[key];
        const raw = properties[key as keyof BiocharPropertiesType] as number;
        const isGood = raw >= meta.goodThreshold;
        return (
          <View key={key} style={styles.cell}>
            <Text style={styles.propValue}>
              {raw}
              {meta.unit ? ` ${meta.unit}` : ''}
            </Text>
            <Text style={styles.propLabel}>{meta.label}</Text>
            <Text style={styles.propDesc} numberOfLines={2}>
              {meta.description}
            </Text>
            <View style={[styles.badge, isGood ? styles.badgeGood : styles.badgeOk]}>
              <Text style={[styles.badgeText, isGood ? styles.badgeTextGood : styles.badgeTextOk]}>
                {isGood ? '✅ Хорошо' : 'ℹ️ Норма'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: '47%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  propValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  propLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  propDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    marginBottom: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeGood: {
    backgroundColor: '#E8F7E1',
  },
  badgeOk: {
    backgroundColor: COLORS.surface,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextGood: {
    color: COLORS.success,
  },
  badgeTextOk: {
    color: COLORS.textSecondary,
  },
});
