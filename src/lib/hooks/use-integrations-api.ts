import { useState, useCallback } from 'react';
import { IntegrationStatus, IntegrationType } from '../types';
import { mockIntegrations } from '../mock';

export function useIntegrationsApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (): Promise<IntegrationStatus[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [...mockIntegrations];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch integrations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(async (
    type: IntegrationType, 
    config: Record<string, any>
  ): Promise<IntegrationStatus> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const integration = mockIntegrations.find(i => i.type === type);
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      const connectedIntegration: IntegrationStatus = {
        ...integration,
        connected: true,
        lastSync: new Date(),
        config
      };
      
      // In a real app, this would connect to the actual service
      return connectedIntegration;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async (type: IntegrationType): Promise<IntegrationStatus> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const integration = mockIntegrations.find(i => i.type === type);
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      const disconnectedIntegration: IntegrationStatus = {
        ...integration,
        connected: false,
        lastSync: undefined,
        config: {}
      };
      
      // In a real app, this would disconnect from the actual service
      return disconnectedIntegration;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (type: IntegrationType): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would test the actual connection
      return Math.random() > 0.2; // 80% success rate for demo
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sync = useCallback(async (type: IntegrationType): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would sync data from the integration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    list,
    connect,
    disconnect,
    testConnection,
    sync,
    isLoading,
    error
  };
}

