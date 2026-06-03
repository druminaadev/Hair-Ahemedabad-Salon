import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Calendar, Clock, ChevronRight, Check, Sun, Sunset, Moon } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS, DEMO_STAFF } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'SlotSelection'>;
const { width } = Dimensions.get('window');

const STEP_LABELS = ['Services', 'Staff', 'Date & Time', 'Summary'];

// Generate 14 days
const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

// Fixed seed for "unavailable" slots — avoids random re-renders
const UNAVAILABLE = new Set(['09:30', '11:00', '14:30', '17:00', '18:30', '20:00']);

const TIME_GROUPS = [
  { label: 'Morning', Icon: Sun, color: '#F59E0B', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
  { label: 'Afternoon', Icon: Sunset, color: '#EC4899', slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
  { label: 'Evening', Icon: Moon, color: '#6366F1', slots: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'] },
];

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

export default function SlotSelectionScreen({ navigation, route }: Props) {
  const { salonId, staffId } = route.params;
  const { selectedServices, getTotalAmount, getTotalDuration, setDateTime } = useBookingStore();

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staff = staffId && staffId !== 'any'
    ? (DEMO_STAFF[salonId] ?? DEMO_STAFF.default).find((s) => s.id === staffId)
    : null;

  const selectedDate = DATES[selectedDateIdx];
  const isToday = selectedDateIdx === 0;

  const handleContinue = () => {
    if (!selectedTime) return;
    setDateTime(selectedDate.toISOString().split('T')[0], { startTime: selectedTime, endTime: selectedTime });
    navigation.navigate('BookingSummary', {
      salonId,
      staffId,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
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
          <Text style={styles.headerTitle}>Date & Time</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <StepBar current={2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Staff reminder */}
        {staff && (
          <View style={styles.staffBanner}>
            <View style={styles.staffBannerAvatar}>
              <Text style={styles.staffBannerAvatarText}>{staff.name.charAt(0)}</Text>
            </View>
            <Text style={styles.staffBannerText}>Booking with <Text style={{ fontWeight: '700' }}>{staff.name}</Text></Text>
          </View>
        )}

        {/* Date Picker */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {DATES.map((date, i) => {
              const selected = selectedDateIdx === i;
              const isToday = i === 0;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateCard, selected && styles.dateCardActive]}
                  onPress={() => { setSelectedDateIdx(i); setSelectedTime(null); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateWeekday, selected && styles.dateTextActive]}>
                    {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={[styles.dateDay, selected && styles.dateTextActive]}>{date.getDate()}</Text>
                  <Text style={[styles.dateMonth, selected && styles.dateTextActive]}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected date display */}
        <View style={styles.selectedDateBar}>
          <Calendar size={14} color={colors.primary} />
          <Text style={styles.selectedDateText}>
            {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Time Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.legendWrap}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Available</Text>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>

          {TIME_GROUPS.map(({ label, Icon, color, slots }) => (
            <View key={label} style={styles.timeGroup}>
              <View style={styles.timeGroupHeader}>
                <Icon size={14} color={color} />
                <Text style={[styles.timeGroupLabel, { color }]}>{label}</Text>
                <Text style={styles.timeGroupCount}>
                  {slots.filter((s) => !UNAVAILABLE.has(s)).length} available
                </Text>
              </View>
              <View style={styles.timeGrid}>
                {slots.map((time) => {
                  const unavailable = UNAVAILABLE.has(time) || (isToday && parseInt(time) < new Date().getHours());
                  const selected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeChip,
                        unavailable && styles.timeChipUnavail,
                        selected && styles.timeChipSelected,
                      ]}
                      onPress={() => !unavailable && setSelectedTime(time)}
                      disabled={unavailable}
                      activeOpacity={0.75}
                    >
                      <Text style={[
                        styles.timeChipText,
                        unavailable && styles.timeChipTextUnavail,
                        selected && styles.timeChipTextSelected,
                      ]}>{time}</Text>
                      {selected && <View style={styles.timeCheckDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {selectedTime ? (
          <View style={styles.selectedPill}>
            <Calendar size={14} color={colors.primary} />
            <Text style={styles.selectedPillText}>
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {selectedTime}
            </Text>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.selectedPillSub}>{getTotalDuration()} min</Text>
          </View>
        ) : (
          <Text style={styles.footerHint}>Select a time slot to continue</Text>
        )}
        <TouchableOpacity
          style={[styles.continueBtn, !selectedTime && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selectedTime}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Review Booking</Text>
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
  staffBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12, padding: 12, backgroundColor: colors.primaryLight, borderRadius: 12 },
  staffBannerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  staffBannerAvatarText: { fontSize: 14, fontWeight: '700', color: 'white' },
  staffBannerText: { fontSize: 14, color: colors.textPrimary },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  legendWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary, marginRight: 6 },
  dateList: { gap: 8, paddingBottom: 4 },
  dateCard: { width: 66, paddingVertical: 12, backgroundColor: 'white', borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  dateCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateWeekday: { fontSize: 11, color: colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  dateDay: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  dateMonth: { fontSize: 11, color: colors.textSecondary },
  dateTextActive: { color: 'white', fontWeight: '700' },
  selectedDateBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primaryLight, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  selectedDateText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  timeGroup: { marginBottom: 20 },
  timeGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  timeGroupLabel: { fontSize: 14, fontWeight: '700', flex: 1 },
  timeGroupCount: { fontSize: 12, color: colors.textSecondary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'white', borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipUnavail: { backgroundColor: colors.background, borderColor: colors.border, opacity: 0.5 },
  timeChipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  timeChipTextSelected: { color: 'white' },
  timeChipTextUnavail: { color: colors.textTertiary },
  timeCheckDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' },
  footer: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 10 },
  selectedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.primaryLight, borderRadius: 10, alignSelf: 'flex-start' },
  selectedPillText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  selectedPillSub: { fontSize: 12, color: colors.textSecondary },
  footerHint: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  continueBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14 },
  continueBtnDisabled: { backgroundColor: colors.gray300 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
