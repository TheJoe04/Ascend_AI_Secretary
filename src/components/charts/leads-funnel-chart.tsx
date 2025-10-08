"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelStage } from "@/lib/types";

interface LeadsFunnelChartProps {
  data: FunnelStage[];
  className?: string;
}

const COLORS = ['#004AAD', '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];

export function LeadsFunnelChart({ data, className }: LeadsFunnelChartProps) {
  const formatConversionRate = (rate: number) => `${rate.toFixed(1)}%`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Leads Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" className="text-xs" />
              <YAxis 
                dataKey="stage" 
                type="category" 
                width={120}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value: number, name, props) => [
                  `${value} leads (${props.payload.conversionRate}% conversion)`,
                  'Count'
                ]}
                labelFormatter={(value) => `Stage: ${value}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

