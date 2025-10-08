"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { MiniStat } from "@/components/shared/mini-stat";
import { CallsOverTimeChart } from "@/components/charts/calls-over-time-chart";
import { SentimentPieChart } from "@/components/charts/sentiment-pie-chart";
import { LeadsFunnelChart } from "@/components/charts/leads-funnel-chart";
import { 
  mockKPIs, 
  mockCallsOverTime, 
  mockSentimentData, 
  mockFunnelData 
} from "@/lib/mock";
import { 
  Phone, 
  PhoneMissed, 
  MessageSquare, 
  TrendingUp,
  Users,
  Calendar,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your AI secretary performance"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.slice(0, 4).map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Mini Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          icon={Phone}
          label="Total Calls Today"
          value="24"
        />
        <MiniStat
          icon={PhoneMissed}
          label="Missed Calls"
          value="3"
        />
        <MiniStat
          icon={MessageSquare}
          label="Messages Sent"
          value="47"
        />
        <MiniStat
          icon={TrendingUp}
          label="Conversion Rate"
          value="23.5%"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CallsOverTimeChart data={mockCallsOverTime} />
        <SentimentPieChart data={mockSentimentData} />
      </div>

      {/* Leads Funnel */}
      <div className="grid gap-6 lg:grid-cols-1">
        <LeadsFunnelChart data={mockFunnelData} />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Call with John Smith completed</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Message sent to Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">New lead: Mike Davis</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">Make a call</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">Send message</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Schedule follow-up</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">View analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

