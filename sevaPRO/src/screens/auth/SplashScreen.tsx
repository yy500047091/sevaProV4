import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../theme';
import { RootState } from '../../store';

export default function SplashScreen({ navigation }: any) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (role === 'admin') {
          navigation.replace('AdminDashboard');
        } else if (role === 'provider') {
          navigation.replace('ProviderDashboard');
        } else {
          navigation.replace('CustomerMain');
        }
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, role, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ServeEase</Text>

      <Text style={styles.subtitle}>
        On-Demand Service Marketplace
      </Text>

      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: colors.primary,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  loader: {
    marginTop: 40,
  },
});