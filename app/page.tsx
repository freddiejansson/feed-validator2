'use client';

import { FileUpload } from '@/components/upload/FileUpload';
import { CogsDistributionCard } from '@/components/analytics/CogsDistributionCard';
import { ShippingDistributionCard } from '@/components/analytics/ShippingDistributionCard';
import { MarginDistributionCard } from '@/components/analytics/MarginDistributionCard';
import AnimatedFeedLogo from '@/components/ui/animated-feed-logo';
import { useState } from 'react';

export default function Home() {
  const [processedData, setProcessedData] = useState<Array<{ 
    costPrice: number;
    shippingCost: number;
    salesPrice: number;
  }>>([]);

  const handleFileProcessed = (data: Record<string, unknown>[]) => {
    console.log('File processed. Number of rows:', data.length);
    
    const transformedData = data.map(row => ({
      costPrice: parseFloat(String(row.costPrice || row.cogs || row.cost_price || '0')),
      shippingCost: parseFloat(String(row.shippingCost || row.shipping_cost || row.shipping || '0')),
      salesPrice: parseFloat(String(row.salesPrice || row.sales_price || row.price || '0'))
    }));
    
    setProcessedData(transformedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--background-gray)] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <AnimatedFeedLogo />
          <h1 className="text-4xl font-bold text-purple-dark">Kuvio Feed Validator</h1>
          <p className="text-xl text-text-dark/70">
            Upload your CSV feed for validation and analytics
          </p>
        </div>

        <FileUpload onFileProcessed={handleFileProcessed} />
        
        {processedData.length > 0 && (
          <>
            <CogsDistributionCard data={processedData} />
            <ShippingDistributionCard data={processedData} />
            <MarginDistributionCard 
              data={processedData.map(item => ({
                salesPrice: item.salesPrice,
                costPrice: item.costPrice,
                shippingCosts: item.shippingCost
              }))} 
            />
          </>
        )}

      </div>
    </div>
  );
}
