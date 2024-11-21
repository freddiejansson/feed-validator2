// CSV Value Types
export type CsvValue = string | number | boolean | null;

// CSV Row Structure
export interface CsvRow {
  [column: string]: CsvValue;
}

// File Processing Types
export interface ProcessedFile {
  data: CsvRow[];
  columns: string[];
}

// Analytics Data Types
export interface AnalyticsData {
  costPrice: number;
  shippingCost: number;
}

// Column Validation Types
export interface ValidationResult {
  isValid: boolean;
  missingRequired: string[];
  missingPreferred: string[];
  unmappedColumns: string[];
}