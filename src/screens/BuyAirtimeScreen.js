import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const BuyAirtimeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Buy Airtime</Text>
      <View style={{ width: 40 }} />
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>Buy Airtime</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: COLORS.gray, marginTop: 8 },
});

export default BuyAirtimeScreen;
