import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

function Shimmer({ width, height, borderRadius = 4 }: { width: number | string; height: number; borderRadius?: number }) {
  const colors = useColors();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Animated.View
      style={{
        width: width as number,
        height,
        borderRadius,
        backgroundColor: colors.muted,
        opacity,
      }}
    />
  );
}

export function ProductCardSkeleton() {
  const colors = useColors();
  return (
    <View style={{ width: 170, backgroundColor: colors.card, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
      <Shimmer width="100%" height={130} />
      <View style={{ padding: 10, gap: 6 }}>
        <Shimmer width={120} height={12} />
        <Shimmer width={80} height={10} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Shimmer width={50} height={14} />
          <Shimmer width={28} height={28} borderRadius={14} />
        </View>
      </View>
    </View>
  );
}

export function ListItemSkeleton() {
  const colors = useColors();
  return (
    <View style={{ flexDirection: 'row', padding: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Shimmer width={80} height={80} borderRadius={8} />
      <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
        <Shimmer width="80%" height={14} />
        <Shimmer width="50%" height={11} />
        <Shimmer width="30%" height={14} />
      </View>
    </View>
  );
}
