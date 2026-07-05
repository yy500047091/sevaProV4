import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../../theme';

const slides = [
  {
    title: 'Find Trusted Professionals',
    desc: 'Connect with verified local service professionals for all your home needs.',
    icon: '🔍',
  },
  {
    title: 'Real-Time Location Tracking',
    desc: 'Watch your service professional arrive on the live map in real time.',
    icon: '📍',
  },
  {
    title: 'Fast & Secure Checkout',
    desc: 'Pay safely with Razorpay integration and manage refund wallets.',
    icon: '💳',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [slideIndex, setSlideIndex] = useState(0);

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Slide Counter */}
        <Text style={styles.counter}>
          {slideIndex + 1} / {slides.length}
        </Text>

        {/* Vector Image representation */}
        <View style={styles.iconContainer}>
          <Text style={styles.vectorIcon}>{slides[slideIndex].icon}</Text>
        </View>

        {/* Details */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[slideIndex].title}</Text>
          <Text style={styles.desc}>{slides[slideIndex].desc}</Text>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.skipBtn}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {slideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
    alignSelf: 'flex-end',
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  vectorIcon: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipBtn: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
