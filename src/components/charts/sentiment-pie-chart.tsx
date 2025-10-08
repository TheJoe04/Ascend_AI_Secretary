"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentData } from "@/lib/types";

interface SentimentPieChartProps {
  data: SentimentData[];
  className?: string;
}

const COLORS = {
  positive: '#10B981', // green-500
  neutral: '#6B7280',  // gray-500
  negative: '#EF4444'  // red-500
};

export function SentimentPieChart({ data, className }: SentimentPieChartProps) {
  const formatLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊 Positive';
      case 'neutral':
        return '😐 Neutral';
      case 'negative':
        return '😞 Negative';
      default:
        return sentiment;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Call Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ sentiment, percentage }) => `${formatLabel(sentiment)} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name, props) => [
                  `${value} calls (${props.payload.percentage}%)`,
                  formatLabel(props.payload.sentiment)
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

