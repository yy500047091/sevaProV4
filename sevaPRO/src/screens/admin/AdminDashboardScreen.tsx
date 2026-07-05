import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ActivityIndicator, FlatList, StatusBar, RefreshControl, Alert, Modal
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

export default function AdminDashboardScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCompleted: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes, providersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/bookings/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/bookings/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/bookings/providers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBookings(bookingsRes.data.bookings);
      setStats(statsRes.data);
      setProviders(providersRes.data.providers);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleAssign = async (providerId: string) => {
    if (!selectedBookingId) return;
    try {
      await axios.put(
        `${API_BASE_URL}/api/bookings/${selectedBookingId}/assign`,
        { providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Provider assigned successfully');
      setShowProviderModal(false);
      setSelectedBookingId(null);
      onRefresh();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to assign provider');
    }
  };

  const openAssignModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowProviderModal(true);
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceIcon}>{item.service?.icon || '🔧'}</Text>
          <View>
            <Text style={styles.serviceName}>{item.service?.name || 'Service'}</Text>
            <Text style={styles.customerName}>{item.customer?.name} ({item.customer?.phone})</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(item.scheduledAt).toLocaleDateString()} at {new Date(item.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{item.address}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <TouchableOpacity style={styles.assignBtn} onPress={() => openAssignModal(item._id)}>
          <Text style={styles.assignBtnText}>Assign Provider</Text>
        </TouchableOpacity>
      )}
      
      {item.status === 'assigned' && item.provider && (
        <View style={styles.assignedBadge}>
          <Text style={styles.assignedText}>Assigned to: {item.provider.name}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Completed</Text>
          <Text style={styles.statValue}>{stats.totalCompleted}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>₹{stats.totalRevenue}</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'assigned' && styles.activeTab]} 
          onPress={() => setActiveTab('assigned')}
        >
          <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>Assigned</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No {activeTab} bookings found.</Text>
            }
          />
        )}
      </View>

      {/* Provider Assignment Modal */}
      <Modal visible={showProviderModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProviderModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Provider</Text>
            {providers.length === 0 ? (
              <Text style={styles.emptyText}>No providers available</Text>
            ) : (
              providers.map((p: any) => (
                <TouchableOpacity key={p._id} style={styles.providerOption} onPress={() => handleAssign(p._id)}>
                  <Text style={styles.providerName}>{p.name}</Text>
                  <Text style={styles.providerPhone}>{p.phone || p.email}</Text>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setShowProviderModal(false)}>
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 16, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  statLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#1E293B' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  content: { flex: 1 },
  loader: { marginTop: 50 },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  serviceInfo: { flexDirection: 'row', alignItems: 'center' },
  serviceIcon: { fontSize: 28, marginRight: 12 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 2 },
  customerName: { fontSize: 13, color: '#94A3B8' },
  cardBody: { gap: 12, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: '#64748B', flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '500', color: '#E2E8F0', flex: 2, textAlign: 'right' },
  assignBtn: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  assignBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  assignedBadge: { backgroundColor: '#064E3B', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#059669' },
  assignedText: { color: '#34D399', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 40, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 20, textAlign: 'center' },
  providerOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  providerName: { fontSize: 16, color: '#FFF', fontWeight: '500' },
  providerPhone: { fontSize: 14, color: '#94A3B8' },
  cancelModalBtn: { marginTop: 24, paddingVertical: 16, alignItems: 'center' },
  cancelModalText: { color: '#EF4444', fontSize: 16, fontWeight: '600' }
});
