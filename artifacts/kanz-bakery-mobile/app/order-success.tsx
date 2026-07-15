import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderSuccessScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: topPad,
      paddingBottom: bottomPad,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#E8F5E9',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 26,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 8,
    },
    orderIdText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: 'DMSans_600SemiBold',
      textAlign: 'center',
      marginBottom: 32,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      width: '100%',
      gap: 14,
      marginBottom: 28,
    },
    infoRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
    },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 32,
      alignItems: 'center',
      width: '100%',
      marginBottom: 12,
    },
    primaryBtnText: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
    },
    secondaryBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 32,
      alignItems: 'center',
      width: '100%',
    },
    secondaryBtnText: {
      fontSize: 15,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={52} color="#2D7A2D" />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim, alignItems: 'center', width: '100%' }}>
        <Text style={styles.title}>{t('Order Placed!', 'تم الطلب!')}</Text>
        <Text style={styles.subtitle}>
          {t(
            'Your order has been received and is being prepared with love.',
            'تم استلام طلبك وجارٍ تحضيره بعناية.',
          )}
        </Text>
        {orderId && (
          <Text style={styles.orderIdText}>
            {t('Order', 'طلب')} #{orderId}
          </Text>
        )}

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {t('Estimated preparation: 30–45 min', 'وقت التحضير المتوقع: ٣٠–٤٥ دقيقة')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {t('Confirmation sent to your email', 'تم إرسال التأكيد إلى بريدك الإلكتروني')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {t('We\'ll call you when ready', 'سنتصل بك عند الجاهزية')}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.9 : 1 }]}
          onPress={() => router.replace('/(tabs)/menu')}
          testID="continue-shopping-btn"
        >
          <Text style={styles.primaryBtnText}>{t('Continue Shopping', 'مواصلة التسوق')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.9 : 1 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.secondaryBtnText}>{t('Back to Home', 'العودة للرئيسية')}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
