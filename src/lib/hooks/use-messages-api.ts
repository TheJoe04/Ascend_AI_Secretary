import { useState, useCallback } from 'react';
import { Message, FilterOptions, PaginationOptions, ApiResponse } from '../types';
import { mockMessages } from '../mock';

export function useMessagesApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<Message[]>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredMessages = [...mockMessages];
      
      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredMessages = filteredMessages.filter(message =>
          message.from.toLowerCase().includes(search) ||
          message.to.toLowerCase().includes(search) ||
          message.content.toLowerCase().includes(search) ||
          message.subject?.toLowerCase().includes(search)
        );
      }
      
      if (filters?.type && filters.type.length > 0) {
        filteredMessages = filteredMessages.filter(message =>
          filters.type!.includes(message.type)
        );
      }
      
      if (filters?.dateRange) {
        filteredMessages = filteredMessages.filter(message => {
          const messageDate = new Date(message.timestamp);
          return messageDate >= filters.dateRange!.start && 
                 messageDate <= filters.dateRange!.end;
        });
      }
      
      // Apply pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const start = (page - 1) * limit;
      const paginatedMessages = filteredMessages.slice(start, start + limit);
      
      return {
        data: paginatedMessages,
        total: filteredMessages.length,
        page,
        limit
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Message | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const message = mockMessages.find(m => m.id === id);
      return message || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string): Promise<Message[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const searchLower = query.toLowerCase();
      return mockMessages.filter(message =>
        message.from.toLowerCase().includes(searchLower) ||
        message.to.toLowerCase().includes(searchLower) ||
        message.content.toLowerCase().includes(searchLower) ||
        message.subject?.toLowerCase().includes(searchLower)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: Message = {
        ...messageData,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };
      
      // In a real app, this would send to backend
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMessage = useCallback(async (id: string, updates: Partial<Message>): Promise<Message> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: connect backend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message = mockMessages.find(m => m.id === id);
      if (!message) {
        throw new Error('Message not found');
      }
      
      const updatedMessage = { ...message, ...updates };
      // In a real app, this would update the backend
      
      return updatedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    list,
    getById,
    search,
    sendMessage,
    updateMessage,
    isLoading,
    error
  };
}

