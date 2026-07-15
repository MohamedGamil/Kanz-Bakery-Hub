import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryName: string;
  available: boolean;
  featured: boolean;
  averageRating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export default function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (!product.available) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
    });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius * 2,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      ...(horizontal
        ? { flexDirection: 'row', width: 280 }
        : { width: 170 }),
    },
    image: {
      backgroundColor: colors.muted,
      ...(horizontal ? { width: 100, height: 100 } : { width: '100%', height: 130 }),
    },
    body: {
      flex: 1,
      padding: 10,
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    category: {
      fontSize: 11,
      color: colors.mutedForeground,
      marginTop: 2,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
    },
    footer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    price: {
      fontSize: 14,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    addBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    soldOutBadge: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    soldOutText: {
      fontSize: 10,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_500Medium',
    },
    featuredDot: {
      position: 'absolute',
      top: 8,
      left: isRTL ? undefined : 8,
      right: isRTL ? 8 : undefined,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    featuredText: {
      fontSize: 9,
      color: '#fff',
      fontFamily: 'DMSans_600SemiBold',
    },
    ratingRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 2,
    },
    ratingText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      testID={`product-card-${product.id}`}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: product.imageUrl ?? undefined }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {product.featured && (
          <View style={styles.featuredDot}>
            <Text style={styles.featuredText}>
              {t('Featured', 'مميز')}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.category}>{product.categoryName}</Text>
          {product.reviewCount > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={10} color="#E09A18" />
              <Text style={styles.ratingText}>
                {Number(product.averageRating).toFixed(1)} ({product.reviewCount})
              </Text>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{Number(product.price).toFixed(2)} {t('SAR', 'ر.س')}</Text>
          {product.available ? (
            <Pressable
              style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handleAddToCart}
              testID={`add-to-cart-${product.id}`}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </Pressable>
          ) : (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>{t('Sold out', 'نفد')}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
