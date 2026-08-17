import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const MoreScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(false);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Profile', route: 'Profile' },
        { icon: 'security', label: 'Security', route: 'Security' },
        { icon: 'history', label: 'Transaction History', route: 'History' },
      ],
    },
    {
      title: 'Services',
      items: [
        { icon: 'phone-android', label: 'Airtime Top-up', route: 'BuyAirtime' },
        { icon: 'wifi', label: 'Data Bundles', route: 'BuyBundle' },
        { icon: 'receipt', label: 'Pay Bills', route: 'PayBill' },
        { icon: 'shop', label: 'T-Kash Shop', route: 'Shop' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { icon: 'notifications', label: 'Notifications', action: 'toggle' },
        { icon: 'fingerprint', label: 'Biometrics', action: 'toggle' },
        { icon: 'language', label: 'Language', route: 'Language' },
        { icon: 'help', label: 'Help & Support', route: 'Support' },
      ],
    },
  ];

  const renderMenuItem = (item) => {
    if (item.action === 'toggle') {
      return (
        <View key={item.label} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Icon name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </View>
          <Switch
            value={item.label === 'Notifications' ? notifications : biometrics}
            onValueChange={(value) => {
              if (item.label === 'Notifications') {
                setNotifications(value);
              } else {
                setBiometrics(value);
              }
            }}
            trackColor={{ false: '#ddd', true: COLORS.primary }}
            thumbColor="#fff"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.label}
        style={styles.menuItem}
        onPress={() => item.route && navigation.navigate(item.route)}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Icon name={item.icon} size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.menuLabel}>{item.label}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Icon name="person" size={48} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Alice Wanjiku</Text>
          <Text style={styles.profilePhone}>+254 712 345 678</Text>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {menuSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionItems}>
            {section.items.map(renderMenuItem)}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn}>
        <Icon name="logout" size={24} color={COLORS.danger} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.versionSubtext}>© 2024 T-Kash Connect</Text>
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
    padding: 20,
    paddingTop: 48,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profilePhone: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  editProfileBtn: {
    marginTop: 4,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionItems: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    ...SHADOWS.small,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
});

export default MoreScreen;
