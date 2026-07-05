import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ActivityIndicator, FlatList, StatusBar, RefreshControl, Alert
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { RootState } from '../../store';

export default function CustomerOrdersScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B'; // Orange
      case 'assigned': return '#3B82F6'; // Blue
      case 'completed': return '#10B981'; // Green
      case 'cancelled': return '#EF4444'; // Red
      default: return '#64748B';
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceIcon}>{item.service?.icon || '🔧'}</Text>
          <Text style={styles.serviceName}>{item.service?.name || 'Service'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
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
          <Text style={styles.detailValue} numberOfLines={1}>{item.address}</Text>
        </View>
        {item.provider && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{item.provider.name}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No bookings yet. Book a service to get started!</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#0F172A' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 20 },
  backButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { marginTop: 50 },
  listContainer: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  serviceInfo: { flexDirection: 'row', alignItems: 'center' },
  serviceIcon: { fontSize: 24, marginRight: 12 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  cardBody: { gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: '#64748B', flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '500', color: '#0F172A', flex: 2, textAlign: 'right' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24 }
});
