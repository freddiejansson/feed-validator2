import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface ColumnListProps {
  columns: string[];
}

export function ColumnList({ columns }: ColumnListProps) {
  if (!columns.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-purple" />
          <span>CSV Columns</span>
          <span className="text-sm font-normal text-text-dark/60">
            ({columns.length} detected)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {columns.map((column) => (
            <div
              key={column}
              className="p-2 rounded-lg bg-purple/5 border border-purple/10
                        text-sm font-mono truncate"
              title={column}
            >
              {column}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
