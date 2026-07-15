import React, { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import BranchMap from '@/components/BranchMap';

interface BranchHours {
  daysEn: string;
  daysAr: string;
  hoursEn: string;
  hoursAr: string;
}

interface Branch {
  id: number;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  hours: BranchHours[];
  servicesEn: string[];
  servicesAr: string[];
}

const branches: Branch[] = [
  {
    id: 1,
    nameEn: 'Al Nakheel Branch',
    nameAr: 'فرع النخيل',
    addressEn: 'Nakheel Mall, Northern Ring Road, Al Nakheel, Riyadh 13312',
    addressAr: 'نخيل مول، طريق الدائري الشمالي، حي النخيل، الرياض ١٣٣١٢',
    lat: 24.7558,
    lng: 46.6547,
    phone: '+966 11 234 5678',
    email: 'nakheel@kanzbakery.com',
    hours: [
      { daysEn: 'Sat – Thu', daysAr: 'السبت – الخميس', hoursEn: '8:00 AM – 10:00 PM', hoursAr: '٨:٠٠ ص – ١٠:٠٠ م' },
      { daysEn: 'Friday', daysAr: 'الجمعة', hoursEn: '2:00 PM – 10:00 PM', hoursAr: '٢:٠٠ م – ١٠:٠٠ م' },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery', 'Catering Orders'],
    servicesAr: ['تناول في المكان', 'استلام شخصي', 'توصيل', 'طلبات التموين'],
  },
  {
    id: 2,
    nameEn: 'Al Olaya Branch',
    nameAr: 'فرع العليا',
    addressEn: 'Olaya Street, Al Olaya District, Riyadh 12211',
    addressAr: 'شارع العليا، حي العليا، الرياض ١٢٢١١',
    lat: 24.6877,
    lng: 46.6822,
    phone: '+966 11 234 5679',
    email: 'olaya@kanzbakery.com',
    hours: [
      { daysEn: 'Sat – Thu', daysAr: 'السبت – الخميس', hoursEn: '7:00 AM – 10:00 PM', hoursAr: '٧:٠٠ ص – ١٠:٠٠ م' },
      { daysEn: 'Friday', daysAr: 'الجمعة', hoursEn: '2:00 PM – 10:00 PM', hoursAr: '٢:٠٠ م – ١٠:٠٠ م' },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery', 'Catering Orders', 'Custom Cakes'],
    servicesAr: ['تناول في المكان', 'استلام شخصي', 'توصيل', 'طلبات التموين', 'كعكات مخصصة'],
  },
  {
    id: 3,
    nameEn: 'Hittin Branch',
    nameAr: 'فرع حطين',
    addressEn: 'King Abdullah Road, Hittin District, Riyadh 13516',
    addressAr: 'طريق الملك عبدالله، حي حطين، الرياض ١٣٥١٦',
    lat: 24.742,
    lng: 46.588,
    phone: '+966 11 234 5680',
    email: 'hittin@kanzbakery.com',
    hours: [
      { daysEn: 'Sat – Thu', daysAr: 'السبت – الخميس', hoursEn: '8:00 AM – 9:00 PM', hoursAr: '٨:٠٠ ص – ٩:٠٠ م' },
      { daysEn: 'Friday', daysAr: 'الجمعة', hoursEn: '2:00 PM – 9:00 PM', hoursAr: '٢:٠٠ م – ٩:٠٠ م' },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery'],
    servicesAr: ['تناول في المكان', 'استلام شخصي', 'توصيل'],
  },
];

export default function FindUsScreen() {
  const colors = useColors();
  const { t, isRTL, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<number>(1);

  const selected = branches.find((b) => b.id === selectedId) ?? branches[0];
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    subtitle: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      marginTop: 2,
      textAlign: isRTL ? 'right' : 'left',
    },
    branchList: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 10,
    },
    branchCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      padding: 14,
    },
    branchCardSelected: {
      borderColor: colors.primary,
    },
    branchCardUnselected: {
      borderColor: colors.border,
    },
    branchHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    branchName: {
      fontSize: 15,
      fontFamily: 'DMSans_700Bold',
      color: colors.foreground,
      textAlign: isRTL ? 'right' : 'left',
    },
    branchDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    infoRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 6,
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_400Regular',
      textAlign: isRTL ? 'right' : 'left',
      lineHeight: 17,
    },
    hoursSection: {
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 8,
      gap: 3,
    },
    hourRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    hourLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: 'DMSans_600SemiBold',
    },
    hourValue: {
      fontSize: 12,
      color: colors.foreground,
      fontFamily: 'DMSans_400Regular',
    },
    servicesRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 10,
    },
    serviceTag: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    serviceText: {
      fontSize: 11,
      fontFamily: 'DMSans_500Medium',
      color: colors.accentForeground,
    },
    actionRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 10,
      marginTop: 12,
    },
    actionBtn: {
      flex: 1,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 9,
      borderRadius: 8,
      borderWidth: 1,
    },
    callBtn: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    mapBtn: {
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    actionBtnText: {
      fontSize: 13,
      fontFamily: 'DMSans_600SemiBold',
    },
    bottomPad: { height: bottomPad + (Platform.OS === 'web' ? 84 : 16) },
  });

  const openMaps = (branch: Branch) => {
    const url = Platform.select({
      ios: `maps:?q=${branch.lat},${branch.lng}`,
      android: `geo:${branch.lat},${branch.lng}?q=${encodeURIComponent(language === 'ar' ? branch.nameAr : branch.nameEn)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const mapBranches = branches.map((b) => ({
    id: b.id,
    lat: b.lat,
    lng: b.lng,
    name: language === 'ar' ? b.nameAr : b.nameEn,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Find Us', 'فروعنا')}</Text>
        <Text style={styles.subtitle}>{t('3 branches across Riyadh', '٣ فروع في الرياض')}</Text>
      </View>

      <BranchMap
        branches={mapBranches}
        selectedId={selectedId}
        onMarkerPress={setSelectedId}
        selectedLat={selected.lat}
        selectedLng={selected.lng}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.branchList}>
          {branches.map((branch) => (
            <Pressable
              key={branch.id}
              style={[
                styles.branchCard,
                branch.id === selectedId ? styles.branchCardSelected : styles.branchCardUnselected,
              ]}
              onPress={() => setSelectedId(branch.id)}
            >
              <View style={styles.branchHeader}>
                <Text style={styles.branchName}>
                  {language === 'ar' ? branch.nameAr : branch.nameEn}
                </Text>
                {branch.id === selectedId && <View style={styles.branchDot} />}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.infoText}>
                  {language === 'ar' ? branch.addressAr : branch.addressEn}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.infoText}>{branch.phone}</Text>
              </View>

              {branch.id === selectedId && (
                <>
                  <View style={styles.hoursSection}>
                    {branch.hours.map((h, idx) => (
                      <View key={idx} style={styles.hourRow}>
                        <Text style={styles.hourLabel}>
                          {language === 'ar' ? h.daysAr : h.daysEn}
                        </Text>
                        <Text style={styles.hourValue}>
                          {language === 'ar' ? h.hoursAr : h.hoursEn}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.servicesRow}>
                    {(language === 'ar' ? branch.servicesAr : branch.servicesEn).map((s, idx) => (
                      <View key={idx} style={styles.serviceTag}>
                        <Text style={styles.serviceText}>{s}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={({ pressed }) => [styles.actionBtn, styles.callBtn, { opacity: pressed ? 0.85 : 1 }]}
                      onPress={() => Linking.openURL(`tel:${branch.phone}`)}
                    >
                      <Ionicons name="call" size={14} color="#fff" />
                      <Text style={[styles.actionBtnText, { color: '#fff' }]}>
                        {t('Call', 'اتصل')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.actionBtn, styles.mapBtn, { opacity: pressed ? 0.85 : 1 }]}
                      onPress={() => openMaps(branch)}
                    >
                      <Feather name="navigation" size={14} color={colors.foreground} />
                      <Text style={[styles.actionBtnText, { color: colors.foreground }]}>
                        {t('Directions', 'الاتجاهات')}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}
