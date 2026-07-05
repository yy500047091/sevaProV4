export type RootStackParamList = {
  Login: undefined;
  OTP: { phone: string; tempToken?: string };
  MainTabs: undefined;
  BookingFlow: { serviceId: string; subServiceId: string };
  LiveTracking: { bookingId: string };
};

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};
