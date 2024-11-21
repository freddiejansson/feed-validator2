import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for CSV row values
type CsvValue = string | number | boolean | null;

// Define the data structure for a row
interface CsvRow {
  [column: string]: CsvValue;
}

interface DataTableProps {
  data: CsvRow[];
  columns: string[];
}

export function DataTable({ data, columns }: DataTableProps) {
  const previewData = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Data Preview</span>
          <span className="text-sm font-normal text-text-dark/60">
            (First 10 rows)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/10">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="p-2 text-left font-medium text-text-dark/70 whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-purple/5 hover:bg-purple/5"
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column}`}
                      className="p-2 font-mono whitespace-nowrap text-text-dark/80"
                    >
                      {row[column]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
