import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function PinEntryModal({ visible, onSubmit, onCancel }) {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    const value = pin;
    setPin('');
    onSubmit(value);
  };

  const handleCancel = () => {
    setPin('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter your PIN</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="••••••"
            placeholderTextColor="#ccc"
            autoFocus
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, pin.length < 4 && styles.confirmBtnDisabled]}
              onPress={handleSubmit}
              disabled={pin.length < 4}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '82%', backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 16, textAlign: 'center', color: '#1a1a1a' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 16,
  },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center' },
  cancelText: { color: COLORS.primary, fontWeight: '600' },
  confirmBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmText: { color: '#fff', fontWeight: '600' },
});
