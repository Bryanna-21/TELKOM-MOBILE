import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const ScanScreen = ({ navigation }) => {
  const [scanning, setScanning] = useState(false);

  // QR Scanner component would go here
  // For now, we'll show a placeholder

  const handleScan = () => {
    Alert.alert(
      'Scan QR Code',
      'Point your camera at the QR code',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Scan',
          onPress: () => {
            // Simulate QR scan
            Alert.alert(
              'QR Scanned!',
              'Pay to: John Mwangi\nAmount: KSh 500',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Pay', onPress: () => navigation.navigate('SendMoney') }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <View style={styles.scannerOverlay}>
            <Icon name="qr-code-scanner" size={80} color={COLORS.primary} />
            <Text style={styles.scannerText}>Place QR code in the frame</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Icon name="camera-alt" size={24} color="#fff" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryButton}>
          <Icon name="photo-library" size={24} color={COLORS.primary} />
          <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to scan</Text>
        <View style={styles.infoRow}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Open the QR scanner</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Point camera at QR code</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Confirm payment amount</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 4,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 4,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 4,
  },
  scannerOverlay: {
    alignItems: 'center',
    opacity: 0.6,
  },
  scannerText: {
    marginTop: 12,
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 12,
  },
  galleryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default ScanScreen;
