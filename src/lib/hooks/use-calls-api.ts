import { useState, useCallback } from 'react';
import { Call, FilterOptions, PaginationOptions, ApiResponse } from '../types';
import { mockCalls } from '../mock';

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
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredCalls = [...mockCalls];
      
      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredCalls = filteredCalls.filter(call =>
          call.callerName.toLowerCase().includes(search) ||
          call.callerNumber.includes(search) ||
          call.transcript?.toLowerCase().includes(search)
        );
      }
      
      if (filters?.status && filters.status.length > 0) {
        filteredCalls = filteredCalls.filter(call =>
          filters.status!.includes(call.status)
        );
      }
      
      if (filters?.sentiment && filters.sentiment.length > 0) {
        filteredCalls = filteredCalls.filter(call =>
          filters.sentiment!.includes(call.sentiment)
        );
      }
      
      if (filters?.dateRange) {
        filteredCalls = filteredCalls.filter(call => {
          const callDate = new Date(call.timestamp);
          return callDate >= filters.dateRange!.start && 
                 callDate <= filters.dateRange!.end;
        });
      }
      
      // Apply pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const start = (page - 1) * limit;
      const paginatedCalls = filteredCalls.slice(start, start + limit);
      
      return {
        data: paginatedCalls,
        total: filteredCalls.length,
        page,
        limit
      };
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
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const call = mockCalls.find(c => c.id === id);
      return call || null;
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
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const searchLower = query.toLowerCase();
      return mockCalls.filter(call =>
        call.callerName.toLowerCase().includes(searchLower) ||
        call.callerNumber.includes(searchLower) ||
        call.transcript?.toLowerCase().includes(searchLower)
      );
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
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const call = mockCalls.find(c => c.id === id);
      if (!call) {
        throw new Error('Call not found');
      }
      
      const updatedCall = { ...call, ...updates };
      // In a real app, this would update the backend
      
      return updatedCall;
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

