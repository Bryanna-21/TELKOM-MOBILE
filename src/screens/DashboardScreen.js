import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, USSD_CODES } from '../constants/theme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { OfflineStorage } from '../services/offlineStorage';

const DashboardScreen = ({ navigation }) => {
  const [balance, setBalance] = useState({
    airtime: 3250,
    tkash: 450,
    data: '1.2GB',
  });
  const [ziadaPoints, setZiadaPoints] = useState(1250);
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { status, executeOperation, getNetworkType } = useNetworkStatus();
  const { requireAuth, PinModal } = useBiometricAuth();

  const quickActions = [
    { 
      id: 'send', 
      label: 'Send Money', 
      icon: 'send', 
      route: 'SendMoney',
      color: '#4CAF50',
      requiresAuth: true
    },
    { 
      id: 'airtime', 
      label: 'Buy Airtime', 
      icon: 'phone-android', 
      route: 'BuyAirtime',
      color: '#FF9800',
      requiresAuth: false
    },
    { 
      id: 'data', 
      label: 'Buy Data', 
      icon: 'wifi', 
      route: 'BuyData',
      color: '#2196F3',
      requiresAuth: false
    },
    { 
      id: 'paybill', 
      label: 'Pay Bill', 
      icon: 'receipt', 
      route: 'PayBill',
      color: '#9C27B0',
      requiresAuth: true
    },
    { 
      id: 'lipa', 
      label: 'Lipa T-Kash', 
      icon: 'payment', 
      route: 'LipaTkash',
      color: '#E91E63',
      requiresAuth: true
    },
    { 
      id: 'ziada', 
      label: 'Ziada Rewards', 
      icon: 'stars', 
      route: 'ZiadaRewards',
      color: '#FFD700',
      requiresAuth: false
    },
  ];

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const airtime = await OfflineStorage.getCachedBalance('airtime');
      const tkash = await OfflineStorage.getCachedBalance('tkash');
      
      if (airtime > 0) {
        setBalance(prev => ({ ...prev, airtime }));
      }
      if (tkash > 0) {
        setBalance(prev => ({ ...prev, tkash }));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    
    try {
      const result = await executeOperation({
        type: 'check_balance',
        endpoint: '/balance',
        method: 'GET',
        balanceType: 'general'
      });

      if (result.success && result.data) {
        setBalance({
          airtime: result.data.airtime || balance.airtime,
          tkash: result.data.tkash || balance.tkash,
          data: result.data.data || balance.data,
        });
      }

      // Also fetch Ziada points
      const pointsResult = await executeOperation({
        type: 'ziada_points',
        endpoint: '/ziada/points',
        method: 'GET',
      });

      if (pointsResult.success && pointsResult.data) {
        setZiadaPoints(pointsResult.data.points || ziadaPoints);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not refresh balance. Showing cached data.');
    }

    setRefreshing(false);
  };

  const handleQuickAction = async (action) => {
    if (action.requiresAuth) {
      await requireAuth(async () => {
        navigation.navigate(action.route);
      });
    } else {
      navigation.navigate(action.route);
    }
  };

  const handleZiadaRedeem = async () => {
    await requireAuth(async () => {
      Alert.alert(
        'Redeem Ziada Points',
        `You have ${ziadaPoints} points. What would you like to redeem?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Airtime', 
            onPress: () => {
              Alert.alert('Success!', '500 points redeemed for KSh 50 airtime.');
            }
          },
          { 
            text: 'Data Bundle', 
            onPress: () => {
              Alert.alert('Success!', '750 points redeemed for 100MB data.');
            }
          }
        ]
      );
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
      }
    >
      {/* Network Status Banner */}
      <View style={[
        styles.networkBanner,
        status === 'online' ? styles.online : 
        status === 'gsm_fallback' ? styles.gsmFallback : styles.offline
      ]}>
        <Icon 
          name={
            status === 'online' ? 'wifi' :
            status === 'gsm_fallback' ? 'signal-cellular-4-bar' :
            'signal-cellular-off'
          } 
          size={16} 
          color="#fff" 
        />
        <Text style={styles.networkText}>{getNetworkType()}</Text>
        {status !== 'online' && (
          <Text style={styles.networkSubtext}>
            {status === 'offline' ? 'Using cached data' : 'USSD/SMS mode active'}
          </Text>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back, Alice!</Text>
          <Text style={styles.subtitle}>Telkom Plus</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Icon name="person" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={[styles.balanceCard, styles.airtimeCard]}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Airtime Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Icon 
                name={showBalance ? 'visibility' : 'visibility-off'} 
                size={20} 
                color={COLORS.gray} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? `KSh ${balance.airtime.toLocaleString()}` : '****'}
          </Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceActionBtn}>
              <Text style={styles.balanceActionText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.balanceCard, styles.tkashCard]}>
          <Text style={styles.balanceLabel}>T-Kash Wallet</Text>
          <Text style={styles.balanceAmount}>
            {showBalance ? `KSh ${balance.tkash.toLocaleString()}` : '****'}
          </Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceActionBtn}>
              <Text style={styles.balanceActionText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.balanceActionBtn, styles.withdrawBtn]}>
              <Text style={[styles.balanceActionText, styles.withdrawText]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Active Data */}
      <View style={styles.dataCard}>
        <Icon name="wifi" size={24} color={COLORS.primary} />
        <View style={styles.dataInfo}>
          <Text style={styles.dataTitle}>Active Data Bundle</Text>
          <Text style={styles.dataDetails}>{balance.data} remaining</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.dataBtn}>
          <Text style={styles.dataBtnText}>Buy More</Text>
        </TouchableOpacity>
      </View>

      {/* Ziada Rewards Widget */}
      <TouchableOpacity style={styles.ziadaCard} onPress={handleZiadaRedeem}>
        <View style={styles.ziadaHeader}>
          <Icon name="stars" size={24} color="#FFD700" />
          <Text style={styles.ziadaTitle}>Ziada Rewards</Text>
        </View>
        <Text style={styles.ziadaPoints}>{ziadaPoints} points</Text>
        <Text style={styles.ziadaSubtext}>Tap to redeem</Text>
        <View style={styles.ziadaProgress}>
          <View style={[styles.ziadaProgressFill, { width: '45%' }]} />
          <Text style={styles.ziadaProgressText}>1,250 / 2,500</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => handleQuickAction(action)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Icon name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              {action.requiresAuth && (
                <Icon name="lock" size={10} color={COLORS.gray} style={styles.lockIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick USSD Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick USSD Access</Text>
        <View style={styles.ussdGrid}>
          <TouchableOpacity style={styles.ussdItem}>
            <Text style={styles.ussdCode}>*544#</Text>
            <Text style={styles.ussdLabel}>Check Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ussdItem}>
            <Text style={styles.ussdCode}>*334#</Text>
            <Text style={styles.ussdLabel}>T-Kash Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ussdItem}>
            <Text style={styles.ussdCode}>*522#</Text>
            <Text style={styles.ussdLabel}>Pay Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ussdItem}>
            <Text style={styles.ussdCode}>*460#</Text>
            <Text style={styles.ussdLabel}>Ziada Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
      <PinModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  networkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
  },
  online: {
    backgroundColor: COLORS.success,
  },
  gsmFallback: {
    backgroundColor: COLORS.warning,
  },
  offline: {
    backgroundColor: COLORS.danger,
  },
  networkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  networkSubtext: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
    opacity: 0.8,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  airtimeCard: {
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  tkashCard: {
    borderTopWidth: 4,
    borderTopColor: COLORS.secondary,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginVertical: 4,
  },
  balanceActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  balanceActionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  withdrawBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  balanceActionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  withdrawText: {
    color: COLORS.primary,
  },
  dataCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dataInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dataDetails: {
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
  dataBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dataBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ziadaCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ziadaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ziadaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  ziadaPoints: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  ziadaSubtext: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  ziadaProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  ziadaProgressFill: {
    flex: 1,
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  ziadaProgressText: {
    color: '#aaa',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  lockIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  ussdGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ussdItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ussdCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ussdLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default DashboardScreen;
