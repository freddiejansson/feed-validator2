import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useMemo } from 'react';
import { Truck, TrendingUp } from 'lucide-react';

interface ShippingDistributionProps {
  data: Array<{ shippingCost: number }>;
}

export function ShippingDistributionCard({ data }: ShippingDistributionProps) {
  const { distributionData, insights } = useMemo(() => {
    const defaultReturn = {
      distributionData: Array(10).fill({ range: '0', count: 0, percentage: 0 }),
      insights: {
        max: 0,
        min: 0,
        avg: 0,
        median: 0,
        highestBucket: { range: 'N/A', percentage: 0, count: 0 }
      }
    };

    if (!data?.length) return defaultReturn;

    const validCosts = data
      .map(item => item.shippingCost)
      .filter(cost => cost != null && !isNaN(cost));

    if (!validCosts.length) return defaultReturn;

    // Replace Math.max(...) and Math.min(...) with a single iteration
    const { max, min, sum } = validCosts.reduce((acc, cost) => ({
      max: cost > acc.max ? cost : acc.max,
      min: cost < acc.min ? cost : acc.min,
      sum: acc.sum + cost
    }), { max: validCosts[0], min: validCosts[0], sum: 0 });

    const avg = sum / validCosts.length;

    const sortedCosts = [...validCosts].sort((a, b) => a - b);
    const median = sortedCosts.length % 2 === 0
      ? (sortedCosts[sortedCosts.length / 2 - 1] + sortedCosts[sortedCosts.length / 2]) / 2
      : sortedCosts[Math.floor(sortedCosts.length / 2)];

    // Sort costs for percentile calculation
    const p90 = sortedCosts[Math.floor(sortedCosts.length * 0.9)];
    
    // Round p90 to a nice number
    const roundTo = p90 > 1000 ? 1000 : p90 > 100 ? 100 : 10;
    const roundedP90 = Math.ceil(p90 / roundTo) * roundTo;
    const bucketSize = roundedP90 / 8; // Divide by 8 since first bucket is special
    
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

    // Find highest bucket
    let highestBucket = buckets[0];
    for (const bucket of buckets) {
      if (bucket.count > highestBucket.count) {
        highestBucket = bucket;
      }
    }

    return {
      distributionData: buckets.map(bucket => ({
        ...bucket,
        percentage: Math.round((bucket.count / validCosts.length) * 100)
      })),
      insights: {
        max,
        min,
        avg,
        median,
        highestBucket: {
          range: highestBucket.range,
          percentage: Math.round((highestBucket.count / validCosts.length) * 100),
          count: highestBucket.count
        }
      }
    };
  }, [data]);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          <span>Shipping Cost Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Chart - Now spans 2 columns */}
          <div className="col-span-2 h-64">
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
                  fill="var(--secondary-coral)"
                  className="hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6 rounded-xl bg-gradient-to-br from-[#FFF1F0] to-[#FECACA] p-4 shadow-sm dark:from-[#7F1D1D] dark:to-[#991B1B]">
            <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Key Insights</h3>
            </div>
            <div className="space-y-4">
              <p className="text-primary">
                <span className="text-2xl font-bold">
                  {insights.highestBucket.percentage}%
                </span>
                <span className="text-sm text-primary/70">
                  {' '}of products ({insights.highestBucket.count.toLocaleString()} items) have shipping costs between {insights.highestBucket.range}
                </span>
              </p>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Min</p>
                    <p className="text-sm font-semibold text-primary">${Math.round(insights.min).toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Max</p>
                    <p className="text-sm font-semibold text-primary">${Math.round(insights.max).toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Avg</p>
                    <p className="text-sm font-semibold text-primary">${Math.round(insights.avg).toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Median</p>
                    <p className="text-sm font-semibold text-primary">${Math.round(insights.median).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
