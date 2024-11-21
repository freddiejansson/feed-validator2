import { ColumnDefinition, columnDefinitions } from '@/config/columns';
import { CsvRow } from '@/types/csv';

export interface ValidationResult {
  isValid: boolean;
  missingRequired: string[];
  missingPreferred: string[];
  unmappedColumns: string[];
}

export function validateColumns(data: CsvRow[]): ValidationResult {
  const totalRows = data.length;
  const missingRequired: string[] = [];
  const missingPreferred: string[] = [];
  const unmappedColumns: string[] = [];
  
  columnDefinitions.forEach(column => {
    const missingCount = data.filter(row => !row[column.name]).length;
    if (missingCount > 0) {
      if (column.necessity === 'required') {
        missingRequired.push(column.name);
      } else if (column.necessity === 'preferred') {
        missingPreferred.push(column.name);
      }
    }
  });

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    missingPreferred,
    unmappedColumns
  };
}
