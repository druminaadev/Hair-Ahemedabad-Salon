import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import { DEMO_USER } from '@/data/demo';
import { colors } from '@/constants/colors';

export default function EditProfileScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user) ?? DEMO_USER;
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [dob, setDob] = useState('15/03/1995');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(user.gender ?? 'FEMALE');

  const handleSave = () => {
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={16} color="white" />
          </TouchableOpacity>
          <Text style={styles.changePhoto}>Change Photo</Text>
        </View>

        {/* Form */}
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Enter your name" />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Enter email" />
        <Input label="Phone" value={`+91 ${user.phone}`} editable={false} />
        <Input label="Date of Birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {(['MALE', 'FEMALE'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderChip, gender === g && styles.genderChipActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                {g === 'MALE' ? ' Male' : ' Female'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Save Changes" onPress={handleSave} fullWidth style={styles.saveBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 20, gap: 4 },
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: '700', color: 'white' },
  cameraBtn: { position: 'absolute', right: '30%', bottom: 20, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
  changePhoto: { fontSize: 13, color: colors.primary, marginTop: 6, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 8, marginTop: 4 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  genderChip: { flex: 1, paddingVertical: 12, backgroundColor: colors.background, borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  genderChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  genderText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  genderTextActive: { color: colors.primary },
  saveBtn: { marginTop: 8 },
});
