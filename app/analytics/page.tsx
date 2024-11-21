'use client';

import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  const mockData = [
    { costPrice: 100 },
    { costPrice: 200 },
    { costPrice: 150 },
    // ... more data
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Overview</h1>
      <AnalyticsDashboard data={mockData} />
    </div>
  );
}
