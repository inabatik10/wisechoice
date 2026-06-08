import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

interface EfficiencyBarProps {
  label: string;
  value: number;
  color?: string;
  subtitle?: string;
}

export function EfficiencyBar({
  label,
  value,
  color = COLORS.accent,
  subtitle,
}: EfficiencyBarProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / 100,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}%</Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width: widthInterpolated, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  track: {
    height: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
