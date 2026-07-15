import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useGetProduct } from '@workspace/api-client-react';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const { addItem, items } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useGetProduct(Number(id));

  const cartItem = items.find((i) => i.productId === Number(id));
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    backBtn: {
      position: 'absolute',
      top: topPad + 12,
      left: isRTL ? undefined : 16,
      right: isRTL ? 16 : undefined,
      zIndex: 10,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 300,
      backgroundColor: colors.muted,
    },
    body: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      padding: 20,
    },
    categoryBadge: {
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.accentForeground,
    },
    name: {
      fontSize: 24,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    ratingRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
    ratingText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
    },
    priceRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    price: {
      fontSize: 26,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    priceSub: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
    },
    qtyRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    qtyBtn: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      minWidth: 24,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 18,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      marginBottom: 8,
      textAlign: isRTL ? 'right' : 'left',
    },
    description: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      lineHeight: 22,
      textAlign: isRTL ? 'right' : 'left',
    },
    tagsRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tag: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    tagText: {
      fontSize: 12,
      fontFamily: 'DMSans_500Medium',
      color: colors.mutedForeground,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: bottomPad + 16,
      paddingTop: 12,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      gap: 8,
    },
    addBtnSuccess: {
      backgroundColor: '#2D7A2D',
    },
    addBtnText: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
    },
    unavailableBanner: {
      backgroundColor: colors.muted,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    unavailableText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_600SemiBold',
    },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    errorText: { fontSize: 16, color: colors.mutedForeground, textAlign: 'center', fontFamily: 'DMSans_400Regular' },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="cafe-outline" size={40} color={colors.mutedForeground} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={styles.errorText}>{t('Product not found', 'المنتج غير موجود')}</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: 'DMSans_600SemiBold' }}>
            {t('Go back', 'رجوع')}
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!product.available) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
    }, qty);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => router.back()}
      >
        <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.foreground} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.imageUrl ?? undefined }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.body}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.categoryName}</Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>

          {product.reviewCount > 0 && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(Number(product.averageRating)) ? 'star' : 'star-outline'}
                  size={14}
                  color="#E09A18"
                />
              ))}
              <Text style={styles.ratingText}>
                {Number(product.averageRating).toFixed(1)} ({product.reviewCount} {t('reviews', 'تقييم')})
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{Number(product.price).toFixed(2)} {t('SAR', 'ر.س')}</Text>
              {cartItem && (
                <Text style={styles.priceSub}>
                  {cartItem.quantity} {t('in bag', 'في السلة')}
                </Text>
              )}
            </View>
            {product.available && (
              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                  <Ionicons name="remove" size={18} color={colors.foreground} />
                </Pressable>
                <Text style={styles.qtyText}>{qty}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                  <Ionicons name="add" size={18} color={colors.foreground} />
                </Pressable>
              </View>
            )}
          </View>

          {product.description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>{t('About', 'عن المنتج')}</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}

          {product.dietaryLabels && product.dietaryLabels.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>{t('Dietary', 'معلومات غذائية')}</Text>
              <View style={styles.tagsRow}>
                {product.dietaryLabels.map((label) => (
                  <View key={label} style={styles.tag}>
                    <Text style={styles.tagText}>{label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {product.allergens && product.allergens.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>{t('Allergens', 'مسببات الحساسية')}</Text>
              <View style={styles.tagsRow}>
                {product.allergens.map((a) => (
                  <View key={a} style={[styles.tag, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.tagText, { color: '#92400E' }]}>{a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {product.available ? (
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              added && styles.addBtnSuccess,
              { opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={handleAddToCart}
            testID="add-to-cart-btn"
          >
            <Ionicons name={added ? 'checkmark' : 'bag-add-outline'} size={20} color="#fff" />
            <Text style={styles.addBtnText}>
              {added
                ? t('Added!', 'تمت الإضافة!')
                : `${t('Add to Bag', 'أضف للسلة')} — ${(Number(product.price) * qty).toFixed(2)} ${t('SAR', 'ر.س')}`
              }
            </Text>
          </Pressable>
        ) : (
          <View style={styles.unavailableBanner}>
            <Text style={styles.unavailableText}>{t('Currently unavailable', 'غير متوفر حالياً')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
