export type Sentiment = 'positive' | 'neutral' | 'negative';

export type CallStatus = 'answered' | 'missed' | 'voicemail';

export type LeadScore = 'Cold' | 'Warm' | 'Hot';


export type IntegrationType = 'twilio' | 'openai';

export interface Call {
  id: string;
  callerName: string;
  callerNumber: string;
  duration: number; // in seconds
  status: CallStatus;
  sentiment: Sentiment;
  timestamp: Date;
  transcript?: string;
  recordingUrl?: string;
  tags: string[];
  notes?: string;
}


export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  score: LeadScore;
  status: string;
  source: string;
  lastContact: Date;
  nextFollowUp?: Date;
  notes: string;
  tags: string[];
  calls: number;
  conversionProbability: number; // 0-100
}

export interface KPI {
  id: string;
  title: string;
  value: number | string;
  delta?: number; // percentage change
  deltaType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'currency' | 'percentage' | 'duration';
}

export interface IntegrationStatus {
  type: IntegrationType;
  name: string;
  connected: boolean;
  lastSync?: Date;
  config?: Record<string, any>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface FilterOptions {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  sentiment?: Sentiment[];
  score?: LeadScore[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SentimentData {
  sentiment: Sentiment;
  count: number;
  percentage: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
}

