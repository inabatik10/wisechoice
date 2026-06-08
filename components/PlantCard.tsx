import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plant } from '../types';
import { COLORS } from '../constants/colors';

interface PlantCardProps {
  plant: Plant;
  selected: boolean;
  onPress: () => void;
}

export function PlantCard({ plant, selected, onPress }: PlantCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && { borderColor: plant.color, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {selected && (
        <View style={[styles.checkmark, { backgroundColor: plant.color }]}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
      <View style={[styles.iconCircle, { backgroundColor: plant.color + '22' }]}>
        <Text style={styles.emoji}>{plant.emoji}</Text>
      </View>
      <Text style={styles.nameRu}>{plant.nameRu}</Text>
      <Text style={styles.nameKk}>{plant.nameKk}</Text>
      <Text style={styles.whereFound} numberOfLines={2}>
        {plant.whereFound}
      </Text>
      <View style={styles.badges}>
        <EffBadge label="Cr" value={plant.knownEfficiency.Cr} color={plant.color} />
        <EffBadge label="Pb" value={plant.knownEfficiency.Pb} color={plant.color} />
        <EffBadge label="MP" value={plant.knownEfficiency.MP} color={plant.color} />
      </View>
    </TouchableOpacity>
  );
}

function EffBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>
        {label} {value}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    margin: 5,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 26,
  },
  nameRu: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  nameKk: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  whereFound: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
