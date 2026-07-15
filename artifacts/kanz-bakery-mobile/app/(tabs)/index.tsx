import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import {
  useGetFeaturedProducts,
  useGetCatalogStats,
  useListCategories,
} from '@workspace/api-client-react';

export default function HomeScreen() {
  const colors = useColors();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: featured, isLoading: featuredLoading, refetch: refetchFeatured } = useGetFeaturedProducts();
  const { data: stats, refetch: refetchStats } = useGetCatalogStats();
  const { data: categories, refetch: refetchCats } = useListCategories();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchStats(), refetchCats()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchStats, refetchCats]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 12,
      paddingHorizontal: 20,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
    },
    logoText: {
      fontSize: 22,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
      letterSpacing: -0.5,
    },
    logoSub: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
    },
    headerActions: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
    },
    cartBtn: {
      position: 'relative',
      padding: 4,
    },
    cartBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontFamily: 'DMSans_700Bold',
    },
    langBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    langText: {
      fontSize: 12,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
    },
    hero: {
      marginHorizontal: 20,
      marginTop: 8,
      borderRadius: 12,
      overflow: 'hidden',
      height: 180,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(20, 10, 0, 0.42)',
      justifyContent: 'flex-end',
      padding: 16,
    },
    heroTitle: {
      fontSize: 22,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
      textAlign: isRTL ? 'right' : 'left',
    },
    heroSub: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.85)',
      fontFamily: 'DMSans_400Regular',
      marginTop: 2,
      textAlign: isRTL ? 'right' : 'left',
    },
    orderBtn: {
      marginTop: 10,
      alignSelf: isRTL ? 'flex-start' : 'flex-end',
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 7,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 4,
    },
    orderBtnText: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
      color: '#fff',
    },
    sectionHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 17,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    seeAllText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: 'DMSans_600SemiBold',
    },
    statsRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      paddingHorizontal: 20,
      gap: 10,
      marginTop: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statNum: {
      fontSize: 22,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      marginTop: 2,
      textAlign: 'center',
    },
    catScroll: {
      paddingHorizontal: 20,
      paddingBottom: 4,
    },
    catCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
      minWidth: 80,
    },
    catCardText: {
      fontSize: 12,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
      textAlign: 'center',
    },
    bottomPad: {
      height: Platform.OS === 'web' ? 34 + 84 : 100,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Kanz Bakery</Text>
          <Text style={styles.logoSub}>{t('Artisan • Riyadh', 'حرفي • الرياض')}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.langBtn}
            onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          >
            <Text style={styles.langText}>{language === 'en' ? 'AR' : 'EN'}</Text>
          </Pressable>
          <Pressable style={styles.cartBtn} onPress={() => router.push('/(tabs)/cart')}>
            <Feather name="shopping-bag" size={22} color={colors.foreground} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={require('@/assets/images/hero.jpg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{t('Baked with Love', 'مخبوز بحب')}</Text>
            <Text style={styles.heroSub}>{t('Fresh daily — delivered to your door', 'طازج يومياً — يوصل لبابك')}</Text>
            <Pressable style={({ pressed }) => [styles.orderBtn, { opacity: pressed ? 0.85 : 1 }]} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.orderBtnText}>{t('Order Now', 'اطلب الآن')}</Text>
              <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{stats.totalProducts}+</Text>
              <Text style={styles.statLabel}>{t('Products', 'منتج')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{stats.totalCategories}</Text>
              <Text style={styles.statLabel}>{t('Categories', 'فئة')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{Number(stats.averageRating).toFixed(1)}</Text>
              <Text style={styles.statLabel}>{t('Avg Rating', 'التقييم')}</Text>
            </View>
          </View>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('Browse by Category', 'تصفح حسب الفئة')}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.catScroll, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={({ pressed }) => [styles.catCard, { opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => router.push({ pathname: '/(tabs)/menu', params: { categoryId: cat.id } })}
                >
                  <Text style={styles.catCardText}>{cat.name}</Text>
                  <Text style={[styles.catCardText, { color: colors.mutedForeground, fontSize: 10, marginTop: 2 }]}>
                    {cat.productCount} {t('items', 'منتج')}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('Featured', 'المميزة')}</Text>
          <Pressable onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.seeAllText}>{t('See all', 'عرض الكل')}</Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={featuredLoading ? Array(4).fill(null) : (featured ?? [])}
          keyExtractor={(item, idx) => (item ? String(item.id) : String(idx))}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!!(featured?.length)}
          renderItem={({ item }) =>
            item ? <ProductCard product={item} /> : <ProductCardSkeleton />
          }
        />

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}
