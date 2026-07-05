import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';

export default function OTPScreen({ route }: any) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        phone,
        otp,
        role: 'customer',
      });

      setLoading(false);
      const { accessToken, refreshToken, user } = response.data;

      // Update Redux state
      dispatch(
        setCredentials({
          token: accessToken,
          refreshToken,
          user,
        })
      );
    } catch (error: any) {
      setLoading(false);
      const errMsg = error.response?.data?.error || 'Verification failed. Try again.';
      Alert.alert('Error', errMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpInputContainer}>
          <TextInput
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="000000"
            placeholderTextColor="#94A3B8"
            autoFocus
          />
        </View>

        <View style={styles.timerRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(60)}>
              <Text style={styles.resendLink}>Resend SMS</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify & Proceed</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  otpInputContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    width: '60%',
    textAlign: 'center',
    paddingBottom: 8,
  },
  timerRow: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 13,
    color: '#64748B',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
