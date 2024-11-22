import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

interface MarginDistributionProps {
  data: Array<{ 
    salesPrice: number;
    costPrice: number;
    shippingCosts: number;
  }>;
}

export function MarginDistributionCard({ data }: MarginDistributionProps) {
  const distributionData = useMemo(() => {
    const margins = data
      .map(item => {
        // Calculate margin as a percentage
        const margin = item.salesPrice > 0 
          ? ((item.salesPrice - item.costPrice - (item.shippingCosts || 0)) / item.salesPrice) * 100
          : 0;
        return margin;
      })
      .filter(margin => margin != null && !isNaN(margin));

    // Sort margins for percentile calculation
    const sortedMargins = [...margins].sort((a, b) => a - b);
    const p90 = sortedMargins[Math.floor(sortedMargins.length * 0.9)];
    
    // Round p90 to nearest 5%
    const roundedP90 = Math.ceil(p90 / 5) * 5;
    const bucketSize = 5; // Fixed 5% buckets
    
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: i === 0 
        ? '≤0%'
        : i < 9 
          ? `${((i - 1) * bucketSize + 1)}%-${(i * bucketSize)}%`
          : `>${roundedP90}%`,
      count: 0
    }));

    // Fill buckets
    margins.forEach(margin => {
      if (margin <= 0) {
        buckets[0].count++;
      } else if (margin > roundedP90) {
        buckets[9].count++;
      } else {
        const bucketIndex = Math.min(Math.floor(margin / bucketSize) + 1, 8);
        buckets[bucketIndex].count++;
      }
    });

    // Add percentage calculation
    const totalItems = margins.length;
    return buckets.map(bucket => ({
      ...bucket,
      percentage: totalItems > 0 
        ? Math.round((bucket.count / totalItems) * 100)
        : 0
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span>Margin Distribution (%)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={60}
                className="text-xs"
              />
              <YAxis 
                className="text-xs"
                tickFormatter={(value) => value.toLocaleString()}
                label={{ 
                  value: 'Number of Products', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 0,
                  style: { 
                    fontSize: '12px',
                    textAnchor: 'middle',
                    dominantBaseline: 'middle'
                  }
                }}
              />
              <Tooltip
                content={({ payload, label }: TooltipProps<number, string>) => (
                  <div className="bg-white p-2 border shadow-sm">
                    <p className="font-semibold">{label}</p>
                    <p>Count: {payload?.[0]?.value}</p>
                    <p className="text-text-dark/70">
                      {payload?.[0]?.payload.percentage}% of total
                    </p>
                  </div>
                )}
              />
              <Bar 
                dataKey="count" 
                fill="var(--primary-purple)"
                className="hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
