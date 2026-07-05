import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import StaffLoginScreen from '../screens/auth/StaffLoginScreen';
import CustomerHomeScreen from '../screens/home/HomeScreen';
import CustomerOrdersScreen from '../screens/booking/CustomerOrdersScreen';
import BookingFormScreen from '../screens/booking/BookingFormScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
      <Stack.Screen name="BookingForm" component={BookingFormScreen} />
      <Stack.Screen name="CustomerOrders" component={CustomerOrdersScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
          </>
        ) : role === 'customer' ? (
          <>
            <Stack.Screen name="CustomerMain" component={CustomerNavigator} />
          </>
        ) : role === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}