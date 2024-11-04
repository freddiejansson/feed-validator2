import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validateColumns, ValidationResult } from '@/utils/columnValidation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ColumnValidationProps {
  headers: string[];
}

export function ColumnValidation({ headers }: ColumnValidationProps) {
  const validation = validateColumns(headers);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-dark">
          {validation.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-teal" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          Column Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validation.missingRequired.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-500 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Missing Required Columns
              </h4>
              <ul className="list-disc list-inside text-sm text-text-dark/70">
                {validation.missingRequired.map(column => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.missingPreferred.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-coral flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Missing Preferred Columns
              </h4>
              <ul className="list-disc list-inside text-sm text-text-dark/70">
                {validation.missingPreferred.map(column => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.unmappedColumns.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-text-dark/70">Unmapped Columns</h4>
              <ul className="list-disc list-inside text-sm text-text-dark/70">
                {validation.unmappedColumns.map(column => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
