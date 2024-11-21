import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { columnDefinitions, ColumnDefinition } from '@/config/columns';

interface FieldSpecificationsProps {
  data: Record<string, any>[];
}

function calculateCorrectPercentage(data: Record<string, any>[], fieldName: string): number {
  if (!data.length) return 0;
  const correctCount = data.filter(row => row[fieldName]).length;
  return Math.round((correctCount / data.length) * 100);
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

function sortColumnDefinitions(columns: ColumnDefinition[]): ColumnDefinition[] {
  const necessityOrder = {
    required: 1,
    preferred: 2,
    optional: 3,
  };

  return [...columns].sort((a, b) => {
    // Sort only by necessity, maintaining original order within each group
    return necessityOrder[a.necessity as keyof typeof necessityOrder] - 
           necessityOrder[b.necessity as keyof typeof necessityOrder];
  });
}

function getCompletionColor(percentage: number): string {
  if (percentage === 100) return 'text-emerald-500';
  if (percentage >= 90) return 'text-emerald-400';
  if (percentage >= 75) return 'text-yellow-500';
  if (percentage >= 50) return 'text-orange-500';
  return 'text-red-500';
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
                <th className="p-2 text-left font-medium text-text-dark/70">Correct Values</th>
              </tr>
            </thead>
            <tbody>
              {sortColumnDefinitions(columnDefinitions).map((field) => {
                const correctPercentage = calculateCorrectPercentage(data, field.name);
                return (
                  <tr key={field.name} className="border-b border-purple/5 hover:bg-purple/5">
                    <td className="p-2 font-mono">{field.name}</td>
                    <td className={`p-2 ${getNecessityColor(field.necessity)}`}>
                      {formatNecessity(field.necessity)}
                    </td>
                    <td className="p-2 text-text-dark/70">{field.type}</td>
                    <td className={`p-2 ${getCompletionColor(correctPercentage)}`}>
                      {correctPercentage}%
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
