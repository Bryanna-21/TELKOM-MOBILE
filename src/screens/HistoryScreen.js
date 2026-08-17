import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const HistoryScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    {
      id: '1',
      type: 'send',
      title: 'Safaricom M-Pesa',
      date: 'Today, 09:50 AM',
      amount: -2000,
      status: 'completed',
      icon: 'arrow-upward',
      iconBg: '#FFEBEE',
      iconColor: COLORS.danger,
    },
    {
      id: '2',
      type: 'purchase',
      title: 'Data Bundle Purchase',
      date: 'Yesterday, 05:59 PM',
      amount: -2000,
      status: 'completed',
      icon: 'wifi',
      iconBg: '#E3F2FD',
      iconColor: COLORS.primary,
    },
    {
      id: '3',
      type: 'deposit',
      title: 'Salary Deposit',
      date: 'Yesterday, 02:40 PM',
      amount: 1000,
      status: 'completed',
      icon: 'arrow-downward',
      iconBg: '#E8F5E9',
      iconColor: COLORS.success,
    },
    {
      id: '4',
      type: 'paybill',
      title: 'KPLC Bill Payment',
      date: 'Aug 12, 2024',
      amount: -1500,
      status: 'completed',
      icon: 'receipt',
      iconBg: '#F3E5F5',
      iconColor: '#9C27B0',
    },
    {
      id: '5',
      type: 'send',
      title: 'Send to John Mwangi',
      date: 'Aug 11, 2024',
      amount: -500,
      status: 'pending',
      icon: 'arrow-upward',
      iconBg: '#FFF3E0',
      iconColor: COLORS.warning,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'failed':
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'send', label: 'Sent' },
    { id: 'receive', label: 'Received' },
    { id: 'purchase', label: 'Purchases' },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(query);
    }
    return true;
  });

  const renderTransaction = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: item.iconBg }]}>
        <Icon name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <View style={styles.statusBadge}>
         
