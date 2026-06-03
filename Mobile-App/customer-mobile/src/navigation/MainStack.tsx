import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Wallet, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useNotificationStore } from '@/store/notificationStore';
import HomeStack from './HomeStack';
import BookingsStack from './BookingsStack';
import WalletStack from './WalletStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

function NotifBadge() {
  const count = useNotificationStore((s) => s.unreadCount());
  if (count === 0) return null;
  return (
    <View style={badge.wrap}>
      <Text style={badge.text}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: 'white' },
  text: { fontSize: 9, fontWeight: '700', color: 'white' },
});

export default function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          backgroundColor: 'white',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStack}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletStack}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View>
              <User color={color} size={size} />
              <NotifBadge />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
