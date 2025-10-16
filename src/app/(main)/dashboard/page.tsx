"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { CallsOverTimeChart } from "@/components/charts/calls-over-time-chart";
import { SentimentPieChart } from "@/components/charts/sentiment-pie-chart";
import { LeadsFunnelChart } from "@/components/charts/leads-funnel-chart";
import { CallModal } from "@/components/calls/call-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  mockKPIs, 
  mockCallsOverTime, 
  mockSentimentData, 
  mockFunnelData 
} from "@/lib/mock";
import { 
  Phone,
  PhoneCall,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";

interface CallResult {
  number: string;
  conversation_id: string;
  status: string;
  duration?: number;
  transcript?: any[];
  summary?: any;
  success: boolean;
  error?: string;
}

export default function DashboardPage() {
  const [recentCalls, setRecentCalls] = useState<CallResult[]>([]);
  const [isCalling, setIsCalling] = useState(false);

  const handleCallComplete = (results: CallResult[]) => {
    setRecentCalls(prev => [...results, ...prev]);
    setIsCalling(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="AI Call Center" 
        description="Manage your AI secretary calls and monitor performance"
      />

      {/* Quick Actions Bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Start Calling</h3>
                <p className="text-sm text-muted-foreground">Launch AI calls to your leads</p>
              </div>
              <CallModal onCallComplete={handleCallComplete} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Call Analytics</h3>
                <p className="text-sm text-muted-foreground">View performance metrics</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Lead Management</h3>
                <p className="text-sm text-muted-foreground">Manage your prospects</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.slice(0, 4).map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Recent Calls & Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Calls */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCalls.length > 0 ? (
                <div className="space-y-4">
                  {recentCalls.slice(0, 5).map((call, index) => (
                    <div key={index} className={`border-l-4 pl-4 ${
                      call.success ? 'border-green-500' : 'border-red-500'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{call.number}</p>
                          <p className="text-sm text-muted-foreground">
                            {call.duration ? `Duration: ${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'No duration'} | Status: {call.status}
                          </p>
                        </div>
                        <Badge className={call.success ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                          {call.success ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Success
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {call.summary && (
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">Summary:</p>
                          <p className="text-sm text-muted-foreground">
                            {typeof call.summary === 'string' ? call.summary : 'Call completed successfully'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No calls made yet</p>
                  <p className="text-sm text-muted-foreground">Start your first call to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Calls</span>
                <span className="text-2xl font-bold">{recentCalls.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-2xl font-bold text-green-600">
                  {recentCalls.length > 0 
                    ? Math.round((recentCalls.filter(call => call.success).length / recentCalls.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Duration</span>
                <span className="text-2xl font-bold">
                  {recentCalls.length > 0 && recentCalls.some(call => call.duration)
                    ? Math.round(recentCalls.filter(call => call.duration).reduce((acc, call) => acc + (call.duration || 0), 0) / recentCalls.filter(call => call.duration).length / 60)
                    : 0}m
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
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
    </div>
  );
}

