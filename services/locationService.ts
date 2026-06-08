import { Platform } from 'react-native';
import { WaterBody } from '../types';
import { WATER_BODIES } from './waterDatabase';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearestWaterBody(
  maxRadiusKm: number = 5
): Promise<{ waterBody: WaterBody | null; distance: number | null }> {
  if (Platform.OS === 'web') {
    return { waterBody: null, distance: null };
  }

  try {
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { waterBody: null, distance: null };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    let nearest: WaterBody | null = null;
    let minDistance = Infinity;

    for (const wb of WATER_BODIES) {
      if (!wb.coordinates) continue;
      const dist = haversineDistance(
        latitude,
        longitude,
        wb.coordinates.lat,
        wb.coordinates.lng
      );
      if (dist < minDistance && dist <= maxRadiusKm * 1000) {
        minDistance = dist;
        nearest = wb;
      }
    }

    return {
      waterBody: nearest,
      distance: nearest ? Math.round(minDistance) : null,
    };
  } catch {
    return { waterBody: null, distance: null };
  }
}

export function searchWaterBodyByName(query: string): WaterBody[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return WATER_BODIES.filter(
    (wb) =>
      wb.nameRu.toLowerCase().includes(q) ||
      wb.nameKk.toLowerCase().includes(q) ||
      wb.id.includes(q) ||
      wb.region.toLowerCase().includes(q)
  );
}
