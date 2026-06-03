import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/colors';

const TYPES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'other', label: 'Other', icon: MapPin },
];

export default function AddAddressScreen({ navigation }: any) {
  const [type, setType] = useState('home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');

  const handleSave = () => {
    if (!line1 || !city || !pincode) {
      Alert.alert('Missing fields', 'Please fill address, city and pincode.');
      return;
    }
    Alert.alert('Address Saved!', 'Your address has been added successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Address" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Save as</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <TouchableOpacity key={t.id} style={[styles.typeChip, active && styles.typeChipActive]} onPress={() => setType(t.id)}>
                <t.icon size={18} color={active ? colors.primary : colors.textSecondary} />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input label="Address Line 1 *" value={line1} onChangeText={setLine1} placeholder="Building, Street" />
        <Input label="Address Line 2" value={line2} onChangeText={setLine2} placeholder="Area, Landmark (optional)" />
        <Input label="City *" value={city} onChangeText={setCity} placeholder="e.g. Ahmedabad" />
        <Input label="State" value={state} onChangeText={setState} placeholder="e.g. Gujarat" />
        <Input label="Pincode *" value={pincode} onChangeText={(t) => setPincode(t.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={6} placeholder="6-digit pincode" />

        <Button title="Save Address" onPress={handleSave} fullWidth style={styles.btn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 20, gap: 4 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: colors.background, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  typeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  typeText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  typeTextActive: { color: colors.primary },
  btn: { marginTop: 8 },
});
