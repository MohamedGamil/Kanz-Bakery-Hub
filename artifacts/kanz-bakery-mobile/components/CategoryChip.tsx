import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, active, onPress }: CategoryChipProps) {
  const colors = useColors();
  const { isRTL } = useLanguage();

  const styles = StyleSheet.create({
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: active ? colors.primary : colors.border,
      backgroundColor: active ? colors.primary : colors.card,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    text: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
      color: active ? colors.primaryForeground : colors.mutedForeground,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, { opacity: pressed ? 0.8 : 1 }]}
      onPress={onPress}
      testID={`category-chip-${label}`}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}
