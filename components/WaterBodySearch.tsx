import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { WaterBody } from '../types';
import { searchWaterBodyByName } from '../services/locationService';
import { COLORS } from '../constants/colors';

interface WaterBodySearchProps {
  onSelect: (wb: WaterBody) => void;
  selectedId?: string;
}

export function WaterBodySearch({ onSelect, selectedId }: WaterBodySearchProps) {
  const [query, setQuery] = useState('');
  const results = query.length > 0 ? searchWaterBodyByName(query) : [];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введи название реки или озера..."
        placeholderTextColor={COLORS.textSecondary}
        value={query}
        onChangeText={setQuery}
      />
      {results.length > 0 && (
        <View style={styles.results}>
          {results.map((wb) => (
            <TouchableOpacity
              key={wb.id}
              style={[
                styles.resultItem,
                selectedId === wb.id && styles.resultItemSelected,
              ]}
              onPress={() => {
                onSelect(wb);
                setQuery(wb.nameRu);
              }}
            >
              <Text style={styles.resultName}>{wb.nameRu}</Text>
              <Text style={styles.resultSub}>
                {wb.nameKk} · {wb.region}
                {wb.pH !== undefined ? ` · pH ${wb.pH}` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {query.length > 1 && results.length === 0 && (
        <Text style={styles.noResults}>Водоём не найден в базе</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  results: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  resultItemSelected: {
    backgroundColor: COLORS.offWhite,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resultSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  noResults: {
    fontSize: 13,
    color: COLORS.textSecondary,
    paddingTop: 8,
    paddingLeft: 4,
  },
});
