import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';

interface Booking {
  _id: string;
  service?: { name: string; icon?: string };
  serviceName?: string;
  customer?: { name: string; phone?: string };
  customerName?: string;
  address: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  scheduledAt: string;
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default function ProviderDashboardScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to load your jobs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [fetchBookings])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const handleMarkDone = (bookingId: string) => {
    Alert.alert('Mark as Done', 'Confirm this job has been completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setCompletingId(bookingId);
          try {
            await axios.patch(
              `${API_BASE_URL}/api/bookings/${bookingId}/complete`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings();
          } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.error || 'Could not mark job as done.');
          } finally {
            setCompletingId(null);
          }
        },
      },
    ]);
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const serviceName = item.service?.name || item.serviceName || 'Service';
    const serviceIcon = item.service?.icon || '🔧';
    const customerName = item.customer?.name || item.customerName || 'Customer';
    const isCompleting = completingId === item._id;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{serviceIcon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardService}>{serviceName}</Text>
            <Text style={styles.cardCustomer}>👤 {customerName}</Text>
            {item.customer?.phone ? (
              <Text style={styles.cardCustomer}>📞 {item.customer.phone}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.cardDivider} />

        <Text style={styles.cardAddress}>📍 {item.address}</Text>
        <Text style={styles.cardMeta}>📅 {formatDate(item.scheduledAt)}</Text>

        <TouchableOpacity
          style={[styles.doneBtn, isCompleting && styles.doneBtnDisabled]}
          onPress={() => handleMarkDone(item._id)}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.doneBtnText}>✓ Mark as Done</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Provider Dashboard</Text>
          <Text style={styles.userName}>{user?.name || 'Provider'} 🔧</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Assigned Jobs</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗓️</Text>
          <Text style={styles.emptyTitle}>No assigned jobs</Text>
          <Text style={styles.emptySubtitle}>Pull down to refresh</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  userName: { fontSize: 20, color: '#F1F5F9', fontWeight: '800' },
  logoutBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: { fontSize: 13, color: '#EF4444', fontWeight: '700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F1F5F9',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
  emptySubtitle: { fontSize: 14, color: '#475569', marginTop: 6 },
  listContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardService: { fontSize: 15, fontWeight: '700', color: '#F1F5F9', marginBottom: 2 },
  cardCustomer: { fontSize: 12, color: '#94A3B8' },
  cardDivider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  cardAddress: { fontSize: 13, color: '#CBD5E1', marginBottom: 6, lineHeight: 18 },
  cardMeta: { fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 14 },
  doneBtn: {
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnDisabled: { opacity: 0.6 },
  doneBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
