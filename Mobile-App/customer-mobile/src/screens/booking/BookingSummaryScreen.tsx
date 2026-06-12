import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Calendar, Clock, User, Tag, Check,
  ChevronRight, MapPin, Shield,
} from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS, DEMO_STAFF } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingSummary'>;

const STEP_LABELS = ['Services', 'Staff', 'Date & Time', 'Summary'];
const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  FLAT50: 0,   // flat ₹50
  WEEKEND20: 20,
};

function StepBar({ current }: { current: number }) {
  return (
    <View style={sb.wrap}>
      {STEP_LABELS.map((label, i) => {
        const done = i < current; const active = i === current;
        return (
          <React.Fragment key={i}>
            <View style={sb.step}>
              <View style={[sb.circle, done && sb.circleDone, active && sb.circleActive]}>
                {done ? <Check size={11} color="white" /> : <Text style={[sb.num, active && sb.numActive]}>{i + 1}</Text>}
              </View>
              <Text style={[sb.label, active && sb.labelActive, done && sb.labelDone]}>{label}</Text>
            </View>
            {i < STEP_LABELS.length - 1 && <View style={[sb.line, done && sb.lineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function BookingSummaryScreen({ navigation, route }: Props) {
  const { salonId, staffId, date, time } = route.params;
  const { selectedServices, getTotalAmount, getTotalDuration } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staff = staffId && staffId !== 'any'
    ? (DEMO_STAFF[salonId] ?? DEMO_STAFF.default).find((s) => s.id === staffId)
    : null;

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = getTotalAmount();
  const gst = Math.round(subtotal * 0.18);
  const discountPct = appliedCoupon ? VALID_COUPONS[appliedCoupon] : 0;
  const discountAmt = appliedCoupon === 'FLAT50' ? 50 : Math.round(subtotal * discountPct / 100);
  const total = subtotal + gst - discountAmt;

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code] !== undefined) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try SAVE10 or WEEKEND20');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCoupon(''); setCouponError(''); };

  const handleProceed = () => {
    navigation.navigate('Payment', {
      bookingData: { salonId, staffId, date, time, services: selectedServices, total },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSub}>Confirm your appointment</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <StepBar current={3} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Salon Card */}
        <View style={styles.salonCard}>
          <View style={styles.salonImageBox}>
            <Text style={styles.salonEmoji}></Text>
          </View>
          <View style={styles.salonInfo}>
            <Text style={styles.salonName}>{salon.name}</Text>
            <View style={styles.salonMetaRow}>
              <MapPin size={12} color={colors.textSecondary} />
              <Text style={styles.salonMeta} numberOfLines={1}>{salon.addressLine1}, {salon.city}</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#EEF2FF' }]}>
                <Calendar size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={16} color={colors.warning} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{time} · {getTotalDuration()} min</Text>
              </View>
            </View>
            {staff && (
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: '#FCE7F3' }]}>
                  <User size={16} color={colors.secondary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Staff</Text>
                  <Text style={styles.detailValue}>{staff.name}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services ({selectedServices.length})</Text>
          {selectedServices.map((s, i) => (
            <View key={s.id} style={[styles.serviceRow, i < selectedServices.length - 1 && styles.serviceRowBorder]}>
              <View style={styles.serviceLeft}>
                <View style={styles.serviceCheck}>
                  <Check size={12} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDur}>{s.duration} min</Text>
                </View>
              </View>
              <Text style={styles.servicePrice}>₹{s.price}</Text>
            </View>
          ))}
        </View>

        {/* Coupon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCoupon}>
              <Tag size={16} color={colors.success} />
              <Text style={styles.appliedCouponText}>{appliedCoupon} applied — saving ₹{discountAmt}!</Text>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCoupon}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponRow}>
                <Tag size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter promo code"
                  placeholderTextColor={colors.textTertiary}
                  value={coupon}
                  onChangeText={(t) => { setCoupon(t.toUpperCase()); setCouponError(''); }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponError}>{couponError}</Text>
              ) : (
                <Text style={styles.couponHint}>Try: SAVE10 · WEEKEND20</Text>
              )}
            </>
          )}
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Service Charges</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (18%)</Text>
              <Text style={styles.billValue}>₹{gst}</Text>
            </View>
            {discountAmt > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: colors.success }]}>Promo Discount</Text>
                <Text style={[styles.billValue, { color: colors.success }]}>- ₹{discountAmt}</Text>
              </View>
            )}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billTotal}>Total Payable</Text>
              <Text style={styles.billTotalValue}>₹{total}</Text>
            </View>
          </View>
        </View>

        {/* Policies */}
        <View style={styles.policyCard}>
          <Shield size={14} color={colors.success} />
          <Text style={styles.policyText}>
            Free cancellation up to 2 hours before appointment · Refund within 24 hours
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View>
            <Text style={styles.footerLabel}>Total Payable</Text>
            {discountAmt > 0 && (
              <Text style={styles.footerSaving}>You save ₹{discountAmt} </Text>
            )}
          </View>
          <Text style={styles.footerAmount}>₹{total}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.payBtnText}>Proceed to Payment</Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  step: { alignItems: 'center', gap: 3 },
  circle: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  circleActive: { backgroundColor: colors.primary },
  circleDone: { backgroundColor: colors.success },
  num: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  numActive: { color: 'white' },
  label: { fontSize: 10, color: colors.textTertiary, fontWeight: '500' },
  labelActive: { color: colors.primary, fontWeight: '700' },
  labelDone: { color: colors.success },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginBottom: 14, marginHorizontal: 2 },
  lineDone: { backgroundColor: colors.success },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 12, backgroundColor: 'white' },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  headerMid: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  salonCard: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 12, padding: 14, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  salonImageBox: { width: 56, height: 56, backgroundColor: '#F0EEFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  salonEmoji: { fontSize: 28 },
  salonInfo: { flex: 1 },
  salonName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  salonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  salonMeta: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  section: { marginHorizontal: 12, marginBottom: 10, padding: 16, backgroundColor: 'white', borderRadius: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  detailGrid: { gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  detailLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  serviceRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  serviceCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  serviceName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 1 },
  serviceDur: { fontSize: 12, color: colors.textSecondary },
  servicePrice: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed' },
  couponInput: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, letterSpacing: 1 },
  applyBtn: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.primary, borderRadius: 10 },
  applyBtnText: { fontSize: 13, fontWeight: '700', color: 'white' },
  couponError: { fontSize: 12, color: colors.error, marginTop: 6 },
  couponHint: { fontSize: 12, color: colors.textTertiary, marginTop: 6 },
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1, borderColor: colors.success },
  appliedCouponText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.success },
  removeCoupon: { fontSize: 13, fontWeight: '700', color: colors.error },
  billCard: { backgroundColor: colors.background, borderRadius: 12, padding: 14, gap: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billLabel: { fontSize: 14, color: colors.textSecondary },
  billValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  billDivider: { height: 1, backgroundColor: colors.border },
  billTotal: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  billTotalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  policyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginHorizontal: 12, padding: 14, backgroundColor: '#F0FDF4', borderRadius: 12 },
  policyText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  footer: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 10 },
  footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 13, color: colors.textSecondary },
  footerSaving: { fontSize: 12, fontWeight: '600', color: colors.success, marginTop: 2 },
  footerAmount: { fontSize: 24, fontWeight: '700', color: colors.primary },
  payBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15 },
  payBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
