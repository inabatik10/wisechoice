import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export function MockAIBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>🔬</Text>
      <View style={styles.text}>
        <Text style={styles.title}>Демо режим</Text>
        <Text style={styles.subtitle}>Реальный ИИ будет добавлен позже</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mockBadge,
    borderWidth: 1,
    borderColor: COLORS.mockBadgeBorder,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  icon: {
    fontSize: 22,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.warning,
    marginTop: 1,
  },
});
