import { create } from 'zustand';
import { Call, Message, Lead, FilterOptions, PaginationOptions } from '../types';
import { mockCalls, mockMessages, mockLeads } from '../mock';

interface DataState {
  // Data
  calls: Call[];
  messages: Message[];
  leads: Lead[];
  
  // Filters
  callFilters: FilterOptions;
  messageFilters: FilterOptions;
  leadFilters: FilterOptions;
  
  // Pagination
  callPagination: PaginationOptions;
  messagePagination: PaginationOptions;
  leadPagination: PaginationOptions;
  
  // Actions
  setCallFilters: (filters: Partial<FilterOptions>) => void;
  setMessageFilters: (filters: Partial<FilterOptions>) => void;
  setLeadFilters: (filters: Partial<FilterOptions>) => void;
  
  setCallPagination: (pagination: Partial<PaginationOptions>) => void;
  setMessagePagination: (pagination: Partial<PaginationOptions>) => void;
  setLeadPagination: (pagination: Partial<PaginationOptions>) => void;
  
  // Data actions
  addCall: (call: Call) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  deleteCall: (id: string) => void;
  
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Computed getters
  getFilteredCalls: () => Call[];
  getFilteredMessages: () => Message[];
  getFilteredLeads: () => Lead[];
  
  getPaginatedCalls: () => Call[];
  getPaginatedMessages: () => Message[];
  getPaginatedLeads: () => Lead[];
}

const defaultFilters: FilterOptions = {};
const defaultPagination: PaginationOptions = {
  page: 1,
  limit: 10,
  sortBy: 'timestamp',
  sortOrder: 'desc',
};

export const useDataStore = create<DataState>((set, get) => ({
  // Initial data
  calls: mockCalls,
  messages: mockMessages,
  leads: mockLeads,
  
  // Filters
  callFilters: defaultFilters,
  messageFilters: defaultFilters,
  leadFilters: defaultFilters,
  
  // Pagination
  callPagination: defaultPagination,
  messagePagination: defaultPagination,
  leadPagination: defaultPagination,
  
  // Filter actions
  setCallFilters: (filters) =>
    set((state) => ({
      callFilters: { ...state.callFilters, ...filters },
    })),
  
  setMessageFilters: (filters) =>
    set((state) => ({
      messageFilters: { ...state.messageFilters, ...filters },
    })),
  
  setLeadFilters: (filters) =>
    set((state) => ({
      leadFilters: { ...state.leadFilters, ...filters },
    })),
  
  // Pagination actions
  setCallPagination: (pagination) =>
    set((state) => ({
      callPagination: { ...state.callPagination, ...pagination },
    })),
  
  setMessagePagination: (pagination) =>
    set((state) => ({
      messagePagination: { ...state.messagePagination, ...pagination },
    })),
  
  setLeadPagination: (pagination) =>
    set((state) => ({
      leadPagination: { ...state.leadPagination, ...pagination },
    })),
  
  // Call actions
  addCall: (call) =>
    set((state) => ({
      calls: [call, ...state.calls],
    })),
  
  updateCall: (id, updates) =>
    set((state) => ({
      calls: state.calls.map((call) =>
        call.id === id ? { ...call, ...updates } : call
      ),
    })),
  
  deleteCall: (id) =>
    set((state) => ({
      calls: state.calls.filter((call) => call.id !== id),
    })),
  
  // Message actions
  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
    })),
  
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, ...updates } : message
      ),
    })),
  
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  
  // Lead actions
  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),
  
  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updates } : lead
      ),
    })),
  
  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
    })),
  
  // Computed getters
  getFilteredCalls: () => {
    const state = get();
    const { calls, callFilters } = state;
    
    return calls.filter((call) => {
      if (callFilters.search) {
        const search = callFilters.search.toLowerCase();
        if (
          !call.callerName.toLowerCase().includes(search) &&
          !call.callerNumber.includes(search) &&
          !call.transcript?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      
      if (callFilters.status && callFilters.status.length > 0) {
        if (!callFilters.status.includes(call.status)) return false;
      }
      
      if (callFilters.sentiment && callFilters.sentiment.length > 0) {
        if (!callFilters.sentiment.includes(call.sentiment)) return false;
      }
      
      if (callFilters.dateRange) {
        const callDate = new Date(call.timestamp);
        if (
          callDate < callFilters.dateRange.start ||
          callDate > callFilters.dateRange.end
        ) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  getFilteredMessages: () => {
    const state = get();
    const { messages, messageFilters } = state;
    
    return messages.filter((message) => {
      if (messageFilters.search) {
        const search = messageFilters.search.toLowerCase();
        if (
          !message.from.toLowerCase().includes(search) &&
          !message.to.toLowerCase().includes(search) &&
          !message.content.toLowerCase().includes(search) &&
          !message.subject?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      
      if (messageFilters.type && messageFilters.type.length > 0) {
        if (!messageFilters.type.includes(message.type)) return false;
      }
      
      if (messageFilters.dateRange) {
        const messageDate = new Date(message.timestamp);
        if (
          messageDate < messageFilters.dateRange.start ||
          messageDate > messageFilters.dateRange.end
        ) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  getFilteredLeads: () => {
    const state = get();
    const { leads, leadFilters } = state;
    
    return leads.filter((lead) => {
      if (leadFilters.search) {
        const search = leadFilters.search.toLowerCase();
        if (
          !lead.name.toLowerCase().includes(search) &&
          !lead.email.toLowerCase().includes(search) &&
          !lead.company?.toLowerCase().includes(search) &&
          !lead.notes.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      
      if (leadFilters.score && leadFilters.score.length > 0) {
        if (!leadFilters.score.includes(lead.score)) return false;
      }
      
      if (leadFilters.dateRange) {
        const leadDate = new Date(lead.lastContact);
        if (
          leadDate < leadFilters.dateRange.start ||
          leadDate > leadFilters.dateRange.end
        ) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  getPaginatedCalls: () => {
    const state = get();
    const filteredCalls = state.getFilteredCalls();
    const { page, limit, sortBy, sortOrder } = state.callPagination;
    
    // Sort
    const sorted = [...filteredCalls].sort((a, b) => {
      const aVal = a[sortBy as keyof Call];
      const bVal = b[sortBy as keyof Call];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  },
  
  getPaginatedMessages: () => {
    const state = get();
    const filteredMessages = state.getFilteredMessages();
    const { page, limit, sortBy, sortOrder } = state.messagePagination;
    
    // Sort
    const sorted = [...filteredMessages].sort((a, b) => {
      const aVal = a[sortBy as keyof Message];
      const bVal = b[sortBy as keyof Message];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  },
  
  getPaginatedLeads: () => {
    const state = get();
    const filteredLeads = state.getFilteredLeads();
    const { page, limit, sortBy, sortOrder } = state.leadPagination;
    
    // Sort
    const sorted = [...filteredLeads].sort((a, b) => {
      const aVal = a[sortBy as keyof Lead];
      const bVal = b[sortBy as keyof Lead];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  },
}));

