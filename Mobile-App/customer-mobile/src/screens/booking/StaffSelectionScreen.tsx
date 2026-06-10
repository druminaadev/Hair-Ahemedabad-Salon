import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Star, ChevronRight, Check, Users } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { DEMO_STAFF, DEMO_SALONS } from '@/data/demo';
import { useBookingStore } from '@/store/bookingStore';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'StaffSelection'>;
const { width } = Dimensions.get('window');

const STEP_LABELS = ['Services', 'Staff', 'Date & Time', 'Summary'];

function StepBar({ current }: { current: number }) {
  return (
    <View style={sb.wrap}>
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <View style={sb.step}>
              <View style={[sb.circle, done && sb.circleDone, active && sb.circleActive]}>
                {done
                  ? <Check size={11} color="white" />
                  : <Text style={[sb.num, active && sb.numActive]}>{i + 1}</Text>}
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

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

export default function StaffSelectionScreen({ navigation, route }: Props) {
  const { salonId } = route.params;
  const [selectedStaff, setSelectedStaff] = useState<string>('any');
  const { selectedServices, getTotalAmount, getTotalDuration } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staffList = DEMO_STAFF[salonId] ?? DEMO_STAFF.default;
  const availableCount = staffList.filter((s) => s.isAvailable).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Choose Staff</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('SlotSelection', { salonId, staffId: 'any' })}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <StepBar current={1} />

      {/* Availability info */}
      <View style={styles.availInfo}>
        <Users size={14} color={colors.success} />
        <Text style={styles.availText}>{availableCount} of {staffList.length} staff available today</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {/* Any Available Card */}
        <TouchableOpacity
          style={[styles.card, selectedStaff === 'any' && styles.cardSelected]}
          onPress={() => setSelectedStaff('any')}
          activeOpacity={0.8}
        >
          <View style={[styles.avatarWrap, { backgroundColor: colors.gray200 }]}>
            <Text style={styles.anyEmoji}>🎲</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Any Available</Text>
            <Text style={styles.cardSpec}>We assign the best available stylist</Text>
            <View style={styles.anyBadge}>
              <Text style={styles.anyBadgeText}>Fastest booking</Text>
            </View>
          </View>
          <View style={[styles.radio, selectedStaff === 'any' && styles.radioActive]}>
            {selectedStaff === 'any' && <Check size={14} color="white" />}
          </View>
        </TouchableOpacity>

        <Text style={styles.divLabel}>OR CHOOSE A SPECIFIC STYLIST</Text>

        {staffList.map((member, idx) => {
          const selected = selectedStaff === member.id;
          const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const bookingPct = Math.min((member.totalBookings / 600) * 100, 100);

          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.card, selected && styles.cardSelected, !member.isAvailable && styles.cardDisabled]}
              onPress={() => member.isAvailable && setSelectedStaff(member.id)}
              activeOpacity={member.isAvailable ? 0.8 : 1}
            >
              <View style={[styles.avatarWrap, { backgroundColor: avatarBg }]}>
                <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                <View style={[styles.availDot, member.isAvailable ? styles.availDotGreen : styles.availDotGray]} />
              </View>

              <View style={styles.cardInfo}>
                <View style={styles.cardNameRow}>
                  <Text style={styles.cardName}>{member.name}</Text>
                  {!member.isAvailable && (
                    <View style={styles.unavailBadge}>
                      <Text style={styles.unavailText}>Busy</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardSpec}>{member.specialization}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.ratingText}>{member.rating}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.bookingsText}>{member.totalBookings} bookings</Text>
                </View>
                {/* Booking progress bar */}
                <View style={styles.progressWrap}>
                  <View style={[styles.progressBar, { width: `${bookingPct}%` as any }]} />
                </View>
                <Text style={styles.bioText} numberOfLines={1}>{member.bio}</Text>
              </View>

              {member.isAvailable && (
                <View style={[styles.radio, selected && styles.radioActive]}>
                  {selected && <Check size={14} color="white" />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerServices}>{selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} · {getTotalDuration()} min</Text>
          <Text style={styles.footerAmount}>₹{getTotalAmount()}</Text>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('SlotSelection', { salonId, staffId: selectedStaff })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Select Date & Time</Text>
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
  skipBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.primaryLight, borderRadius: 10 },
  skipText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  availInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F0FDF4', borderBottomWidth: 1, borderBottomColor: colors.border },
  availText: { fontSize: 13, fontWeight: '600', color: colors.success },
  list: { padding: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, marginBottom: 10, padding: 14, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  cardSelected: { borderColor: colors.primary, backgroundColor: '#FAFAFF' },
  cardDisabled: { opacity: 0.55 },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  anyEmoji: { fontSize: 26 },
  avatarText: { fontSize: 22, fontWeight: '700', color: 'white' },
  availDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: 'white' },
  availDotGreen: { backgroundColor: colors.success },
  availDotGray: { backgroundColor: colors.gray400 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  unavailBadge: { paddingHorizontal: 7, paddingVertical: 2, backgroundColor: colors.errorLight, borderRadius: 8 },
  unavailText: { fontSize: 10, fontWeight: '700', color: colors.error },
  anyBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#DCFCE7', borderRadius: 8, marginTop: 4 },
  anyBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success },
  cardSpec: { fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  bookingsText: { fontSize: 12, color: colors.textSecondary },
  progressWrap: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  bioText: { fontSize: 11, color: colors.textSecondary },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  radioActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  divLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.6, textAlign: 'center', marginVertical: 10 },
  footer: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 10 },
  footerSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerServices: { fontSize: 13, color: colors.textSecondary },
  footerAmount: { fontSize: 18, fontWeight: '700', color: colors.primary },
  continueBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
