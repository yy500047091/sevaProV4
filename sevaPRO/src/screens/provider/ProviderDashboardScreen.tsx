import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ActivityIndicator, FlatList, StatusBar, RefreshControl, Alert
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

export default function ProviderDashboardScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.bookings);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load assigned tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMarkDone = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await axios.patch(
        `${API_BASE_URL}/api/bookings/${bookingId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Job Completed!', 'The payment status has been updated.');
      fetchTasks();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to complete task');
    } finally {
      setActionLoading(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceIconContainer}>
          <Text style={styles.serviceIcon}>{item.service?.icon || '🔧'}</Text>
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.service?.name || 'Service Task'}</Text>
          <Text style={styles.scheduledTime}>
             {new Date(item.scheduledAt).toLocaleDateString()} • {new Date(item.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.customerBox}>
          <Text style={styles.customerLabel}>Customer Details</Text>
          <Text style={styles.customerName}>{item.customer?.name}</Text>
          <Text style={styles.customerPhone}>📞 {item.customer?.phone}</Text>
        </View>
        
        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>Location</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.doneBtn, actionLoading === item._id && styles.doneBtnDisabled]} 
        onPress={() => handleMarkDone(item._id)}
        disabled={actionLoading === item._id}
      >
        {actionLoading === item._id ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.doneBtnText}>Mark as Done ✓</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name}</Text>
          <Text style={styles.title}>Assigned Tasks</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎉</Text>
                <Text style={styles.emptyText}>No tasks assigned yet. Check back later!</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  greeting: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  content: { flex: 1 },
  loader: { marginTop: 50 },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#334155' },
  serviceIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#334155' },
  serviceIcon: { fontSize: 28 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  scheduledTime: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  cardBody: { gap: 16, marginBottom: 24 },
  customerBox: { backgroundColor: '#0F172A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  customerLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  customerName: { fontSize: 16, color: '#F1F5F9', fontWeight: '500', marginBottom: 4 },
  customerPhone: { fontSize: 14, color: '#94A3B8' },
  addressBox: { backgroundColor: '#0F172A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  addressLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  addressText: { fontSize: 14, color: '#E2E8F0', lineHeight: 20 },
  doneBtn: { backgroundColor: '#10B981', height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  doneBtnDisabled: { opacity: 0.7 },
  doneBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#94A3B8', textAlign: 'center', lineHeight: 24 }
});
