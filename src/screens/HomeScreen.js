import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState({
    main: 3250,
    tKash: 450,
  });
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const quickActions = [
    { id: 'send', label: 'Send Money', icon: 'send', route: 'SendMoney', color: '#4CAF50' },
    { id: 'airtime', label: 'Buy Airtime', icon: 'phone-android', route: 'BuyAirtime', color: '#FF9800' },
    { id: 'bundle', label: 'Data Bundle', icon: 'wifi', route: 'BuyBundle', color: '#2196F3' },
    { id: 'paybill', label: 'Pay Bill', icon: 'receipt', route: 'PayBill', color: '#9C27B0' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleQuickAction = (route) => {
    navigation.navigate(route);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, Alice!</Text>
          <Text style={styles.provider}>Telkom Plus</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account-circle" size={44} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={[styles.balanceCard, styles.mainBalance]}>
          <Text style={styles.balanceLabel}>Main Balance</Text>
          <Text style={styles.balanceAmount}>
            {showBalance ? `KSh ${balance.main.toLocaleString()}` : '****'}
          </Text>
          <TouchableOpacity 
            style={styles.showHideBtn}
            onPress={() => setShowBalance(!showBalance)}
          >
            <Icon 
              name={showBalance ? 'visibility' : 'visibility-off'} 
              size={20} 
              color={COLORS.gray} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.balanceCard, styles.tKashCard]}>
          <Text style={styles.balanceLabel}>T-Kash Wallet</Text>
          <Text style={styles.balanceAmount}>
            {showBalance ? `KSh ${balance.tKash.toLocaleString()}` : '****'}
          </Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Active Bundle */}
      <View style={styles.bundleCard}>
        <Icon name="wifi" size={28} color={COLORS.primary} />
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleTitle}>Active Data Bundle</Text>
          <Text style={styles.bundleDetails}>1.2GB remaining (Exp. 25 Aug)</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Buy</Text>
        </TouchableOpacity>
      </View>

      {/* Free Minutes */}
      <View style={styles.bundleCard}>
        <Icon name="phone" size={28} color={COLORS.secondary} />
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleTitle}>Free Minutes</Text>
          <Text style={styles.bundleDetails}>180 min (On-net) remaining</Text>
        </View>
        <TouchableOpacity style={[styles.buyBtn, { backgroundColor: COLORS.secondary }]}>
          <Text style={styles.buyBtnText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => handleQuickAction(action.route)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Icon name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionCard}>
          <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Icon name="arrow-upward" size={20} color={COLORS.danger} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Safaricom M-Pesa</Text>
              <Text style={styles.transactionDate}>Today, 09:50 AM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.negative]}>-KSh 2,000</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="arrow-upward" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Data Bundle Purchase</Text>
              <Text style={styles.transactionDate}>Yesterday, 05:59 PM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.negative]}>-KSh 2,000</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="arrow-downward" size={20} color={COLORS.success} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Salary Deposit</Text>
              <Text style={styles.transactionDate}>Yesterday, 02:40 PM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.positive]}>+KSh 1,000</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
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
    padding: 20,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  provider: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  profileBtn: {
    padding: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -20,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    ...SHADOWS.small,
  },
  mainBalance: {
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  tKashCard: {
    backgroundColor: COLORS.primaryLight,
    borderTopWidth: 4,
    borderTopColor: COLORS.secondary,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  showHideBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  balanceActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bundleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  bundleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bundleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bundleDetails: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginTop: 6,
    width: '80%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  buyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '23%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  negative: {
    color: COLORS.danger,
  },
  positive: {
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default HomeScreen;
