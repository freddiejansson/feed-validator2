import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useMemo } from 'react';
import { TrendingUp, Percent } from 'lucide-react';

interface MarginDistributionProps {
  data: Array<{ 
    salesPrice: number;
    costPrice: number;
    shippingCosts: number;
  }>;
}

export function MarginDistributionCard({ data }: MarginDistributionProps) {
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

    const margins = data
      .map(item => {
        const margin = item.salesPrice > 0 
          ? ((item.salesPrice - item.costPrice - (item.shippingCosts || 0)) / item.salesPrice) * 100
          : 0;
        return margin;
      })
      .filter(margin => margin != null && !isNaN(margin));

    if (!margins.length) return defaultReturn;

    const { max, min, sum } = margins.reduce((acc, margin) => ({
      max: margin > acc.max ? margin : acc.max,
      min: margin < acc.min ? margin : acc.min,
      sum: acc.sum + margin
    }), { max: margins[0], min: margins[0], sum: 0 });

    const avg = sum / margins.length;

    const sortedMargins = [...margins].sort((a, b) => a - b);
    const median = sortedMargins.length % 2 === 0
      ? (sortedMargins[sortedMargins.length / 2 - 1] + sortedMargins[sortedMargins.length / 2]) / 2
      : sortedMargins[Math.floor(sortedMargins.length / 2)];

    const bucketSize = 5;
    const roundedP90 = Math.ceil(median / 5) * 5;
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: i === 0 
        ? '≤0%'
        : i < 9 
          ? `${((i - 1) * bucketSize + 1)}%-${(i * bucketSize)}%`
          : `>${roundedP90}%`,
      count: 0
    }));

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

    let highestBucket = buckets[0];
    for (const bucket of buckets) {
      if (bucket.count > highestBucket.count) {
        highestBucket = bucket;
      }
    }

    return {
      distributionData: buckets.map(bucket => ({
        ...bucket,
        percentage: Math.round((bucket.count / margins.length) * 100)
      })),
      insights: {
        max,
        min,
        avg,
        median,
        highestBucket: {
          range: highestBucket.range,
          percentage: Math.round((highestBucket.count / margins.length) * 100),
          count: highestBucket.count
        }
      }
    };
  }, [data]);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Percent className="h-5 w-5 text-primary" />
          Margin Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6 rounded-xl bg-gradient-to-br from-[#F4EBFF] to-[#E9D7FE] p-4 shadow-sm dark:from-[#2E1065] dark:to-[#581C87]">
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
                  {' '}of products ({insights.highestBucket.count.toLocaleString()} items) have margins between {insights.highestBucket.range}
                </span>
              </p>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Min</p>
                    <p className="text-sm font-semibold text-primary">{Math.round(insights.min)}%</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Max</p>
                    <p className="text-sm font-semibold text-primary">{Math.round(insights.max)}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Avg</p>
                    <p className="text-sm font-semibold text-primary">{Math.round(insights.avg)}%</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-2 dark:bg-white/10">
                    <p className="text-xs text-primary/70">Median</p>
                    <p className="text-sm font-semibold text-primary">{Math.round(insights.median)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  fill="var(--primary-purple)"
                  className="hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
