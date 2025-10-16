import { Call, Lead, KPI, IntegrationStatus, Notification, ChartDataPoint, SentimentData, FunnelStage } from './types';

// Mock Calls Data
export const mockCalls: Call[] = [
  {
    id: '1',
    callerName: 'John Smith',
    callerNumber: '+1 (555) 123-4567',
    duration: 180,
    status: 'answered',
    sentiment: 'positive',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    transcript: 'Hi, I\'m interested in your AI secretary service. Can you tell me more about the pricing?',
    tags: ['pricing', 'inquiry'],
    notes: 'Very interested, follow up in 2 days'
  },
  {
    id: '2',
    callerName: 'Sarah Johnson',
    callerNumber: '+1 (555) 234-5678',
    duration: 0,
    status: 'missed',
    sentiment: 'neutral',
    timestamp: new Date('2024-01-15T14:20:00Z'),
    tags: ['follow-up'],
    notes: 'Called twice today, no answer'
  },
  {
    id: '3',
    callerName: 'Mike Davis',
    callerNumber: '+1 (555) 345-6789',
    duration: 420,
    status: 'answered',
    sentiment: 'positive',
    timestamp: new Date('2024-01-14T16:45:00Z'),
    transcript: 'Great demo! I think this could really help our sales team. What\'s the onboarding process like?',
    tags: ['demo', 'onboarding', 'sales'],
    notes: 'Ready to move forward, send contract'
  },
  {
    id: '4',
    callerName: 'Lisa Chen',
    callerNumber: '+1 (555) 456-7890',
    duration: 90,
    status: 'voicemail',
    sentiment: 'neutral',
    timestamp: new Date('2024-01-14T11:15:00Z'),
    transcript: 'Hi, this is Lisa from TechCorp. We\'re looking for an AI solution for our customer support. Please call me back.',
    tags: ['voicemail', 'customer-support'],
    notes: 'Large enterprise prospect'
  },
  {
    id: '5',
    callerName: 'Robert Wilson',
    callerNumber: '+1 (555) 567-8901',
    duration: 240,
    status: 'answered',
    sentiment: 'negative',
    timestamp: new Date('2024-01-13T09:30:00Z'),
    transcript: 'I\'m not sure this is the right fit for our company. The pricing seems too high and we need more customization options.',
    tags: ['pricing', 'objection', 'customization'],
    notes: 'Price sensitive, needs custom solution'
  },
  {
    id: '6',
    callerName: 'Emily Rodriguez',
    callerNumber: '+1 (555) 678-9012',
    duration: 150,
    status: 'answered',
    sentiment: 'positive',
    timestamp: new Date('2024-01-13T15:20:00Z'),
    transcript: 'This looks amazing! How quickly can we get started? Our team is really excited about this.',
    tags: ['ready-to-buy', 'urgent'],
    notes: 'High priority - ready to close'
  }
];


// Mock Leads Data
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    score: 'Warm',
    status: 'Contacted',
    source: 'Website',
    lastContact: new Date('2024-01-15T10:30:00Z'),
    nextFollowUp: new Date('2024-01-17T14:00:00Z'),
    notes: 'Very interested in pricing, follow up in 2 days',
    tags: ['enterprise', 'pricing'],
    calls: 2,
    conversionProbability: 75
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@agency.com',
    phone: '+1 (555) 234-5678',
    company: 'Creative Agency',
    score: 'Cold',
    status: 'New',
    source: 'Referral',
    lastContact: new Date('2024-01-15T14:20:00Z'),
    nextFollowUp: new Date('2024-01-16T10:00:00Z'),
    notes: 'Called twice today, no answer. Try different time',
    tags: ['agency', 'referral'],
    calls: 2,
    conversionProbability: 30
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@startup.io',
    phone: '+1 (555) 345-6789',
    company: 'StartupCo',
    score: 'Hot',
    status: 'Ready to Close',
    source: 'Demo',
    lastContact: new Date('2024-01-14T16:45:00Z'),
    nextFollowUp: new Date('2024-01-15T09:00:00Z'),
    notes: 'Ready to move forward, send contract immediately',
    tags: ['startup', 'ready-to-buy'],
    calls: 3,
    conversionProbability: 95
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@techcorp.com',
    phone: '+1 (555) 456-7890',
    company: 'TechCorp',
    score: 'Warm',
    status: 'Demo Scheduled',
    source: 'Cold Call',
    lastContact: new Date('2024-01-14T11:15:00Z'),
    nextFollowUp: new Date('2024-01-16T14:00:00Z'),
    notes: 'Large enterprise prospect, high value',
    tags: ['enterprise', 'high-value'],
    calls: 1,
    conversionProbability: 65
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@corp.com',
    phone: '+1 (555) 567-8901',
    company: 'Wilson Corp',
    score: 'Cold',
    status: 'Objection',
    source: 'Website',
    lastContact: new Date('2024-01-13T09:30:00Z'),
    nextFollowUp: new Date('2024-01-20T10:00:00Z'),
    notes: 'Price sensitive, needs custom solution. Follow up with pricing options',
    tags: ['price-sensitive', 'custom'],
    calls: 1,
    conversionProbability: 25
  },
  {
    id: '6',
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    phone: '+1 (555) 678-9012',
    company: 'Growth Co',
    score: 'Hot',
    status: 'Ready to Close',
    source: 'Referral',
    lastContact: new Date('2024-01-13T15:20:00Z'),
    nextFollowUp: new Date('2024-01-15T11:00:00Z'),
    notes: 'High priority - ready to close, team is excited',
    tags: ['urgent', 'ready-to-buy'],
    calls: 2,
    conversionProbability: 90
  }
];

// Mock KPIs Data
export const mockKPIs: KPI[] = [
  {
    id: '1',
    title: 'Calls Handled Today',
    value: 24,
    delta: 12,
    deltaType: 'increase',
    format: 'number'
  },
  {
    id: '2',
    title: 'Missed Calls',
    value: 3,
    delta: -25,
    deltaType: 'decrease',
    format: 'number'
  },
  {
    id: '3',
    title: 'Conversion Rate',
    value: 23.5,
    delta: 5.2,
    deltaType: 'increase',
    format: 'percentage'
  },
  {
    id: '4',
    title: 'Revenue This Month',
    value: 45680,
    delta: 15.3,
    deltaType: 'increase',
    format: 'currency'
  },
  {
    id: '5',
    title: 'Avg Call Duration',
    value: 180,
    delta: -8,
    deltaType: 'decrease',
    format: 'duration'
  }
];

// Mock Integration Status
export const mockIntegrations: IntegrationStatus[] = [
  {
    type: 'twilio',
    name: 'Twilio Voice',
    connected: true,
    lastSync: new Date('2024-01-15T16:30:00Z'),
    config: { accountSid: 'AC***', phoneNumber: '+1 (555) 000-0000' }
  },
  {
    type: 'openai',
    name: 'OpenAI GPT-4',
    connected: true,
    lastSync: new Date('2024-01-15T16:25:00Z'),
    config: { model: 'gpt-4', temperature: 0.7 }
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'Sarah Johnson has been assigned to you from the website form.',
    type: 'info',
    timestamp: new Date('2024-01-15T16:45:00Z'),
    read: false
  },
  {
    id: '3',
    title: 'Call Completed',
    message: 'Successfully handled call with John Smith. Transcript available.',
    type: 'success',
    timestamp: new Date('2024-01-15T14:15:00Z'),
    read: true
  }
];

// Mock Chart Data
export const mockCallsOverTime: ChartDataPoint[] = [
  { date: '2024-01-01', value: 15 },
  { date: '2024-01-02', value: 18 },
  { date: '2024-01-03', value: 22 },
  { date: '2024-01-04', value: 19 },
  { date: '2024-01-05', value: 25 },
  { date: '2024-01-06', value: 28 },
  { date: '2024-01-07', value: 31 },
  { date: '2024-01-08', value: 27 },
  { date: '2024-01-09', value: 33 },
  { date: '2024-01-10', value: 29 },
  { date: '2024-01-11', value: 35 },
  { date: '2024-01-12', value: 38 },
  { date: '2024-01-13', value: 42 },
  { date: '2024-01-14', value: 39 },
  { date: '2024-01-15', value: 45 }
];

export const mockSentimentData: SentimentData[] = [
  { sentiment: 'positive', count: 45, percentage: 52.3 },
  { sentiment: 'neutral', count: 28, percentage: 32.6 },
  { sentiment: 'negative', count: 13, percentage: 15.1 }
];

export const mockFunnelData: FunnelStage[] = [
  { stage: 'New Leads', count: 156, conversionRate: 100 },
  { stage: 'Contacted', count: 98, conversionRate: 62.8 },
  { stage: 'Qualified', count: 67, conversionRate: 68.4 },
  { stage: 'Demo Scheduled', count: 34, conversionRate: 50.7 },
  { stage: 'Proposal Sent', count: 23, conversionRate: 67.6 },
  { stage: 'Closed Won', count: 18, conversionRate: 78.3 }
];

