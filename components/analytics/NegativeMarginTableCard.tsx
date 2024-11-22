import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

interface NegativeMarginProduct {
  sku: string;
  title: string;
  salesPrice: number;
  costPrice: number;
  shippingCosts: number;
}

interface NegativeMarginTableProps {
  data: Array<NegativeMarginProduct>;
}

export function NegativeMarginTableCard({ data }: NegativeMarginTableProps) {
  const negativeMarginProducts = useMemo(() => {
    return data
      .map(product => ({
        ...product,
        margin: product.salesPrice > 0
          ? ((product.salesPrice - product.costPrice - product.shippingCosts) / product.salesPrice) * 100
          : -100
      }))
      .filter(product => product.margin < 0)
      .sort((a, b) => a.margin - b.margin); // Sort by lowest margin first
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>Negative Margin Products ({negativeMarginProducts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">COGS</TableHead>
                <TableHead className="text-right">Shipping Cost</TableHead>
                <TableHead className="text-right">Margin %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {negativeMarginProducts.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-mono">{product.sku}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell className="text-right">
                    ${product.salesPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.costPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.shippingCosts.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-red-500 font-medium">
                    {product.margin.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 