import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart, CartItem } from '@/context/CartContext';

export default function CartScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 24,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    countBadge: {
      backgroundColor: colors.muted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    countText: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.mutedForeground,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 100,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: 'center',
    },
    browseBtn: {
      marginTop: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
    },
    browseBtnText: {
      fontSize: 14,
      fontFamily: 'DMSans_600SemiBold',
      color: '#fff',
    },
    itemRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemImage: {
      width: 80,
      height: 80,
      backgroundColor: colors.muted,
    },
    itemBody: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    itemName: {
      fontSize: 14,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    itemPrice: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
    },
    itemFooter: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    qtyRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    qtyBtn: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText: {
      fontSize: 14,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      minWidth: 20,
      textAlign: 'center',
    },
    lineTotal: {
      fontSize: 14,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    deleteBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      justifyContent: 'center',
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: bottomPad + (Platform.OS === 'web' ? 84 : 16),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      gap: 12,
    },
    summaryRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
    },
    summaryValue: {
      fontSize: 14,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
    },
    totalRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    totalLabel: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    totalValue: {
      fontSize: 18,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    checkoutBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      gap: 8,
    },
    checkoutBtnText: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
    },
  });

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemRow}>
      <Image
        source={{ uri: item.imageUrl ?? undefined }}
        style={styles.itemImage}
        contentFit="cover"
      />
      <View style={styles.itemBody}>
        <View>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>{Number(item.price).toFixed(2)} {t('SAR each', 'ر.س / قطعة')}</Text>
        </View>
        <View style={styles.itemFooter}>
          <View style={styles.qtyRow}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={colors.foreground} />
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={colors.foreground} />
            </Pressable>
          </View>
          <Text style={styles.lineTotal}>{(Number(item.price) * item.quantity).toFixed(2)} {t('SAR', 'ر.س')}</Text>
        </View>
      </View>
      <Pressable style={styles.deleteBtn} onPress={() => removeItem(item.productId)}>
        <Feather name="trash-2" size={16} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('My Bag', 'سلتي')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
          <Text style={styles.emptyTitle}>{t('Your bag is empty', 'سلتك فارغة')}</Text>
          <Text style={styles.emptyText}>
            {t('Add some delicious items from the menu', 'أضف بعض المنتجات اللذيذة من القائمة')}
          </Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.browseBtnText}>{t('Browse Menu', 'تصفح القائمة')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('My Bag', 'سلتي')}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemCount} {t('items', 'منتج')}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.productId)}
        renderItem={renderItem}
        scrollEnabled={!!items.length}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('Subtotal', 'المجموع الفرعي')}</Text>
          <Text style={styles.summaryValue}>{subtotal.toFixed(2)} {t('SAR', 'ر.س')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('Delivery', 'التوصيل')}</Text>
          <Text style={styles.summaryValue}>{t('Calculated at checkout', 'يحسب عند الدفع')}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('Total', 'الإجمالي')}</Text>
          <Text style={styles.totalValue}>{subtotal.toFixed(2)} {t('SAR', 'ر.س')}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.9 : 1 }]}
          onPress={() => router.push('/checkout')}
          testID="checkout-btn"
        >
          <Text style={styles.checkoutBtnText}>{t('Proceed to Checkout', 'المتابعة للدفع')}</Text>
          <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
