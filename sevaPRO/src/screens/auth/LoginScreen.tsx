import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import axios from 'axios';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert('Invalid Number', 'Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { phone: formattedPhone });
      navigation.navigate('OTP', { phone: formattedPhone });
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.content}>
        <View style={styles.brandArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>⚡</Text>
          </View>
          <Text style={styles.brandName}>SevaPRO</Text>
          <Text style={styles.tagline}>On-Demand Verified Professionals</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>MOBILE NUMBER</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryBadge}>
              <Text style={styles.countryText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              placeholder="9999900000"
              placeholderTextColor="#475569"
            />
          </View>
          <Text style={styles.hint}>We'll send a 6-digit OTP to verify your number</Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Get Verification Code →</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('StaffLogin')}>
          <Text style={styles.staffLink}>Staff Login (Admin / Provider) →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-around', paddingVertical: 20 },
  brandArea: { alignItems: 'center', marginTop: 20 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1E40AF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoEmoji: { fontSize: 32 },
  brandName: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#94A3B8', marginTop: 6, textAlign: 'center' },
  formCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24 },
  label: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 1.5, marginBottom: 10 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155', height: 56 },
  countryBadge: { paddingHorizontal: 14, borderRightWidth: 1, borderRightColor: '#334155', height: '100%', justifyContent: 'center' },
  countryText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },
  input: { flex: 1, fontSize: 18, fontWeight: '600', color: '#F1F5F9', paddingHorizontal: 14 },
  hint: { fontSize: 12, color: '#475569', marginTop: 8, marginBottom: 20 },
  button: { height: 54, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  staffLink: { textAlign: 'center', fontSize: 13, color: '#64748B', textDecorationLine: 'underline', paddingVertical: 8 },
});