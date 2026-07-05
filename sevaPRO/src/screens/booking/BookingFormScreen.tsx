import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, ScrollView, Modal
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../config/api';
import { RootState } from '../../store';

export default function BookingFormScreen({ route, navigation }: any) {
  const { service } = route.params;
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [loading, setLoading] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  const token = useSelector((state: RootState) => state.auth.token);

  const dates = ['Today', 'Tomorrow', 'Day After Tomorrow'];
  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const handleBook = async () => {
    if (!address.trim()) {
      Alert.alert('Required', 'Please enter your address.');
      return;
    }
    
    setLoading(true);
    try {
      // Create a mock ISO date based on selection for simplicity
      const scheduledAt = new Date().toISOString(); 
      
      await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          serviceId: service._id,
          address,
          scheduledAt
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Booking Confirmed!', 'Your booking is pending. We will assign a professional soon.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  const OptionModal = ({ visible, title, options, onSelect, onClose }: any) => (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((opt: string) => (
            <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => onSelect(opt)}>
              <Text style={styles.modalOptionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.serviceCard}>
          <View style={styles.serviceIconRow}>
            <Text style={styles.serviceIcon}>{service.icon}</Text>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDesc}>{service.description}</Text>
            </View>
          </View>
          <View style={styles.serviceMeta}>
            <Text style={styles.servicePrice}>₹{service.price}</Text>
            <Text style={styles.serviceDuration}>⏱ {service.duration} min</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Service Address</Text>
        <TextInput
          style={styles.addressInput}
          multiline
          numberOfLines={4}
          placeholder="Enter your full address (House No, Street, Landmark)"
          placeholderTextColor="#94A3B8"
          value={address}
          onChangeText={setAddress}
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.scheduleRow}>
          <TouchableOpacity style={styles.scheduleBtn} onPress={() => setShowDateModal(true)}>
            <Text style={styles.scheduleLabel}>Date</Text>
            <Text style={styles.scheduleValue}>{selectedDate}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scheduleBtn} onPress={() => setShowTimeModal(true)}>
            <Text style={styles.scheduleLabel}>Time</Text>
            <Text style={styles.scheduleValue}>{selectedTime}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.bookBtn, loading && styles.bookBtnDisabled]} 
          onPress={handleBook}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.bookBtnText}>Book Now - ₹{service.price}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <OptionModal 
        visible={showDateModal} 
        title="Select Date" 
        options={dates} 
        onSelect={(d: string) => { setSelectedDate(d); setShowDateModal(false); }} 
        onClose={() => setShowDateModal(false)} 
      />
      <OptionModal 
        visible={showTimeModal} 
        title="Select Time" 
        options={times} 
        onSelect={(t: string) => { setSelectedTime(t); setShowTimeModal(false); }} 
        onClose={() => setShowTimeModal(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#0F172A' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 20 },
  backButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 20 },
  serviceCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  serviceIconRow: { flexDirection: 'row', alignItems: 'flex-start' },
  serviceIcon: { fontSize: 40, marginRight: 16 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  serviceDesc: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  serviceMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  servicePrice: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  serviceDuration: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  addressInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, fontSize: 15, color: '#0F172A', minHeight: 100, marginBottom: 24 },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  scheduleBtn: { flex: 0.48, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16 },
  scheduleLabel: { fontSize: 12, color: '#64748B', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase' },
  scheduleValue: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  bookBtn: { backgroundColor: colors.primary, borderRadius: 14, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  bookBtnDisabled: { opacity: 0.7 },
  bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 16, color: '#0F172A', textAlign: 'center' }
});
