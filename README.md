# Ascend AI Secretary

A production-quality frontend application for an AI-powered secretary platform. Built with Next.js 14, TypeScript, and modern UI components. Features comprehensive mock data for demonstration purposes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ascend-ai-secretary

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Beautiful icons
- **next-themes** - Dark/light mode support

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Charts & Visualization
- **Recharts** - Composable charting library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   └── login/         # Login page
│   ├── (main)/            # Main app route group
│   │   ├── dashboard/     # Dashboard page
│   │   ├── calls/         # Calls management
│   │   ├── leads/         # Leads management
│   │   └── settings/      # Settings page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── shared/           # Shared business components
│   ├── layout/           # Layout components
│   ├── charts/           # Chart components
│   └── calls/            # Call-specific components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   ├── types.ts          # TypeScript type definitions
│   ├── mock.ts           # Mock data
│   └── utils.ts          # Utility functions
└── providers/            # React context providers
```

## 🎨 Design System

### Brand Colors
- **Primary**: #004AAD (Ascend Blue)
- **Accent**: #FFD700 (Gold)
- **Supporting**: Tailwind's default color palette

### Components
- **Cards**: Rounded-2xl with soft shadows
- **Buttons**: Multiple variants (default, outline, ghost, etc.)
- **Forms**: Consistent styling with validation states
- **Tables**: Sortable, filterable, with pagination
- **Modals**: Accessible with focus management

## 📊 Features

### Dashboard
- **KPI Cards**: Key performance indicators with trend data
- **Charts**: Calls over time, sentiment analysis, leads funnel
- **Recent Activity**: Timeline of recent actions
- **Quick Actions**: Shortcuts to common tasks

### Calls Management
- **Call List**: Paginated table with search and filters
- **Call Details**: Transcript modal with full call information
- **Status Tracking**: Answered, missed, voicemail status
- **Sentiment Analysis**: Positive, neutral, negative classification

- **Status Tracking**: Sent, delivered, read status

### Leads
- **Lead Management**: Complete CRM functionality
- **Scoring**: Hot, Warm, Cold lead classification
- **Profile Drawer**: Detailed lead information
- **Conversion Tracking**: Probability and funnel analysis

### Settings
- **General**: Company settings, timezone, business hours
- **Team**: User management and permissions
- **Integrations**: Twilio, OpenAI connections
- **Billing**: Subscription and payment management

## 🎯 Mock Data System

This application uses a comprehensive mock data system for demonstration purposes. All data is realistic and representative of a real AI secretary platform.

### Key Integration Hooks
- `useCallsApi()` - Call management
- `useLeadsApi()` - Lead management
- `useIntegrationsApi()` - Third-party services

### External Services
- **Twilio**: Voice and SMS services
- **OpenAI**: AI conversation handling

## 🎯 Mock Data

The application uses realistic mock data including:
- **Calls**: 6 sample calls with transcripts and sentiment analysis
- **Leads**: 6 leads with different scores and conversion probabilities
- **KPIs**: 6 key performance indicators with trend data
- **Charts**: 15 days of call data, sentiment distribution, funnel stages

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file (optional):

```env
# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🔧 Development

### Code Style
- ESLint configuration included
- Prettier for consistent formatting
- TypeScript strict mode enabled

### Key Patterns
- **Component Composition**: Reusable, composable components
- **Custom Hooks**: Business logic separation
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form + Zod validation

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation (planned)

## 🗄️ Backend Integration

### Database
- **PostgreSQL** - Production database
- **Prisma ORM** - Type-safe database client
- **Multi-tenant** - Organization-based data isolation

### Authentication
- **NextAuth.js v5** - Secure authentication
- **Credentials Provider** - Email/password login
- **JWT Sessions** - Stateless authentication
- **Route Protection** - Middleware-based auth

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/calls` - Call management CRUD
- `/api/calls/start` - ElevenLabs voice agent integration
- `/api/leads` - Lead management CRUD
- `/api/analytics` - Dashboard KPIs

### Database Setup
See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete instructions.

## ♿ Accessibility

- **ARIA Labels**: Comprehensive labeling
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **High Contrast**: Dark mode support
- **Screen Readers**: Semantic HTML structure

## 🔮 Future Enhancements

### Potential Features
- Real-time notifications
- Advanced analytics
- Team collaboration
- Mobile app
- Backend API integration
- Webhook support

### Technical Improvements
- Server-side rendering optimization
- Caching strategies
- Performance monitoring
- Error tracking
- Automated testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Note**: This is a frontend-only application with comprehensive mock data for demonstration purposes. All functionality is fully working with realistic sample data.

