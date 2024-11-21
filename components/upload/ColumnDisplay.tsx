import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface ColumnDisplayProps {
  columns: string[];
}

export function ColumnDisplay({ columns }: ColumnDisplayProps) {
  if (!columns.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Column Structure</span>
          <span className="text-sm font-normal text-text-dark/60">
            ({columns.length} columns detected)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {columns.map((column) => (
            <div
              key={column}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-purple/5"
            >
              <Check className="w-4 h-4 text-teal" />
              <span className="text-sm font-mono truncate" title={column}>
                {column}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 