import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  OTPVerification: { phone: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
  WalletTab: NavigatorScreenParams<WalletStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  SalonList: Record<string, never>;
  SalonDetail: { id: string };
  ServiceSelection: { salonId: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
};

export type BookingsStackParamList = {
  BookingList: undefined;
  BookingDetail: { id: string };
  Reschedule: { bookingId: string };
  WriteReview: { bookingId: string };
};

export type WalletStackParamList = {
  WalletHome: undefined;
  AddMoney: undefined;
  TransactionHistory: undefined;
  Referral: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: undefined;
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
};
