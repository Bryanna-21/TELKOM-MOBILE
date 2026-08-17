import React, { useCallback, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import PinEntryModal from '../components/PinEntryModal';

export const useBiometricAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const pinResolverRef = useRef(null);

  // Renders a hidden-until-needed PIN modal and returns whatever the user
  // types (or null if they cancel). This exists because authenticateWithPin
  // used to require a `pin` argument that nothing in the app ever supplied —
  // meaning any device without enrolled biometrics could never complete a
  // requireAuth()-gated action (Send Money, Pay Bill, Lipa T-Kash, etc.).
  const promptForPin = useCallback(
    () =>
      new Promise((resolve) => {
        pinResolverRef.current = resolve;
        setPinModalVisible(true);
      }),
    []
  );

  const handlePinSubmit = useCallback((value) => {
    setPinModalVisible(false);
    pinResolverRef.current?.(value);
    pinResolverRef.current = null;
  }, []);

  const handlePinCancel = useCallback(() => {
    setPinModalVisible(false);
    pinResolverRef.current?.(null);
    pinResolverRef.current = null;
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      return { compatible, enrolled };
    } catch (error) {
      console.error('Biometric check error:', error);
      return { compatible: false, enrolled: false };
    }
  };

  const authenticate = async (options = {}) => {
    setIsLoading(true);

    try {
      const { compatible, enrolled } = await checkBiometricSupport();

      if (!compatible) {
        return authenticateWithPin(options.pin);
      }

      if (!enrolled) {
        Alert.alert(
          'No Biometrics Enrolled',
          'Please set up Face ID or Fingerprint in your device settings, or use your PIN.'
        );
        return authenticateWithPin(options.pin);
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.prompt || 'Verify your identity',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true, method: 'biometric' };
      } else {
        if (result.error === 'user_cancel') {
          setIsLoading(false);
          return { success: false, error: 'Authentication cancelled' };
        }
        return authenticateWithPin(options.pin);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const authenticateWithPin = async (pin) => {
    try {
      const enteredPin = pin ?? (await promptForPin());
      if (!enteredPin) {
        setIsLoading(false);
        return { success: false, error: 'PIN entry cancelled' };
      }

      const storedPin = await SecureStore.getItemAsync('user_pin');
      if (enteredPin === storedPin) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true, method: 'pin' };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid PIN' };
    } catch (error) {
      console.error('PIN auth error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const setUserPin = async (pin) => {
    try {
      await SecureStore.setItemAsync('user_pin', pin);
      return { success: true };
    } catch (error) {
      console.error('Set PIN error:', error);
      return { success: false };
    }
  };

  const requireAuth = async (action, options = {}) => {
    const result = await authenticate(options);
    if (result.success) {
      return await action();
    } else if (result.error !== 'Authentication cancelled' && result.error !== 'PIN entry cancelled') {
      Alert.alert('Authentication Required', 'Please verify your identity to continue.');
    }
    return null;
  };

  // Consumers must render this once, anywhere in their JSX tree, for the
  // PIN fallback to actually appear on screen — see DashboardScreen.js.
  const PinModal = () => (
    <PinEntryModal visible={pinModalVisible} onSubmit={handlePinSubmit} onCancel={handlePinCancel} />
  );

  return {
    authenticate,
    authenticateWithPin,
    setUserPin,
    requireAuth,
    isAuthenticated,
    isLoading,
    checkBiometricSupport,
    PinModal,
  };
};
