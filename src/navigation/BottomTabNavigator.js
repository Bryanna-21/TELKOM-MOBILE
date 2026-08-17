import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons as Icon } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ScanScreen from '../screens/ScanScreen';
import SupportScreen from '../screens/SupportScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = size || 24;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'dashboard' : 'dashboard';
              break;
            case 'History':
              iconName = focused ? 'history' : 'history';
              break;
            case 'Scan':
              iconName = focused ? 'qr-code-scanner' : 'qr-code-scanner';
              break;
            case 'Support':
              iconName = focused ? 'support-agent' : 'support-agent';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
