import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export const ScreenHeader: React.FC<Props> = ({ title, onBack, right }) => (
  <View style={styles.header}>
    <View style={styles.side}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
    <Text style={styles.title} numberOfLines={1}>{title}</Text>
    <View style={styles.side}>{right ?? null}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'white',
  },
  side: { width: 40 },
  back: { padding: 4 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
});
