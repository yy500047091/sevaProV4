import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import io from 'socket.io-client';
import { colors } from '../../theme';
import { SOCKET_URL } from '../../config/api';

export default function LiveTrackingScreen({ route, navigation }: any) {
  const { bookingId } = route.params;

  // Real-time variables
  const [status, setStatus] = useState('Worker en route');
  const [workerName, setWorkerName] = useState('Amit Sharma');
  const [eta, setEta] = useState(12); // minutes
  const [distance, setDistance] = useState(3.2); // km
  const [otp, setOtp] = useState('4821'); // mock OTP code
  const [workerCoords, setWorkerCoords] = useState({ lat: 28.5950, lng: 77.2400 });

  useEffect(() => {
    // 1. Establish Socket Connection
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to GPS Tracking WebSocket.');
      socket.emit('joinRoom', `booking:${bookingId}`);
    });

    // 2. Listen for worker coordinates updates
    socket.on('locationUpdate', (data: { lat: number; lng: number; heading?: number }) => {
      console.log('Socket GPS Update:', data);
      setWorkerCoords({ lat: data.lat, lng: data.lng });
      // Recalculate ETA and distance
      setDistance((prev) => Math.max(0.1, Number((prev - 0.1).toFixed(2))));
      setEta((prev) => Math.max(1, prev - 1));
    });

    // 3. Listen for job status progression from backend
    socket.on('statusChange', (data: { status: string }) => {
      console.log('Job status updated:', data.status);
      if (data.status === 'arrived') {
        setStatus('Worker Arrived');
        setEta(0);
        setDistance(0);
      } else if (data.status === 'in_progress') {
        setStatus('Service in progress');
      } else if (data.status === 'completed') {
        Alert.alert('Job Completed', 'Your plumbing service was completed successfully! Thank you.', [
          { text: 'Okay', onPress: () => navigation.navigate('MainTabs') }
        ]);
      }
    });

    // 4. GPS update simulation in case server socket is not transmitting actively
    const simulator = setInterval(() => {
      setWorkerCoords((prev) => {
        const offsetLat = (28.6139 - prev.lat) * 0.05;
        const offsetLng = (77.2090 - prev.lng) * 0.05;
        return {
          lat: Number((prev.lat + offsetLat).toFixed(5)),
          lng: Number((prev.lng + offsetLng).toFixed(5)),
        };
      });
      setDistance((prev) => Math.max(0, Number((prev - 0.15).toFixed(2))));
      setEta((prev) => Math.max(0, prev - 1));
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(simulator);
    };
  }, [bookingId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Simulator Panel */}
      <View style={styles.mapSimulator}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>✕ Go Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
        </View>

        {/* Mock Map Vector representation */}
        <View style={styles.mapGrid}>
          <div style={styles.gridBackground} />
          
          {/* Customer Location Pin */}
          <View style={[styles.pin, styles.customerPin]}>
            <Text style={styles.pinText}>🏠 Home</Text>
          </View>

          {/* Worker Location Pin */}
          <View style={[styles.pin, styles.workerPin, {
            top: `${50 + (28.6139 - workerCoords.lat) * 2000}%`,
            left: `${50 + (77.2090 - workerCoords.lng) * 2000}%`,
          }]}>
            <Text style={styles.pinText}>👷 Amit (Pro)</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet details */}
      <View style={styles.bottomSheet}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.workerTitle}>{workerName}</Text>
            <Text style={styles.subtext}>{status} • Verified Expert</Text>
          </View>
          <View style={styles.etaBox}>
            <Text style={styles.etaText}>{eta} min</Text>
            <Text style={styles.distanceText}>{distance} km away</Text>
          </View>
        </View>

        {/* Verification OTP display */}
        {status === 'Worker en route' || status === 'Worker Arrived' ? (
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>Arrival Verification OTP</Text>
            <Text style={styles.otpValue}>{otp}</Text>
            <p style={styles.otpSub}>Provide this code to the professional when they reach your doorstep.</p>
          </View>
        ) : null}

        {/* Contact actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>📞 Call Masked Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.chatBtn]}>
            <Text style={styles.actionBtnText}>💬 Open Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapSimulator: {
    flex: 1.2,
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtn: {
    marginRight: 12,
  },
  backText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  mapGrid: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.05,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  pin: {
    position: 'absolute',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pinText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  customerPin: {
    top: '45%',
    left: '45%',
    backgroundColor: colors.success,
  },
  workerPin: {
    backgroundColor: colors.primary,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  etaBox: {
    alignItems: 'flex-end',
  },
  etaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  distanceText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  otpCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  otpValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
    marginVertical: 6,
  },
  otpSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtn: {
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
