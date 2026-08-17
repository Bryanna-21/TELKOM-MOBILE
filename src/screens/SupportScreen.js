import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import * as SMS from 'expo-sms';

const SupportScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useNetworkStatus();

  const commonIssues = [
    'Failed transaction',
    'Balance inquiry',
    'T-Kash not working',
    'Ziada points missing',
    'Network issues',
    'Data bundle not activating',
  ];

  const sendTicket = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please describe your issue');
      return;
    }

    setIsLoading(true);

    try {
      if (status === 'online') {
        // Send via API
        await sendOnlineTicket(message);
      } else {
        // Fallback to SMS
        await sendSMSTicket(message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not send ticket. Please try again.');
    }

    setIsLoading(false);
  };

  const sendOnlineTicket = async (msg) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTicketId = `TKT-${Date.now().toString().slice(-6)}`;
    setTicketId(newTicketId);
    Alert.alert(
      'Ticket Created',
      `Your support ticket #${newTicketId} has been created. We'll get back to you soon.`,
      [{ text: 'OK' }]
    );
    setMessage('');
  };

  const sendSMSTicket = async (msg) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'SMS not available. Please call Telkom support.');
      return;
    }

    const { result } = await SMS.sendSMSAsync(
      ['544'],
      `Support: ${msg}\nTime: ${new Date().toLocaleString()}\nNetwork: ${status}`
    );

    if (result === 'sent') {
      Alert.alert(
        'SMS Sent',
        'Your support message has been sent via SMS. We\'ll respond shortly.',
        [{ text: 'OK' }]
      );
      setMessage('');
    }
  };

  const handleQuickIssue = (issue) => {
    setMessage(issue);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Icon 
            name={status === 'online' ? 'wifi' : 'sms'} 
            size={24} 
            color={status === 'online' ? COLORS.success : COLORS.warning} 
          />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {status === 'online' ? 'Live Chat Available' : 'SMS Mode Active'}
            </Text>
            <Text style={styles.statusSubtext}>
              {status === 'online' 
                ? 'Connect with our support agents instantly' 
                : 'Messages will be sent via SMS (data-free)'}
            </Text>
          </View>
        </View>

        <View style={styles.quickIssues}>
          <Text style={styles.sectionTitle}>Common Issues</Text>
          <View style={styles.issuesGrid}>
            {commonIssues.map((issue, index) => (
              <TouchableOpacity
                key={index}
                style={styles.issueBtn}
                onPress={() => handleQuickIssue(issue)}
              >
                <Text style={styles.issueText}>{issue}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.sectionTitle}>Describe Your Issue</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Please describe your issue in detail..."
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#999"
          />
          
          <View style={styles.attachmentBar}>
            <TouchableOpacity style={styles.attachBtn}>
              <Icon name="attach-file" size={20} color={COLORS.primary} />
              <Text style={styles.attachText}>Attach Screenshot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachBtn}>
              <Icon name="location-on" size={20} color={COLORS.primary} />
              <Text style={styles.attachText}>Share Location</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
            onPress={sendTicket}
            disabled={isLoading}
          >
            <Text style={styles.sendBtnText}>
              {isLoading ? 'Sending...' : 'Send Support Ticket'}
            </Text>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Other Ways to Reach Us</Text>
          <TouchableOpacity style={styles.contactItem}>
            <Icon name="phone" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+254 700 123 456</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Icon name="email" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@telkom.co.ke</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <Icon name="map" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Find a Store</Text>
              <Text style={styles.contactValue}>Locate nearest Telkom outlet</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {ticketId && (
          <View style={styles.ticketCard}>
            <Icon name="check-circle" size={24} color={COLORS.success} />
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>Ticket Created</Text>
              <Text style={styles.ticketId}>#{ticketId}</Text>
            </View>
          </View>
        )}
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  quickIssues: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  issuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  issueText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  attachmentBar: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 12,
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ticketInfo: {
    marginLeft: 12,
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  ticketId: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default SupportScreen;
