import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Clipboard } from 'react-native';
import { Copy, Share2, Gift, Users, IndianRupee, Check } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { DEMO_USER } from '@/data/demo';
import { colors } from '@/constants/colors';

const REFERRAL_CODE = 'PRIYA100';

const STEPS = [
  { icon: '📲', text: 'Share your referral code with friends' },
  { icon: '📝', text: 'Friend signs up and books their first appointment' },
  { icon: '💰', text: 'You earn ₹100 wallet credit instantly' },
];

export default function ReferralScreen({ navigation }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code ${REFERRAL_CODE} on Hair Ahmedabad app and get ₹100 off your first booking! Download: https://hairahmedabad.app`,
        title: 'Refer & Earn ₹100',
      });
    } catch {
      Alert.alert('Error', 'Could not open share sheet.');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Refer & Earn" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Earn ₹100 per Referral!</Text>
          <Text style={styles.heroSub}>Invite friends and earn wallet credits for every successful referral</Text>
        </View>

        {/* Referral Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <Text style={styles.code}>{REFERRAL_CODE}</Text>
          <View style={styles.codeActions}>
            <TouchableOpacity style={styles.codeBtn} onPress={handleCopy}>
              {copied ? <Check size={18} color={colors.success} /> : <Copy size={18} color={colors.primary} />}
              <Text style={[styles.codeBtnText, copied && { color: colors.success }]}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.codeBtn, styles.shareBtn]} onPress={handleShare}>
              <Share2 size={18} color="white" />
              <Text style={[styles.codeBtnText, { color: 'white' }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={22} color={colors.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
          <View style={styles.statCard}>
            <IndianRupee size={22} color={colors.success} />
            <Text style={styles.statValue}>₹500</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Gift size={22} color={colors.warning} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
              <Text style={styles.stepEmoji}>{step.icon}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* T&C */}
        <Text style={styles.tc}>
          * Credits are added after the referred user completes their first booking. Minimum booking value ₹300. Valid for new users only.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 16 },
  hero: { alignItems: 'center', padding: 24, backgroundColor: colors.primaryLight, borderRadius: 20, marginBottom: 20 },
  heroEmoji: { fontSize: 56, marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  heroSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  codeCard: { padding: 20, backgroundColor: colors.background, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  codeLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  code: { fontSize: 32, fontWeight: '700', color: colors.primary, letterSpacing: 4, marginBottom: 16 },
  codeActions: { flexDirection: 'row', gap: 12 },
  codeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.primaryLight, borderRadius: 20 },
  shareBtn: { backgroundColor: colors.primary },
  codeBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', gap: 4, padding: 14, backgroundColor: colors.background, borderRadius: 14 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 13, fontWeight: '700', color: 'white' },
  stepEmoji: { fontSize: 22 },
  stepText: { flex: 1, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  tc: { fontSize: 12, color: colors.textTertiary, lineHeight: 18, marginBottom: 24 },
});
