import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import CategoryChip from '@/components/CategoryChip';
import { ListItemSkeleton } from '@/components/SkeletonLoader';
import {
  useListCategories,
  useListProducts,
} from '@workspace/api-client-react';

export default function MenuScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const { addItem } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    params.categoryId ? Number(params.categoryId) : undefined,
  );
  const [refreshing, setRefreshing] = useState(false);

  const { data: categories } = useListCategories();
  const { data: productsData, isLoading, refetch } = useListProducts({
    categoryId: selectedCategoryId,
    search: search.trim() || undefined,
    available: true,
    limit: 50,
  });

  const products = productsData?.items ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 8,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    searchRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      marginTop: 12,
      height: 44,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
    },
    catRow: {
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    catContent: {
      gap: 0,
    },
    productItem: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    productImage: {
      width: 88,
      height: 88,
      backgroundColor: colors.muted,
    },
    productBody: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 14,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    productCat: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      marginTop: 2,
      textAlign: isRTL ? 'right' : 'left',
    },
    productFooter: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    productPrice: {
      fontSize: 15,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    addBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ratingRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 3,
    },
    ratingText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      gap: 10,
    },
    emptyText: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: 'center',
    },
    bottomPad: { height: Platform.OS === 'web' ? 34 + 84 : 100 },
  });

  const renderProduct = ({ item: product }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [styles.productItem, { opacity: pressed ? 0.9 : 1 }]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
    >
      <Image
        source={{ uri: product.imageUrl ?? undefined }}
        style={styles.productImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.productBody}>
        <View>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productCat}>{product.categoryName}</Text>
          {product.reviewCount > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={10} color="#E09A18" />
              <Text style={styles.ratingText}>{Number(product.averageRating).toFixed(1)}</Text>
            </View>
          )}
        </View>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{Number(product.price).toFixed(2)} {t('SAR', 'ر.س')}</Text>
          {product.available ? (
            <Pressable
              style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
              onPress={() => {
                addItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  categoryName: product.categoryName,
                });
              }}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </Pressable>
          ) : (
            <Text style={[styles.ratingText, { fontSize: 12 }]}>{t('Sold out', 'نفد')}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Menu', 'القائمة')}</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('Search products…', 'ابحث عن المنتجات…')}
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catRow}
        contentContainerStyle={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
      >
        <CategoryChip
          label={t('All', 'الكل')}
          active={!selectedCategoryId}
          onPress={() => setSelectedCategoryId(undefined)}
        />
        {(categories ?? []).map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.name}
            active={selectedCategoryId === cat.id}
            onPress={() => setSelectedCategoryId(cat.id === selectedCategoryId ? undefined : cat.id)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={isLoading ? Array(6).fill(null) : products}
        keyExtractor={(item, idx) => (item ? String(item.id) : String(idx))}
        renderItem={({ item }) => (item ? renderProduct({ item }) : <ListItemSkeleton />)}
        scrollEnabled={!!products.length || isLoading}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={40} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>
                {t('No products found', 'لا توجد منتجات')}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={styles.bottomPad} />}
        contentContainerStyle={{ paddingTop: 4 }}
      />
    </View>
  );
}
