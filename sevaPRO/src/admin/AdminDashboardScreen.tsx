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
  Modal,
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';

type BookingStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

interface Booking {
  _id: string;
  service?: { name: string; icon?: string };
  serviceName?: string;
  customer?: { name: string; phone?: string };
  customerName?: string;
  address: string;
  status: BookingStatus;
  scheduledAt: string;
  provider?: { _id: string; name: string } | null;
}

interface Provider {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface Stats {
  totalCompleted: number;
  totalRevenue: number;
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

export default function AdminDashboardScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCompleted: 0, totalRevenue: 0 });
  const [activeTab, setActiveTab] = useState<'pending' | 'assigned'>('pending');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const fetchAll = useCallback(async () => {
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [bookingsRes, statsRes, providersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/bookings/admin`, authHeaders),
        axios.get(`${API_BASE_URL}/api/bookings/stats`, authHeaders),
        axios.get(`${API_BASE_URL}/api/bookings/providers`, authHeaders),
      ]);
      setBookings(bookingsRes.data);
      setStats({
        totalCompleted: statsRes.data.totalCompleted ?? statsRes.data.completedCount ?? 0,
        totalRevenue: statsRes.data.totalRevenue ?? statsRes.data.revenue ?? 0,
      });
      setProviders(providersRes.data);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAll();
    }, [fetchAll])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAll();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const openAssignModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setAssignModalVisible(true);
  };

  const handleAssign = async (providerId: string) => {
    if (!selectedBookingId) return;
    setAssigning(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/bookings/${selectedBookingId}/assign`,
        { providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignModalVisible(false);
      setSelectedBookingId(null);
      fetchAll();
    } catch (error: any) {
      Alert.alert('Assign Failed', error?.response?.data?.error || 'Could not assign provider.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  const renderBooking = ({ item }: { item: Booking }) => {
    const serviceName = item.service?.name || item.serviceName || 'Service';
    const customerName = item.customer?.name || item.customerName || 'Customer';

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardService}>{serviceName}</Text>
            <Text style={styles.cardCustomer}>👤 {customerName}</Text>
            <Text style={styles.cardAddress} numberOfLines={2}>📍 {item.address}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'pending' ? styles.badgePending : styles.badgeAssigned,
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBottom}>
          <Text style={styles.cardMeta}>📅 {formatDate(item.scheduledAt)}</Text>
          {item.provider?.name ? (
            <Text style={styles.cardMeta}>🔧 {item.provider.name}</Text>
          ) : null}
        </View>

        {item.status === 'pending' && (
          <TouchableOpacity style={styles.assignBtn} onPress={() => openAssignModal(item._id)}>
            <Text style={styles.assignBtnText}>Assign Provider →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.userName}>{user?.name || 'Admin'} 🛡️</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Panel */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCompleted}</Text>
          <Text style={styles.statLabel}>Completed Jobs</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAlt]}>
          <Text style={styles.statValue}>₹{stats.totalRevenue}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'assigned' && styles.tabBtnActive]}
          onPress={() => setActiveTab('assigned')}
        >
          <Text style={[styles.tabText, activeTab === 'assigned' && styles.tabTextActive]}>
            Assigned ({bookings.filter((b) => b.status === 'assigned').length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
        />
      )}

      {/* Assign Provider Modal */}
      <Modal
        visible={assignModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select a Provider</Text>
            {providers.length === 0 ? (
              <Text style={styles.noProvidersText}>No providers available.</Text>
            ) : (
              <FlatList
                data={providers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.providerOption}
                    onPress={() => handleAssign(item._id)}
                    disabled={assigning}
                  >
                    <View>
                      <Text style={styles.providerName}>{item.name}</Text>
                      {item.phone ? <Text style={styles.providerSub}>{item.phone}</Text> : null}
                    </View>
                    {assigning && <ActivityIndicator color={colors.primary} size="small" />}
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setAssignModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statCardAlt: { borderColor: colors.primary },
  statValue: { fontSize: 24, fontWeight: '800', color: '#F1F5F9' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '600' },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#94A3B8' },
  listContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardInfo: { flex: 1, marginRight: 8 },
  cardService: { fontSize: 15, fontWeight: '700', color: '#F1F5F9', marginBottom: 4 },
  cardCustomer: { fontSize: 12, color: '#94A3B8', marginBottom: 2 },
  cardAddress: { fontSize: 12, color: '#64748B' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  badgePending: { backgroundColor: '#451A03' },
  badgeAssigned: { backgroundColor: '#172554' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#F1F5F9' },
  cardDivider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  cardBottom: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  cardMeta: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  assignBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  assignBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  noProvidersText: { textAlign: 'center', color: '#64748B', paddingVertical: 24 },
  providerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
  },
  providerName: { fontSize: 15, fontWeight: '700', color: '#F1F5F9' },
  providerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  modalCancelBtn: {
    marginHorizontal: 24,
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCancelText: { fontSize: 15, color: '#64748B', fontWeight: '600' },
});
