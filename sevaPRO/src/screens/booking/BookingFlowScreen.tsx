import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors } from '../../theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function BookingFlowScreen({ route, navigation }: any) {
  const { serviceId, subServiceId } = route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [date, setDate] = useState('2026-06-16');
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [line1, setLine1] = useState('Flat 405, Block B, Green Heights, Sector 62');
  const [city, setCity] = useState('Noida');
  const [pincode, setPincode] = useState('201301');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleProceedToPayment();
    }
  };

  const handleApplyPromo = () => {
    if (coupon === 'WELCOME100') {
      setCouponApplied(true);
      Alert.alert('Promo Applied', '₹100 discount applied to your order total!');
    } else {
      Alert.alert('Invalid Promo', 'Please try WELCOME100 for a valid discount.');
    }
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      // 1. Create booking in Express backend
      const bookingData = {
        serviceId,
        subServiceId,
        scheduledAt: `${date}T10:00:00Z`,
        address: {
          line1,
          city,
          state: 'Uttar Pradesh',
          pincode,
          lat: 28.6139,
          lng: 77.2090,
        },
        couponCode: couponApplied ? 'WELCOME100' : undefined,
      };

      const createResponse = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${user?.phone}` }, // simulated auth lookup
      });

      const { booking, paymentParams } = createResponse.data;

      // 2. Open Razorpay Checkouts (Simulated for local node)
      Alert.alert(
        'Razorpay Payment Gateway',
        `Simulate transaction for amount ₹${booking.pricing.total}?`,
        [
          {
            text: 'Simulate Failure',
            onPress: () => {
              setLoading(false);
              Alert.alert('Payment Failed', 'Order booking payment rejected.');
            },
          },
          {
            text: 'Simulate Success',
            onPress: async () => {
              try {
                // Verify payment
                const verifyResponse = await axios.post(
                  `${API_BASE_URL}/api/bookings/payment-verify`,
                  {
                    bookingId: booking.bookingId,
                    razorpayOrderId: paymentParams.orderId,
                    razorpayPaymentId: `pay_sim_${Date.now()}`,
                    razorpaySignature: 'simulated_signature_hash',
                  },
                  { headers: { Authorization: `Bearer ${user?.phone}` } }
                );

                setLoading(false);
                Alert.alert('Confirmed!', 'Your service request has been confirmed. Assigning verified worker...');
                navigation.navigate('MainTabs');
              } catch (verifyErr) {
                setLoading(false);
                Alert.alert('Error', 'Payment verification failed.');
              }
            },
          },
        ]
      );
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.response?.data?.error || 'Failed to initialize payment.';
      Alert.alert('Error', errMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Configure Booking</Text>
        <Text style={styles.progress}>Step {step} of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Step 1: Schedule Selection */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Schedule Slot Selection</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Service Date</Text>
              <TextInput style={styles.textInput} value={date} onChangeText={setDate} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Available Time Window</Text>
              <TextInput style={styles.textInput} value={timeSlot} onChangeText={setTimeSlot} />
            </View>
          </View>
        )}

        {/* Step 2: Address Specification */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Specify Address Area</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Flat / Street Line</Text>
              <TextInput style={styles.textInput} value={line1} onChangeText={setLine1} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.textInput} value={city} onChangeText={setCity} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput style={styles.textInput} value={pincode} onChangeText={setPincode} />
            </View>
          </View>
        )}

        {/* Step 3: Coupon and Review */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Apply Promo Code</Text>
            <View style={styles.couponRow}>
              <TextInput
                style={[styles.textInput, { flex: 1, marginRight: 12 }]}
                placeholder="Code WELCOME100"
                placeholderTextColor="#94A3B8"
                value={coupon}
                onChangeText={setCoupon}
              />
              <TouchableOpacity style={styles.couponButton} onPress={handleApplyPromo}>
                <Text style={styles.couponButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.reviewTitle}>Billing Summary</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Charges</Text>
              <Text style={styles.priceVal}>₹350</Text>
            </View>
            {couponApplied && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabelDiscount}>Promo Discount</Text>
                <Text style={styles.priceValDiscount}>- ₹100</Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Convenience & Platform Fee</Text>
              <Text style={styles.priceVal}>₹49</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST (18%)</Text>
              <Text style={styles.priceVal}>₹45</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable Amount</Text>
              <Text style={styles.totalVal}>₹{couponApplied ? 344 : 444}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())}
        >
          <Text style={styles.backBtnText}>{step > 1 ? 'Back' : 'Cancel'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.nextBtnText}>{step === 3 ? 'Proceed to Pay' : 'Next Step'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backLink: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  progress: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 24,
  },
  stepBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    backgroundColor: '#F8FAFC',
  },
  couponRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  couponButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  priceVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  priceLabelDiscount: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  priceValDiscount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.success,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backBtnText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
