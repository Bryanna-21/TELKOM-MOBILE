import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Import screens
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import BuyAirtimeScreen from './src/screens/BuyAirtimeScreen';
import BuyDataScreen from './src/screens/BuyDataScreen';
import PayBillScreen from './src/screens/PayBillScreen';
import LipaTkashScreen from './src/screens/LipaTkashScreen';
import ZiadaRewardsScreen from './src/screens/ZiadaRewardsScreen';
import SupportScreen from './src/screens/SupportScreen';
import MerchantLocatorScreen from './src/screens/MerchantLocatorScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#0055A4" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
          <Stack.Screen name="BuyAirtime" component={BuyAirtimeScreen} />
          <Stack.Screen name="BuyData" component={BuyDataScreen} />
          <Stack.Screen name="PayBill" component={PayBillScreen} />
          <Stack.Screen name="LipaTkash" component={LipaTkashScreen} />
          <Stack.Screen name="ZiadaRewards" component={ZiadaRewardsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="MerchantLocator" component={MerchantLocatorScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
