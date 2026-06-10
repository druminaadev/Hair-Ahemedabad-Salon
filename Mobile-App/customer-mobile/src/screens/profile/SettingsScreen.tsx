import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, Moon, Globe, Shield, FileText, Info, Trash2, ChevronRight } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen({ navigation }: any) {
  const logout = useAuthStore((s) => s.logout);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleDeleteAccount = () =>
    Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => logout() },
    ]);

  const Row = ({ icon: Icon, label, value, onPress, toggle, toggleValue, onToggle, color }: any) => (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!!toggle || !onPress}>
      {Icon && <View style={styles.rowIcon}><Icon size={18} color={color ?? colors.primary} /></View>}
      <Text style={[styles.rowLabel, color && { color }]}>{label}</Text>
      {toggle ? <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: colors.primary }} /> : value ? <Text style={styles.rowValue}>{value}</Text> : onPress ? <ChevronRight size={16} color={colors.textSecondary} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Row icon={Bell} label="Push Notifications" toggle toggleValue={pushNotif} onToggle={setPushNotif} />
          <Row icon={Bell} label="Email Notifications" toggle toggleValue={emailNotif} onToggle={setEmailNotif} />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Row icon={Moon} label="Dark Mode" toggle toggleValue={darkMode} onToggle={setDarkMode} />
          <Row icon={Globe} label="Language" value="English" onPress={() => {}} />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <Row icon={Shield} label="Biometric Login" toggle toggleValue={biometric} onToggle={setBiometric} />
          <Row icon={Shield} label="Change PIN" onPress={() => Alert.alert('Coming Soon', 'Change PIN feature coming soon.')} />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & About</Text>
          <Row icon={FileText} label="Privacy Policy" onPress={() => {}} />
          <Row icon={FileText} label="Terms of Service" onPress={() => {}} />
          <Row icon={Info} label="App Version" value="v1.0.0" />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Trash2 size={18} color={colors.error} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { margin: 16, marginBottom: 0, backgroundColor: 'white', borderRadius: 14, overflow: 'hidden' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  rowValue: { fontSize: 14, color: colors.textSecondary },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: colors.errorLight, borderRadius: 14, margin: 16 },
  deleteText: { fontSize: 15, fontWeight: '700', color: colors.error },
});
