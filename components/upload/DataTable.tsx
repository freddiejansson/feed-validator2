import { useState, useRef, MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

type SortDirection = 'asc' | 'desc' | null;

function formatCellValue(value: CsvValue, columnName: string): string {
  if (value === null || value === undefined) return '-';
  
  // Return SKU values without formatting
  if (columnName === 'sku') {
    return value.toString();
  }
  
  if (typeof value === 'number') {
    // Create number formatter with thousand separator
    const formatter = new Intl.NumberFormat('sv-SE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      useGrouping: true
    });

    // Check if the number has decimals
    if (value % 1 !== 0) {
      // Round to 1 decimal only if there are decimals
      const rounded = Math.round((value + Number.EPSILON) * 10) / 10;
      return formatter.format(rounded);
    }
    // Return whole numbers without decimals but with thousand separator
    return formatter.format(value);
  }
  return value.toString();
}

const ITEMS_PER_PAGE = 10;

function generatePaginationRange(currentPage: number, totalPages: number) {
  const maxPages = 10;
  const sidePages = 4; // Pages to show on each side of current page

  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= sidePages) {
    return [...Array.from({ length: maxPages - 1 }, (_, i) => i + 1), null, totalPages];
  }

  if (currentPage > totalPages - sidePages) {
    return [1, null, ...Array.from({ length: maxPages - 1 }, (_, i) => totalPages - (maxPages - 2) + i)];
  }

  return [
    1,
    null,
    ...Array.from({ length: sidePages * 2 - 1 }, (_, i) => currentPage - sidePages + 1 + i),
    null,
    totalPages
  ];
}

// Add these constants at the top
const MIN_COLUMN_WIDTH = 100;
const MAX_COLUMN_WIDTH = 300;

function calculateColumnWidth(column: string, data: CsvRow[]): number {
  const sampleSize = Math.min(10, data.length);
  const sample = data.slice(0, sampleSize);
  const hasNumbers = sample.every(row => 
    typeof row[column] === 'number' || 
    (typeof row[column] === 'string' && !isNaN(Number(row[column])))
  );

  // Default widths within our limits
  return hasNumbers ? 120 : 200;
}

export function DataTable({ data, columns }: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {};
    columns.forEach(column => {
      widths[column] = calculateColumnWidth(column, data);
    });
    return widths;
  });
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const initialX = useRef<number>(0);
  const initialWidth = useRef<number>(0);

  function toggleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(curr => curr === 'asc' ? 'desc' : curr === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') setSortColumn(null);
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  // Ensure data is properly converted to numbers before sorting/displaying
  const processedData = data.map(row => {
    const newRow = { ...row };
    for (const key in newRow) {
      const value = newRow[key];
      if (typeof value === 'string' && !isNaN(Number(value))) {
        newRow[key] = Number(value);
      }
    }
    return newRow;
  });

  const sortedData = [...processedData];
  if (sortColumn && sortDirection) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleResizeStart(e: MouseEvent, column: string) {
    e.preventDefault();
    setResizingColumn(column);
    initialX.current = e.clientX;
    initialWidth.current = columnWidths[column] || 200; // Provide fallback
  }

  function handleResizeMove(e: MouseEvent) {
    if (!resizingColumn) return;
    
    const diff = e.clientX - initialX.current;
    const newWidth = Math.min(
      MAX_COLUMN_WIDTH,
      Math.max(MIN_COLUMN_WIDTH, initialWidth.current + diff)
    );
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
  }

  function handleResizeEnd() {
    setResizingColumn(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Data Preview</span>
        </CardTitle>
      </CardHeader>
      <div 
        className="overflow-x-auto"
        onMouseMove={handleResizeMove}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
      >
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={column}
                    className="cursor-pointer hover:bg-gray-50 relative group"
                    onClick={() => toggleSort(column)}
                    style={{ 
                      width: `${columnWidths[column]}px`, 
                      maxWidth: `${MAX_COLUMN_WIDTH}px`,
                      minWidth: `${MIN_COLUMN_WIDTH}px` 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="truncate max-w-full" title={column}>{column}</div>
                      {sortColumn === column && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4 flex-shrink-0" /> : 
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                    {index < columns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize group-hover:bg-gray-300"
                        onMouseDown={(e) => handleResizeStart(e, column)}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${index}-${column}`}
                      className="font-mono whitespace-nowrap text-text-dark/80"
                      style={{ 
                        width: `${columnWidths[column]}px`, 
                        maxWidth: `${MAX_COLUMN_WIDTH}px`,
                        minWidth: `${MIN_COLUMN_WIDTH}px` 
                      }}
                    >
                      <div className="truncate" title={formatCellValue(row[column], column)}>
                        {formatCellValue(row[column], column)}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                    />
                  </PaginationItem>
                  
                  {generatePaginationRange(currentPage, totalPages).map((pageNum, idx) => (
                    <PaginationItem key={idx}>
                      {pageNum === null ? (
                        <span className="px-4">...</span>
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
