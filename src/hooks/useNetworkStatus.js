import { useEffect, useState } from 'react';
import { NetworkRouter } from '../services/networkRouter';
let routerInstance = null;

export const useNetworkStatus = () => {
  const [status, setStatus] = useState('offline');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true, unsubscribe;
    (async () => {
      try {
        if (!routerInstance) { routerInstance = new NetworkRouter(); await routerInstance.init(); }
        if (!mounted) return;
        setStatus(routerInstance.getNetworkState());
        setIsLoading(false);
        unsubscribe = routerInstance.addListener(setStatus);
      } catch (e) {
        console.warn('Network initialization failed:', e.message);
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; unsubscribe?.(); };
  }, []);

  const executeOperation = (operation) => routerInstance
    ? routerInstance.executeOperation(operation)
    : Promise.resolve({ success: false, error: 'Network router not ready' });

  return {
    status, isLoading, executeOperation,
    getNetworkType: () => status === 'online' ? 'Online' : status === 'gsm_fallback' ? 'GSM Mode' : 'Offline',
    isOnline: status === 'online', isGSMFallback: status === 'gsm_fallback', isOffline: status === 'offline'
  };
};
