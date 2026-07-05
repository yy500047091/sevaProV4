import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ActivityIndicator, FlatList, StatusBar, Alert
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

export default function HomeScreen({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.services);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingForm', { service: item })}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon || '🔧'}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardPrice}>₹{item.price}</Text>
      <Text style={styles.cardDuration}>{item.duration} min</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name || 'Guest'}</Text>
          <Text style={styles.title}>What service do you need today?</Text>
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
            data={services}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CustomerOrders')}>
          <Text style={styles.navText}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 },
  greeting: { fontSize: 16, color: '#94A3B8', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', maxWidth: '85%' },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, backgroundColor: '#F8FAFC', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 20 },
  loader: { marginTop: 50 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { flex: 1, backgroundColor: '#FFFFFF', margin: 8, padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A', textAlign: 'center', marginBottom: 4 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  cardDuration: { fontSize: 12, color: '#64748B' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 20, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  navText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  navTextActive: { color: colors.primary },
});
