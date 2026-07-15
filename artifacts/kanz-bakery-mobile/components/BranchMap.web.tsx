import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  branches: Array<{ id: number; lat: number; lng: number; name: string }>;
  selectedId: number;
  onMarkerPress: (id: number) => void;
  selectedLat: number;
  selectedLng: number;
}

// Web placeholder — react-native-maps is not supported on web.
// The map is fully functional on iOS and Android via Expo Go.
export default function BranchMap({ branches, selectedId }: Props) {
  const selected = branches.find((b) => b.id === selectedId);
  return (
    <View style={styles.placeholder}>
      <Ionicons name="map-outline" size={28} color="#B87208" />
      <Text style={styles.text}>{selected?.name ?? 'Map'}</Text>
      <Text style={styles.sub}>Map available in the mobile app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 120,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F0ECE6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#DDD5C9',
  },
  text: {
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
    color: '#2E2118',
  },
  sub: {
    fontSize: 12,
    color: '#6B5A49',
    fontFamily: 'DMSans_400Regular',
  },
});
