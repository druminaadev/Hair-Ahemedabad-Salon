import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Check, Search, Clock, ChevronRight } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS, DEMO_SERVICES } from '@/data/demo';
import { SalonService } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'ServiceSelection'>;
const { width } = Dimensions.get('window');

const STEP_LABELS = ['Services', 'Staff', 'Date & Time', 'Summary'];

const CAT_ICONS: Record<string, string> = {
  hair: '️', skin: '', body: '', nails: '', makeup: '',
};

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
            {i < STEP_LABELS.length - 1 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function ServiceSelectionScreen({ navigation, route }: Props) {
  const { salonId } = route.params;
  const { selectedServices, addService, removeService, setSalonId, getTotalAmount, getTotalDuration, clearBooking } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const allServices: SalonService[] = (DEMO_SERVICES[salonId] ?? DEMO_SERVICES.default).map((s) => ({ ...s, salonId }));
  const categories = ['all', ...new Set(allServices.map((s) => s.categoryId))];

  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => { clearBooking(); setSalonId(salonId); }, [salonId]);

  const filtered = useMemo(() =>
    allServices.filter((s) =>
      (activeCat === 'all' || s.categoryId === activeCat) &&
      s.name.toLowerCase().includes(query.toLowerCase())
    ), [activeCat, query]);

  const isSelected = (id: string) => selectedServices.some((s) => s.id === id);
  const toggle = (service: SalonService) =>
    isSelected(service.id) ? removeService(service.id) : addService(service);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Select Services</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Step Bar */}
      <StepBar current={0} />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={16} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
        {categories.map((cat) => {
          const active = activeCat === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catTab, active && styles.catTabActive]}
              onPress={() => setActiveCat(cat)}
            >
              {cat !== 'all' && <Text style={styles.catEmoji}>{CAT_ICONS[cat] ?? ''}</Text>}
              <Text style={[styles.catTabText, active && styles.catTabTextActive]}>
                {cat === 'all' ? 'All Services' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Services List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        )}
        {filtered.map((service) => {
          const selected = isSelected(service.id);
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, selected && styles.serviceCardSelected]}
              onPress={() => toggle(service)}
              activeOpacity={0.8}
            >
              <View style={[styles.serviceLeft, selected && styles.serviceLeftSelected]}>
                <Text style={styles.serviceEmoji}>{CAT_ICONS[service.categoryId] ?? ''}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{service.description}</Text>
                <View style={styles.serviceMeta}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.serviceMetaText}>{service.duration} min</Text>
                  <View style={styles.dot} />
                  <Text style={styles.servicePrice}>₹{service.price}</Text>
                </View>
              </View>
              <View style={[styles.check, selected && styles.checkSelected]}>
                {selected && <Check size={14} color="white" />}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Tray */}
      {selectedServices.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View>
              <Text style={styles.footerServicesCount}>
                {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
              </Text>
              <View style={styles.footerMeta}>
                <Clock size={13} color={colors.textSecondary} />
                <Text style={styles.footerMetaText}>{getTotalDuration()} min total</Text>
              </View>
            </View>
            <View style={styles.footerAmount}>
              <Text style={styles.footerAmountLabel}>Subtotal</Text>
              <Text style={styles.footerAmountValue}>₹{getTotalAmount()}</Text>
            </View>
          </View>
          {selectedServices.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedChips}>
              {selectedServices.map((s) => (
                <TouchableOpacity key={s.id} style={styles.chip} onPress={() => removeService(s.id)}>
                  <Text style={styles.chipText}>{s.name}</Text>
                  <Text style={styles.chipX}>✕</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('StaffSelection', { salonId })}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue to Staff</Text>
            <ChevronRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Step Bar styles
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
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, marginBottom: 0, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  catList: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  catTab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'white', borderRadius: 20, borderWidth: 1.5, borderColor: colors.border },
  catTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catEmoji: { fontSize: 14 },
  catTabText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  catTabTextActive: { color: 'white' },
  list: { paddingHorizontal: 12, paddingTop: 8 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
  serviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 14, marginBottom: 10, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  serviceCardSelected: { borderColor: colors.primary },
  serviceLeft: { width: 56, height: 72, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center' },
  serviceLeftSelected: { backgroundColor: colors.primaryLight },
  serviceEmoji: { fontSize: 26 },
  serviceInfo: { flex: 1, padding: 12 },
  serviceName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  serviceDesc: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceMetaText: { fontSize: 12, color: colors.textSecondary },
  servicePrice: { fontSize: 14, fontWeight: '700', color: colors.primary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  footer: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 10 },
  footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerServicesCount: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  footerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerMetaText: { fontSize: 13, color: colors.textSecondary },
  footerAmount: { alignItems: 'flex-end' },
  footerAmountLabel: { fontSize: 11, color: colors.textSecondary },
  footerAmountValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  selectedChips: { gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.primaryLight, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  chipX: { fontSize: 11, color: colors.primary },
  continueBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
