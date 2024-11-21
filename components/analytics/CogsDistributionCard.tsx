import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useMemo } from 'react';
import { ScanBarcode } from 'lucide-react';

interface CogsDistributionProps {
  data: Array<{ costPrice: number }>;
}

export function CogsDistributionCard({ data }: CogsDistributionProps) {
  const distributionData = useMemo(() => {
    const validCosts = data
      .map(item => item.costPrice)
      .filter(cost => cost != null && !isNaN(cost));

    // Sort costs for percentile calculation
    const sortedCosts = [...validCosts].sort((a, b) => a - b);
    const p90 = sortedCosts[Math.floor(sortedCosts.length * 0.9)];
    
    // Round p90 to a nice number
    const roundTo = p90 > 1000 ? 1000 : p90 > 100 ? 100 : 10;
    const roundedP90 = Math.ceil(p90 / roundTo) * roundTo;
    const bucketSize = roundedP90 / 8;
    
    // Round bucket size to a nice number
    const roundedBucketSize = Math.ceil(bucketSize / roundTo) * roundTo;

    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: i === 0 
        ? '0'
        : i < 9 
          ? `${((i - 1) * roundedBucketSize + 1).toLocaleString()}-${(i * roundedBucketSize).toLocaleString()}`
          : `>${roundedP90.toLocaleString()}`,
      count: 0
    }));

    // Fill buckets
    validCosts.forEach(cost => {
      if (cost === 0) {
        buckets[0].count++;
      } else if (cost > roundedP90) {
        buckets[9].count++;
      } else {
        const bucketIndex = Math.min(Math.floor(cost / roundedBucketSize) + 1, 8);
        buckets[bucketIndex].count++;
      }
    });

    // Add percentage calculation
    const totalItems = validCosts.length;
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
          <ScanBarcode className="w-5 h-5" />
          <span>COGS Distribution</span>
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
