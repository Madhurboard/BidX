
import React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DataPoint {
  month: string;
  price: number;
}

interface BidHistoryGraphProps {
  data: DataPoint[];
}

const BidHistoryGraph = ({ data }: BidHistoryGraphProps) => {
  // Configure chart colors
  const chartConfig = {
    price: {
      label: "Average Price",
      color: "#1e40af", // auction-blue
    },
  };

  return (
    <ChartContainer 
      className="h-[200px]" 
      config={chartConfig}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
            fontSize={12}
            width={50}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="px-2">
                      <div className="text-sm font-medium">{payload[0].payload.month}</div>
                      <div className="text-sm font-semibold">
                        ₹{payload[0].value.toLocaleString()}
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="price" 
            fill="var(--color-price)" 
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BidHistoryGraph;
