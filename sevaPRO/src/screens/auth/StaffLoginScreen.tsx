import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { setCredentials } from '../../store/slices/authSlice';

export default function StaffLoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken, user } = response.data;
      dispatch(
        setCredentials({
          token: accessToken,
          refreshToken,
          user: { ...user, id: user._id || user.id },
        })
      );
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Staff Login</Text>
          <Text style={styles.subtitle}>For Admin & Service Providers</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="admin@seva.com"
              placeholderTextColor="#475569"
            />
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>PASSWORD</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Login →</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <Text style={styles.demoText}>Admin: admin@seva.com / Admin@123</Text>
          <Text style={styles.demoText}>Provider: provider@seva.com / Provider@123</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { paddingVertical: 10 },
  backButtonText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 40 },
  titleContainer: { marginVertical: 30 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#94A3B8', marginTop: 8 },
  formCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24 },
  label: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 1.5, marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155', height: 56 },
  input: { flex: 1, fontSize: 16, fontWeight: '500', color: '#F1F5F9', paddingHorizontal: 16 },
  eyeBtn: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  eyeText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  button: { height: 54, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  demoBox: { marginTop: 'auto', backgroundColor: 'rgba(51, 65, 85, 0.5)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  demoTitle: { color: '#E2E8F0', fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  demoText: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
});
