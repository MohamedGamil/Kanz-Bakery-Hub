import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

export default function CheckoutScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    stepsRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 8,
    },
    stepCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepText: {
      fontSize: 12,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
    },
    stepLabel: {
      fontSize: 12,
      fontFamily: 'DMSans_500Medium',
    },
    stepLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      marginBottom: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    inputLabel: {
      fontSize: 12,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.mutedForeground,
      marginBottom: 6,
      textAlign: isRTL ? 'right' : 'left',
    },
    input: {
      height: 46,
      borderWidth: 1,
      borderColor: colors.input,
      borderRadius: 8,
      paddingHorizontal: 14,
      fontSize: 14,
      fontFamily: 'DMSans_400Regular',
      color: colors.foreground,
      backgroundColor: colors.card,
      marginBottom: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    textArea: {
      height: 80,
      paddingTop: 12,
      textAlignVertical: 'top',
    },
    orderSummary: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 8,
    },
    summaryItem: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryName: {
      fontSize: 13,
      fontFamily: 'DMSans_400Regular',
      color: colors.foreground,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
    },
    summaryPrice: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
      color: colors.foreground,
    },
    totalDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    totalRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      paddingTop: 4,
    },
    totalLabel: {
      fontSize: 15,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
    },
    totalValue: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: colors.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: bottomPad + 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    proceedBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 8,
    },
    proceedBtnText: {
      fontSize: 16,
      fontFamily: 'DMSans_700Bold',
      color: '#fff',
    },
    webviewContainer: {
      flex: 1,
    },
  });

  const validateInfo = () => {
    if (!name.trim()) { Alert.alert(t('Required', 'مطلوب'), t('Please enter your name', 'الرجاء إدخال اسمك')); return false; }
    if (!email.trim() || !email.includes('@')) { Alert.alert(t('Required', 'مطلوب'), t('Please enter a valid email', 'الرجاء إدخال بريد إلكتروني صحيح')); return false; }
    return true;
  };

  const createPaymentIntent = async () => {
    if (!validateInfo()) return;
    setLoading(true);
    try {
      const [configRes, piRes] = await Promise.all([
        fetch(`${API_BASE}/api/stripe/config`),
        fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            customer: { name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim() },
          }),
        }),
      ]);

      const config = await configRes.json();
      const pi = await piRes.json();

      if (!piRes.ok) throw new Error(pi.error ?? 'Failed to create order');

      setPublishableKey(config.publishableKey);
      setClientSecret(pi.clientSecret);
      setOrderId(pi.orderId);
      setStep('payment');
    } catch (err: any) {
      Alert.alert(t('Error', 'خطأ'), err.message ?? t('Something went wrong', 'حدث خطأ'));
    } finally {
      setLoading(false);
    }
  };

  const stripeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'DM Sans', sans-serif; background: ${colors.background}; color: ${colors.foreground}; padding: 20px; }
    h3 { font-size: 17px; font-weight: 700; margin-bottom: 20px; }
    .amount { font-size: 24px; font-weight: 700; color: ${colors.primary}; margin-bottom: 20px; }
    #card-element { background: ${colors.card}; border: 1.5px solid ${colors.border}; border-radius: 10px; padding: 14px; margin-bottom: 20px; font-size: 16px; }
    #card-element.StripeElement--focus { border-color: ${colors.primary}; }
    #pay-btn { width: 100%; background: ${colors.primary}; color: #fff; border: none; border-radius: 12px; padding: 16px; font-size: 16px; font-weight: 700; cursor: pointer; }
    #pay-btn:disabled { opacity: 0.7; }
    #error { color: #C42424; font-size: 13px; margin-top: 10px; }
    .secure { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #888; margin-top: 14px; justify-content: center; }
  </style>
</head>
<body>
  <h3>${t('Complete Payment', 'إتمام الدفع')}</h3>
  <div class="amount">${subtotal.toFixed(2)} ${t('SAR', 'ر.س')}</div>
  <div id="card-element"></div>
  <button id="pay-btn">${t('Pay Now', 'ادفع الآن')}</button>
  <div id="error"></div>
  <div class="secure">🔒 ${t('Secured by Stripe', 'مؤمّن بواسطة Stripe')}</div>
  <script>
    var stripe = Stripe('${publishableKey}');
    var elements = stripe.elements();
    var card = elements.create('card', { style: { base: { fontSize: '16px', color: '${colors.foreground}', '::placeholder': { color: '${colors.mutedForeground}' } } } });
    card.mount('#card-element');
    document.getElementById('pay-btn').addEventListener('click', async function() {
      var btn = this;
      btn.disabled = true;
      btn.textContent = '${t('Processing...', 'جارٍ المعالجة...')}';
      document.getElementById('error').textContent = '';
      try {
        var result = await stripe.confirmCardPayment('${clientSecret}', {
          payment_method: { card: card, billing_details: { name: ${JSON.stringify(name.trim())}, email: ${JSON.stringify(email.trim())} } }
        });
        if (result.error) {
          document.getElementById('error').textContent = result.error.message;
          btn.disabled = false;
          btn.textContent = '${t('Pay Now', 'ادفع الآن')}';
        } else {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, paymentIntentId: result.paymentIntent.id }));
        }
      } catch(e) {
        document.getElementById('error').textContent = e.message || '${t('Payment failed', 'فشل الدفع')}';
        btn.disabled = false;
        btn.textContent = '${t('Pay Now', 'ادفع الآن')}';
      }
    });
  </script>
</body>
</html>
`;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.success) {
        clearCart();
        router.replace({ pathname: '/order-success', params: { orderId: String(orderId) } });
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => step === 'payment' ? setStep('info') : router.back()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('Checkout', 'الدفع')}</Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsRow}>
        <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
          <Text style={styles.stepText}>1</Text>
        </View>
        <Text style={[styles.stepLabel, { color: step === 'info' ? colors.primary : colors.mutedForeground }]}>
          {t('Info', 'البيانات')}
        </Text>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, { backgroundColor: step === 'payment' ? colors.primary : colors.muted }]}>
          <Text style={[styles.stepText, { color: step === 'payment' ? '#fff' : colors.mutedForeground }]}>2</Text>
        </View>
        <Text style={[styles.stepLabel, { color: step === 'payment' ? colors.primary : colors.mutedForeground }]}>
          {t('Payment', 'الدفع')}
        </Text>
      </View>

      {step === 'info' ? (
        <>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            bottomOffset={20}
            keyboardShouldPersistTaps="handled"
          >
            {/* Contact info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('Contact Information', 'معلومات التواصل')}</Text>
              <Text style={styles.inputLabel}>{t('Full Name *', 'الاسم الكامل *')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('Your name', 'اسمك')}
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Text style={styles.inputLabel}>{t('Email Address *', 'البريد الإلكتروني *')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('your@email.com', 'بريدك@الإلكتروني.com')}
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.inputLabel}>{t('Phone Number', 'رقم الهاتف')}</Text>
              <TextInput
                style={styles.input}
                placeholder="+966 5X XXX XXXX"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Text style={styles.inputLabel}>{t('Order Notes', 'ملاحظات الطلب')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('Allergies, special requests…', 'الحساسية، طلبات خاصة…')}
                placeholderTextColor={colors.mutedForeground}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>

            {/* Order summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('Order Summary', 'ملخص الطلب')}</Text>
              <View style={styles.orderSummary}>
                {items.map((item) => (
                  <View key={item.productId} style={styles.summaryItem}>
                    <Text style={styles.summaryName} numberOfLines={1}>
                      {item.quantity}× {item.name}
                    </Text>
                    <Text style={styles.summaryPrice}>
                      {(item.price * item.quantity).toFixed(2)} {t('SAR', 'ر.س')}
                    </Text>
                  </View>
                ))}
                <View style={styles.totalDivider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('Total', 'الإجمالي')}</Text>
                  <Text style={styles.totalValue}>{subtotal.toFixed(2)} {t('SAR', 'ر.س')}</Text>
                </View>
              </View>
            </View>

            <View style={{ height: 20 }} />
          </KeyboardAwareScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [styles.proceedBtn, { opacity: pressed ? 0.9 : 1 }]}
              onPress={createPaymentIntent}
              disabled={loading}
              testID="proceed-btn"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.proceedBtnText}>{t('Continue to Payment', 'المتابعة للدفع')}</Text>
                  <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#fff" />
                </>
              )}
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.webviewContainer}>
          <WebView
            source={{ html: stripeHtml }}
            onMessage={handleWebViewMessage}
            style={{ flex: 1, backgroundColor: colors.background }}
            javaScriptEnabled
          />
        </View>
      )}
    </View>
  );
}
