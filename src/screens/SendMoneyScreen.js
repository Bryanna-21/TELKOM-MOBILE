import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const SendMoneyScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [100, 200, 500, 1000];

  const handleSend = () => {
    if (!phoneNumber || !amount) {
      Alert.alert('Error', 'Please enter recipient and amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send KSh ${numAmount.toLocaleString()} to ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          style: 'default',
          onPress: processTransaction
        }
      ]
    );
  };

  const processTransaction = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success!',
        `KSh ${parseFloat(amount).toLocaleString()} sent to ${phoneNumber}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Recipient</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+254</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.contactBtn}>
              <Icon name="contacts" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Amount (KES)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#999"
          />
          <View style={styles.quickAmounts}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountBtn,
                  parseFloat(amount) === value && styles.quickAmountBtnActive
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text style={[
                  styles.quickAmountText,
                  parseFloat(amount) === value && styles.quickAmountTextActive
                ]}>
                  KSh {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's this for?"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>
              KSh {amount ? parseFloat(amount).toLocaleString() : '0.00'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fee</Text>
            <Text style={styles.summaryValue}>KSh 0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              KSh {amount ? parseFloat(amount).toLocaleString() : '0.00'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Processing...' : 'Send Money'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  contactBtn: {
    padding: 4,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  quickAmountBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  quickAmountBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickAmountText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '500',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  noteInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: COLORS.gray,
    fontSize: 14,
  },
  summaryValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 6,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SendMoneyScreen;
