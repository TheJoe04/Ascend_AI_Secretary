import { useState, useCallback } from 'react';
import { Call, FilterOptions, PaginationOptions, ApiResponse } from '../types';
import { mockCalls } from '../mock';
import { apiClient, USE_MOCK_DATA } from '../api/client';

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
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredCalls = [...mockCalls];
        
        // Apply filters (same logic as before)
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
      } else {
        // Real API call
        const params: Record<string, any> = {};
        
        if (filters?.search) params.search = filters.search;
        if (filters?.status?.length) params.status = filters.status.join(',');
        if (filters?.sentiment?.length) params.sentiment = filters.sentiment.join(',');
        if (filters?.dateRange) {
          params.start_date = filters.dateRange.start.toISOString();
          params.end_date = filters.dateRange.end.toISOString();
        }
        
        if (pagination?.page) params.page = pagination.page;
        if (pagination?.limit) params.limit = pagination.limit;
        if (pagination?.sortBy) params.sort_by = pagination.sortBy;
        if (pagination?.sortOrder) params.sort_order = pagination.sortOrder;
        
        return await apiClient.get<Call[]>('/calls', params);
      }
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
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockCalls.find(c => c.id === id) || null;
      } else {
        // Real API call
        const response = await apiClient.get<Call>(`/calls/${id}`);
        return response.data;
      }
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
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const searchLower = query.toLowerCase();
        return mockCalls.filter(call =>
          call.callerName.toLowerCase().includes(searchLower) ||
          call.callerNumber.includes(searchLower) ||
          call.transcript?.toLowerCase().includes(searchLower)
        );
      } else {
        // Real API call
        const response = await apiClient.get<Call[]>('/calls/search', { q: query });
        return response.data;
      }
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
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const call = mockCalls.find(c => c.id === id);
        if (!call) {
          throw new Error('Call not found');
        }
        
        const updatedCall = { ...call, ...updates };
        return updatedCall;
      } else {
        // Real API call
        const response = await apiClient.put<Call>(`/calls/${id}`, updates);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCall = useCallback(async (callData: Omit<Call, 'id'>): Promise<Call> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newCall: Call = {
          ...callData,
          id: Math.random().toString(36).substr(2, 9),
        };
        return newCall;
      } else {
        // Real API call
        const response = await apiClient.post<Call>('/calls', callData);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCall = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (USE_MOCK_DATA) {
        // TODO: Remove this when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Real API call
        await apiClient.delete(`/calls/${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    list,
    getById,
    search,
    createCall,
    updateCall,
    deleteCall,
    isLoading,
    error
  };
}

