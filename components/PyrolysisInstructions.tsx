import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface PyrolysisInstructionsProps {
  instructions: string[];
}

export function PyrolysisInstructions({ instructions }: PyrolysisInstructionsProps) {
  return (
    <View style={styles.container}>
      {instructions.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.numberCircle}>
            <Text style={styles.number}>{i + 1}</Text>
          </View>
          <Text
            style={[
              styles.text,
              step.startsWith('ВАЖНО') && styles.important,
            ]}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  numberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  number: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  important: {
    fontWeight: '700',
    color: COLORS.danger,
  },
});
