import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { columnDefinitions, ColumnDefinition } from '@/config/columns';

interface FieldSpecificationsProps {
  data: Record<string, any>[];
}

function calculateMissingPercentage(data: Record<string, any>[], fieldName: string): number {
  if (!data.length) return 0;
  const missingCount = data.filter(row => !row[fieldName]).length;
  return Math.round((missingCount / data.length) * 100);
}

function getNecessityColor(necessity: string): string {
  switch (necessity) {
    case 'required':
      return 'text-red-600';
    case 'preferred':
      return 'text-orange-500';
    default:
      return 'text-text-dark/70';
  }
}

function formatNecessity(necessity: string): string {
  return necessity.charAt(0).toUpperCase() + necessity.slice(1);
}

export function FieldSpecifications({ data }: FieldSpecificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple" />
          <span>Field Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/10">
                <th className="p-2 text-left font-medium text-text-dark/70">Field Name</th>
                <th className="p-2 text-left font-medium text-text-dark/70">Necessity</th>
                <th className="p-2 text-left font-medium text-text-dark/70">Type</th>
                <th className="p-2 text-left font-medium text-text-dark/70">Missing Values</th>
              </tr>
            </thead>
            <tbody>
              {columnDefinitions.map((field) => {
                const missingPercentage = calculateMissingPercentage(data, field.name);
                return (
                  <tr key={field.name} className="border-b border-purple/5 hover:bg-purple/5">
                    <td className="p-2 font-mono">{field.name}</td>
                    <td className={`p-2 ${getNecessityColor(field.necessity)}`}>
                      {formatNecessity(field.necessity)}
                    </td>
                    <td className="p-2 text-text-dark/70">{field.type}</td>
                    <td className={`p-2 ${missingPercentage > 0 ? 'text-orange-500' : 'text-teal'}`}>
                      {missingPercentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
