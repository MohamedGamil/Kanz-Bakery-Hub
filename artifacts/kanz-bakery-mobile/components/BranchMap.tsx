import React from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet } from 'react-native';

interface Props {
  branches: Array<{ id: number; lat: number; lng: number; name: string }>;
  selectedId: number;
  onMarkerPress: (id: number) => void;
  selectedLat: number;
  selectedLng: number;
}

export default function BranchMap({ branches, selectedId, onMarkerPress, selectedLat, selectedLng }: Props) {
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      region={{
        latitude: selectedLat,
        longitude: selectedLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {branches.map((b) => (
        <Marker
          key={b.id}
          coordinate={{ latitude: b.lat, longitude: b.lng }}
          title={b.name}
          pinColor={b.id === selectedId ? '#B87208' : '#888'}
          onPress={() => onMarkerPress(b.id)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
