import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions, FlatList, Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, MapPin, Star, Bell, ChevronRight, Clock, Zap, TrendingUp, Heart } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { DEMO_SALONS, DEMO_BOOKINGS, DEMO_USER } from '@/data/demo';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Salon } from '@/types/models';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',     name: 'All',     icon: '🌟', color: '#6366F1' },
  { id: 'hair',    name: 'Haircut', icon: '✂️', color: '#8B5CF6' },
  { id: 'facial',  name: 'Facial',  icon: '🧖', color: '#EC4899' },
  { id: 'spa',     name: 'Spa',     icon: '💆', color: '#06B6D4' },
  { id: 'nails',   name: 'Nails',   icon: '💅', color: '#F59E0B' },
  { id: 'makeup',  name: 'Makeup',  icon: '💄', color: '#EF4444' },
  { id: 'massage', name: 'Massage', icon: '🤲', color: '#10B981' },
];

const OFFERS = [
  { id: 'o1', title: '20% Off This Weekend!',  sub: 'Code: WEEKEND20',  emoji: '🎉', bg: '#6366F1', accent: '#818CF8' },
  { id: 'o2', title: 'Free Hair Spa Today',    sub: 'On orders above ₹999', emoji: '✨', bg: '#EC4899', accent: '#F472B6' },
  { id: 'o3', title: 'Refer & Earn ₹100',      sub: 'Per successful referral', emoji: '🎁', bg: '#10B981', accent: '#34D399' },
];

const QUICK_ACTIONS = [
  { id: 'book',   label: 'Book Now',    icon: Zap,        color: '#6366F1', bg: '#EEF2FF' },
  { id: 'near',   label: 'Near Me',     icon: MapPin,     color: '#EC4899', bg: '#FCE7F3' },
  { id: 'top',    label: 'Top Rated',   icon: TrendingUp, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'fav',    label: 'Favourites',  icon: Heart,      color: '#EF4444', bg: '#FEE2E2' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const OfferBanner = ({ item, onPress }: { item: typeof OFFERS[0]; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.offerCard, { backgroundColor: item.bg }]}>
    <View style={[styles.offerCircle, { backgroundColor: item.accent }]} />
    <View style={[styles.offerCircle2, { backgroundColor: item.accent }]} />
    <Text style={styles.offerEmoji}>{item.emoji}</Text>
    <View style={styles.offerText}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerSub}>{item.sub}</Text>
    </View>
    <View style={styles.offerArrow}>
      <ChevronRight size={18} color="white" />
    </View>
  </TouchableOpacity>
);

const SalonCardHorizontal = ({ item, onPress }: { item: Salon; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.salonCardH}>
    <View style={styles.salonImageH}>
      <Text style={styles.salonEmojiH}>🏪</Text>
      <View style={styles.ratingBadge}>
        <Star size={10} color="#FFF" fill="#FFF" />
        <Text style={styles.ratingBadgeText}>{item.rating}</Text>
      </View>
    </View>
    <View style={styles.salonInfoH}>
      <Text style={styles.salonNameH} numberOfLines={1}>{item.name}</Text>
      <View style={styles.salonMetaRow}>
        <MapPin size={11} color={colors.textSecondary} />
        <Text style={styles.salonMetaText}>{item.distance} km</Text>
      </View>
      <Text style={styles.salonAddrH} numberOfLines={1}>{item.addressLine1}</Text>
      <View style={styles.salonFooterH}>
        <Text style={styles.salonReviewsH}>({item.totalReviews} reviews)</Text>
        <View style={styles.openBadge}>
          <Text style={styles.openText}>Open</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const SalonCardVertical = ({ item, onPress }: { item: Salon; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.salonCardV}>
    <View style={styles.salonImageV}>
      <Text style={styles.salonEmojiV}>🏪</Text>
      <View style={styles.distanceBadge}>
        <MapPin size={10} color={colors.primary} />
        <Text style={styles.distanceBadgeText}>{item.distance} km</Text>
      </View>
    </View>
    <View style={styles.salonInfoV}>
      <Text style={styles.salonNameV} numberOfLines={1}>{item.name}</Text>
      <View style={styles.salonMetaRow}>
        <Star size={12} color={colors.warning} fill={colors.warning} />
        <Text style={styles.salonRatingV}>{item.rating}</Text>
        <Text style={styles.salonDotV}>·</Text>
        <Text style={styles.salonReviewsV}>{item.totalReviews} reviews</Text>
      </View>
      <Text style={styles.salonAddrV} numberOfLines={1}>{item.addressLine1}, {item.city}</Text>
      <View style={styles.bookNowRow}>
        <Text style={styles.bookNowText}>Book Now →</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user) ?? DEMO_USER;
  const [selectedCat, setSelectedCat] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [offerIdx, setOfferIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const unreadNotifs = useNotificationStore((s) => s.unreadCount());
  const upcomingBooking = DEMO_BOOKINGS.find((b) => b.status === BookingStatus.CONFIRMED);

  const nearbySalons = [...DEMO_SALONS].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  const topRatedSalons = [...DEMO_SALONS].sort((a, b) => b.rating - a.rating);
  const filteredSalons = selectedCat === 'all' ? nearbySalons : nearbySalons.slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'book' || id === 'near' || id === 'top' || id === 'fav') {
      navigation.navigate('SalonList', {});
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Sticky Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{user.name?.charAt(0) ?? 'P'}</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>{greeting()},</Text>
            <Text style={styles.userName}>{user.name?.split(' ')[0] ?? 'There'} 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' })}
          >
            <Bell size={22} color={colors.textPrimary} />
            {unreadNotifs > 0 && (
              <View style={styles.notifDot}>
                <Text style={styles.notifDotText}>{unreadNotifs}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Location Bar ── */}
      <View style={styles.locationBar}>
        <MapPin size={14} color={colors.primary} />
        <Text style={styles.locationText}>Ahmedabad, Gujarat</Text>
        <View style={styles.locationDot} />
        <Text style={styles.locationSub}>12 salons nearby</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ── Search Bar ── */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')} activeOpacity={0.8}>
          <View style={styles.searchIcon}>
            <Search size={18} color={colors.primary} />
          </View>
          <Text style={styles.searchPlaceholder}>Search salons, services, staff...</Text>
          <View style={styles.searchFilter}>
            <Text style={styles.searchFilterText}>Filter</Text>
          </View>
        </TouchableOpacity>

        {/* ── Upcoming Booking Banner ── */}
        {upcomingBooking && (
          <TouchableOpacity
            style={styles.upcomingCard}
            onPress={() => navigation.getParent()?.navigate('BookingsTab', { screen: 'BookingDetail', params: { id: upcomingBooking.id } })}
            activeOpacity={0.85}
          >
            <View style={styles.upcomingLeft}>
              <View style={styles.upcomingDot} />
              <View>
                <Text style={styles.upcomingLabel}>Upcoming Appointment</Text>
                <Text style={styles.upcomingSalon}>{upcomingBooking.salonName}</Text>
                <Text style={styles.upcomingTime}>
                  {new Date(upcomingBooking.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {'  ·  '}{upcomingBooking.startTime}
                </Text>
              </View>
            </View>
            <View style={styles.upcomingRight}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.upcomingStatus}>Confirmed</Text>
              <ChevronRight size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
        )}

        {/* ── Offer Banners ── */}
        <View style={styles.offerSection}>
          <FlatList
            data={OFFERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            onMomentumScrollEnd={(e) => setOfferIdx(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))}
            renderItem={({ item }) => (
              <OfferBanner item={item} onPress={() => navigation.navigate('SalonList', {})} />
            )}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
          <View style={styles.offerDots}>
            {OFFERS.map((_, i) => (
              <View key={i} style={[styles.offerDot, offerIdx === i && styles.offerDotActive]} />
            ))}
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.quickSection}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickItem}
              onPress={() => handleQuickAction(action.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: action.bg }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Categories ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {CATEGORIES.map((cat) => {
              const active = selectedCat === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, active && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => setSelectedCat(cat.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                  <Text style={[styles.catName, active && styles.catNameActive]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Top Rated — Horizontal Scroll ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Top Rated</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SalonList', {})} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={topRatedSalons}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <SalonCardHorizontal
                item={item}
                onPress={() => navigation.navigate('SalonDetail', { id: item.id })}
              />
            )}
          />
        </View>

        {/* ── Nearby Salons — Vertical ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Nearby Salons</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SalonList', {})} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {filteredSalons.slice(0, 4).map((item) => (
            <SalonCardVertical
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('SalonDetail', { id: item.id })}
            />
          ))}
        </View>

        {/* ── Stats Banner ── */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>50+</Text>
            <Text style={styles.statLabel}>Salons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>200+</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>5K+</Text>
            <Text style={styles.statLabel}>Happy Clients</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 10, backgroundColor: 'white' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarSmallText: { fontSize: 16, fontWeight: '700', color: 'white' },
  greetingText: { fontSize: 12, color: colors.textSecondary },
  userName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  headerRight: { flexDirection: 'row', gap: 8 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center' },
  notifDotText: { fontSize: 9, fontWeight: '700', color: 'white' },

  // Location
  locationBar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  locationText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  locationDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textTertiary, marginHorizontal: 4 },
  locationSub: { fontSize: 13, color: colors.textSecondary },

  // Search
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginBottom: 12, padding: 12, backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  searchIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  searchPlaceholder: { flex: 1, fontSize: 14, color: colors.textSecondary },
  searchFilter: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primaryLight, borderRadius: 8 },
  searchFilterText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // Upcoming Booking
  upcomingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, padding: 14, backgroundColor: '#FFFBEB', borderRadius: 14, borderLeftWidth: 4, borderLeftColor: colors.warning },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  upcomingLabel: { fontSize: 11, fontWeight: '600', color: colors.warning, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  upcomingSalon: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  upcomingTime: { fontSize: 12, color: colors.textSecondary },
  upcomingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  upcomingStatus: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // Offers
  offerSection: { marginBottom: 8 },
  offerCard: { width: width - 64, borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  offerCircle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, right: -30, top: -40, opacity: 0.35 },
  offerCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, right: 40, bottom: -30, opacity: 0.25 },
  offerEmoji: { fontSize: 36, marginRight: 14 },
  offerText: { flex: 1 },
  offerTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 4 },
  offerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  offerArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  offerDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 10 },
  offerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  offerDotActive: { width: 18, backgroundColor: colors.primary },

  // Quick Actions
  quickSection: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 16 },
  quickItem: { alignItems: 'center', gap: 6, flex: 1 },
  quickIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },

  // Section
  section: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.primary },

  // Categories
  catList: { paddingLeft: 16, paddingRight: 8, gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: 'white', borderRadius: 22, borderWidth: 1.5, borderColor: colors.border },
  catEmoji: { fontSize: 16 },
  catName: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  catNameActive: { color: 'white' },

  // Salon Horizontal Card
  hList: { paddingLeft: 16, paddingRight: 8, paddingBottom: 4, gap: 12 },
  salonCardH: { width: 160, backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  salonImageH: { height: 110, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  salonEmojiH: { fontSize: 44 },
  ratingBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: colors.warning, borderRadius: 10 },
  ratingBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  salonInfoH: { padding: 10 },
  salonNameH: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  salonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  salonMetaText: { fontSize: 11, color: colors.textSecondary },
  salonAddrH: { fontSize: 11, color: colors.textTertiary, marginBottom: 6 },
  salonFooterH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salonReviewsH: { fontSize: 11, color: colors.textSecondary },
  openBadge: { paddingHorizontal: 7, paddingVertical: 2, backgroundColor: '#DCFCE7', borderRadius: 6 },
  openText: { fontSize: 10, fontWeight: '700', color: colors.success },

  // Salon Vertical Card
  salonCardV: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  salonImageV: { width: 100, height: 100, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  salonEmojiV: { fontSize: 40 },
  distanceBadge: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'white', borderRadius: 8 },
  distanceBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  salonInfoV: { flex: 1, padding: 12, justifyContent: 'center' },
  salonNameV: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  salonRatingV: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  salonDotV: { fontSize: 13, color: colors.textSecondary, marginHorizontal: 2 },
  salonReviewsV: { fontSize: 12, color: colors.textSecondary },
  salonAddrV: { fontSize: 12, color: colors.textSecondary, marginTop: 3, marginBottom: 8 },
  bookNowRow: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.primaryLight, borderRadius: 8 },
  bookNowText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // Stats Banner
  statsBanner: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, padding: 20, backgroundColor: colors.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'space-between' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 2 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.25)' },
});
