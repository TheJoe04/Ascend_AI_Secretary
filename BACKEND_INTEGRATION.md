# Backend Integration Guide

This guide explains how to connect the Ascend AI Secretary frontend to your backend database.

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Integration API Keys
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id
OPENAI_API_KEY=your_openai_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### 2. Switching from Mock to Real Data

The app automatically switches between mock and real data based on the `NEXT_PUBLIC_API_URL` environment variable:
- **Mock data**: When `NEXT_PUBLIC_API_URL` is not set or empty
- **Real API**: When `NEXT_PUBLIC_API_URL` is set to your backend URL

## 📊 Database Schema Requirements

Your teammate should create these database tables:

### Calls Table
```sql
CREATE TABLE calls (
  id VARCHAR(255) PRIMARY KEY,
  caller_name VARCHAR(255) NOT NULL,
  caller_number VARCHAR(50) NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  status ENUM('answered', 'missed', 'voicemail') NOT NULL,
  sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  transcript TEXT,
  recording_url VARCHAR(500),
  tags JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('sms', 'email') NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  content TEXT NOT NULL,
  status ENUM('sent', 'delivered', 'read', 'failed') NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  lead_id VARCHAR(255),
  call_id VARCHAR(255),
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (call_id) REFERENCES calls(id)
);
```

### Leads Table
```sql
CREATE TABLE leads (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  score ENUM('Cold', 'Warm', 'Hot') NOT NULL,
  status VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  last_contact TIMESTAMP NOT NULL,
  next_follow_up TIMESTAMP,
  notes TEXT,
  tags JSON,
  calls_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  conversion_probability INTEGER DEFAULT 0, -- 0-100
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Integrations Table
```sql
CREATE TABLE integrations (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('twilio', 'openai', 'elevenlabs') NOT NULL,
  name VARCHAR(255) NOT NULL,
  connected BOOLEAN DEFAULT FALSE,
  last_sync TIMESTAMP,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

Your teammate needs to implement these REST API endpoints:

### Base URL: `http://localhost:8000/api/v1`

### Calls Endpoints
```
GET    /calls                    # List calls with filters/pagination
GET    /calls/:id               # Get specific call
POST   /calls                   # Create new call
PUT    /calls/:id               # Update call
DELETE /calls/:id               # Delete call
GET    /calls/search?q=query    # Search calls
```

**Query Parameters for GET /calls:**
- `search` - Search in caller name, number, transcript
- `status` - Filter by status (answered, missed, voicemail)
- `sentiment` - Filter by sentiment (positive, neutral, negative)
- `start_date` - Filter calls after this date (ISO format)
- `end_date` - Filter calls before this date (ISO format)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort_by` - Sort field (timestamp, duration, caller_name)
- `sort_order` - Sort direction (asc, desc)

### Messages Endpoints
```
GET    /messages                # List messages with filters/pagination
GET    /messages/:id           # Get specific message
POST   /messages               # Send new message
PUT    /messages/:id           # Update message
DELETE /messages/:id           # Delete message
GET    /messages/search?q=query # Search messages
```

### Leads Endpoints
```
GET    /leads                   # List leads with filters/pagination
GET    /leads/:id              # Get specific lead
POST   /leads                  # Create new lead
PUT    /leads/:id              # Update lead
DELETE /leads/:id              # Delete lead
GET    /leads/search?q=query   # Search leads
```

### Integrations Endpoints
```
GET    /integrations                           # List all integrations
POST   /integrations/:type/connect            # Connect integration
POST   /integrations/:type/disconnect         # Disconnect integration
POST   /integrations/:type/test               # Test integration connection
POST   /integrations/:type/sync               # Sync integration data
```

## 📝 API Response Format

All API responses should follow this format:

```typescript
// Success Response
{
  "data": T,           // The actual data
  "total": number,     // Total count (for paginated responses)
  "page": number,      // Current page
  "limit": number,     // Items per page
  "message": string    // Optional success message
}

// Error Response
{
  "error": string,     // Error message
  "code": string,      // Error code
  "details": any       // Additional error details
}
```

## 🔄 Integration Steps

### Step 1: Replace Mock API Hooks

1. **Rename the current hooks:**
   ```bash
   mv src/lib/hooks/use-calls-api.ts src/lib/hooks/use-calls-api-mock.ts
   mv src/lib/hooks/use-messages-api.ts src/lib/hooks/use-messages-api-mock.ts
   mv src/lib/hooks/use-leads-api.ts src/lib/hooks/use-leads-api-mock.ts
   mv src/lib/hooks/use-integrations-api.ts src/lib/hooks/use-integrations-api-mock.ts
   ```

2. **Copy the real API hooks:**
   ```bash
   cp src/lib/hooks/use-calls-api-real.ts src/lib/hooks/use-calls-api.ts
   # Repeat for other hooks
   ```

### Step 2: Update Environment Variables

Set your backend URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Step 3: Test the Integration

1. Start your backend server
2. Restart the frontend: `npm run dev`
3. Check the browser console for API calls
4. Verify data is loading from your backend

## 🛠 Authentication (Optional)

If your backend requires authentication, add this to your API client:

```typescript
// In src/lib/api/client.ts
const token = localStorage.getItem('auth_token');

const config: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  },
  ...options,
};
```

## 🔍 Debugging

### Check API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for calls to your backend API
4. Check request/response details

### Common Issues
- **CORS errors**: Configure your backend to allow requests from `http://localhost:3000`
- **404 errors**: Verify your API endpoints match the expected URLs
- **500 errors**: Check your backend server logs

## 📋 Testing Checklist

- [ ] Backend server running on correct port
- [ ] Database tables created
- [ ] API endpoints implemented
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Frontend connecting to backend
- [ ] Data loading correctly
- [ ] Search and filtering working
- [ ] Pagination working
- [ ] Error handling working

## 🚀 Next Steps

Once basic integration is working:
1. Add real-time updates with WebSockets
2. Implement file uploads for call recordings
3. Add advanced filtering and analytics
4. Set up production deployment
5. Add monitoring and logging

Your teammate can reference this guide to implement the backend, and you can easily switch from mock to real data by setting the environment variable!

