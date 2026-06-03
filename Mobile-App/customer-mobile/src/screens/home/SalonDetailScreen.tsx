import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, MapPin, Clock, Phone, Star } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { DEMO_SALONS, DEMO_SERVICES, DEMO_STAFF, DEMO_REVIEWS, SALON_AMENITIES, SALON_HOURS } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'SalonDetail'>;
const { width } = Dimensions.get('window');

export default function SalonDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'reviews'>('services');

  const salon = DEMO_SALONS.find((s) => s.id === id) ?? DEMO_SALONS[0];
  const services = DEMO_SERVICES[id] ?? DEMO_SERVICES.default;
  const staff = DEMO_STAFF[id] ?? DEMO_STAFF.default;
  const reviews = DEMO_REVIEWS.filter((r) => r.salonId === id).concat(DEMO_REVIEWS).slice(0, 3);
  const amenities = SALON_AMENITIES[id] ?? SALON_AMENITIES.default;

  const serviceCategories = [...new Set(services.map((s) => s.categoryId))];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>🏪</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconButton}>
              <Heart size={20} color={isFavorite ? colors.error : colors.textPrimary} fill={isFavorite ? colors.error : 'none'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.salonName}>{salon.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={16} color={colors.warning} fill={colors.warning} />
            <Text style={styles.rating}>{salon.rating}</Text>
            <Text style={styles.reviewCount}>({salon.totalReviews} reviews)</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{salon.addressLine1}, {salon.city}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{SALON_HOURS}</Text>
          </View>
          <View style={styles.detailRow}>
            <Phone size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{salon.phone}</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{salon.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.map((a) => (
              <View key={a} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['services', 'staff', 'reviews'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <View style={styles.section}>
            {serviceCategories.map((cat) => (
              <View key={cat} style={styles.categoryBlock}>
                <Text style={styles.categoryTitle}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                {services.filter((s) => s.categoryId === cat).map((service) => (
                  <View key={service.id} style={styles.serviceItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceMeta}>{service.duration} min · {service.description}</Text>
                    </View>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <View style={styles.section}>
            {staff.map((member) => (
              <View key={member.id} style={styles.staffCard}>
                <View style={[styles.staffAvatar, !member.isAvailable && styles.staffAvatarUnavailable]}>
                  <Text style={styles.staffAvatarText}>{member.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.staffHeader}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    {!member.isAvailable && (
                      <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableText}>Unavailable</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.staffSpec}>{member.specialization}</Text>
                  <Text style={styles.staffBio}>{member.bio}</Text>
                  <View style={styles.staffMeta}>
                    <Star size={13} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.staffMetaText}>{member.rating} · {member.totalBookings} bookings</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <View style={styles.section}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{review.user?.name?.charAt(0) ?? 'U'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewerName}>{review.user?.name ?? 'Customer'}</Text>
                    <View style={styles.stars}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} color={colors.warning} fill={colors.warning} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Book Appointment"
          onPress={() => navigation.navigate('ServiceSelection', { salonId: id })}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { width, height: 240, position: 'relative' },
  imagePlaceholder: { width: '100%', height: '100%', backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  imageIcon: { fontSize: 72 },
  headerButtons: { position: 'absolute', top: 56, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3 },
  infoSection: { padding: 16, borderBottomWidth: 8, borderBottomColor: colors.background },
  salonName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  rating: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  reviewCount: { fontSize: 14, color: colors.textSecondary },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  detailText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  section: { padding: 16, borderBottomWidth: 8, borderBottomColor: colors.background },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  aboutText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.background, borderRadius: 20 },
  amenityText: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  categoryBlock: { marginBottom: 16 },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  serviceMeta: { fontSize: 13, color: colors.textSecondary },
  servicePrice: { fontSize: 15, fontWeight: '700', color: colors.primary },
  staffCard: { flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  staffAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  staffAvatarUnavailable: { backgroundColor: colors.gray300 },
  staffAvatarText: { fontSize: 20, fontWeight: '700', color: 'white' },
  staffHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  staffName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  unavailableBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.errorLight, borderRadius: 10 },
  unavailableText: { fontSize: 11, color: colors.error, fontWeight: '600' },
  staffSpec: { fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 2 },
  staffBio: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  staffMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  staffMetaText: { fontSize: 13, color: colors.textSecondary },
  reviewCard: { marginBottom: 14, padding: 14, backgroundColor: colors.background, borderRadius: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontSize: 16, fontWeight: '700', color: 'white' },
  reviewerName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  stars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontSize: 12, color: colors.textTertiary },
  reviewText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: 'white' },
});
