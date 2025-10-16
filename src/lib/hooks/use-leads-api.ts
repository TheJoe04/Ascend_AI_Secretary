import { useState, useCallback } from 'react';
import { Lead, FilterOptions, PaginationOptions, ApiResponse } from '../types';
import { mockLeads } from '../mock';

export function useLeadsApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<Lead[]>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredLeads = [...mockLeads];
      
      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.company?.toLowerCase().includes(search) ||
          lead.notes.toLowerCase().includes(search)
        );
      }
      
      if (filters?.score && filters.score.length > 0) {
        filteredLeads = filteredLeads.filter(lead =>
          filters.score!.includes(lead.score)
        );
      }
      
      if (filters?.dateRange) {
        filteredLeads = filteredLeads.filter(lead => {
          const leadDate = new Date(lead.lastContact);
          return leadDate >= filters.dateRange!.start && 
                 leadDate <= filters.dateRange!.end;
        });
      }
      
      // Apply pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const start = (page - 1) * limit;
      const paginatedLeads = filteredLeads.slice(start, start + limit);
      
      return {
        data: paginatedLeads,
        total: filteredLeads.length,
        page,
        limit
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Lead | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const lead = mockLeads.find(l => l.id === id);
      return lead || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string): Promise<Lead[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const searchLower = query.toLowerCase();
      return mockLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.company?.toLowerCase().includes(searchLower) ||
        lead.notes.toLowerCase().includes(searchLower)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLead = useCallback(async (leadData: Omit<Lead, 'id'>): Promise<Lead> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLead: Lead = {
        ...leadData,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      // Mock implementation for demonstration
      return newLead;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const lead = mockLeads.find(l => l.id === id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      const updatedLead = { ...lead, ...updates };
      // Mock implementation for demonstration
      
      return updatedLead;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLead = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock implementation for demonstration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    list,
    getById,
    search,
    createLead,
    updateLead,
    deleteLead,
    isLoading,
    error
  };
}

