import { CogsDistributionCard } from './CogsDistributionCard';

interface AnalyticsDashboardProps {
  data: Array<{ costPrice: number }>;
  isLoading?: boolean;
}

export function AnalyticsDashboard({ data, isLoading = false }: AnalyticsDashboardProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No data available for analysis
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="max-w-3xl mx-auto">
        <CogsDistributionCard data={data} />
      </div>
    </div>
  );
}
