import { useState, useCallback } from 'react';
import { Call, FilterOptions, PaginationOptions, ApiResponse } from '../types';

export function useCallsApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<Call[]>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build URL with query parameters
      const params = new URLSearchParams();
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status.length > 0) {
        params.append('status', filters.status.join(','));
      }
      if (filters?.sentiment && filters.sentiment.length > 0) {
        params.append('sentiment', filters.sentiment.join(','));
      }
      
      const response = await fetch(`/api/calls?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch calls');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calls');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Call | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/calls/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch call');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string): Promise<Call[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      const response = await fetch(`/api/calls?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCall = useCallback(async (id: string, updates: Partial<Call>): Promise<Call> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/calls/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Call not found');
        }
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to update call');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    list,
    getById,
    search,
    updateCall,
    isLoading,
    error
  };
}

