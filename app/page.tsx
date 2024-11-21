'use client';

import { FileUpload } from '@/components/upload/FileUpload';
import { CogsDistributionCard } from '@/components/analytics/CogsDistributionCard';
import { ShippingDistributionCard } from '@/components/analytics/ShippingDistributionCard';
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [processedData, setProcessedData] = useState<Array<{ 
    costPrice: number;
    shippingCost: number;
  }>>([]);

  const handleFileProcessed = (data: any[], columns: string[]) => {
    console.log('File processed. Number of rows:', data.length);
    
    const transformedData = data.map(row => ({
      costPrice: parseFloat(row.costPrice || row.cogs || row.cost_price || 0),
      shippingCost: parseFloat(row.shippingCost || row.shipping_cost || row.shipping || 0)
    }));
    
    console.log('Transformed data sample:', transformedData[0]);
    setProcessedData(transformedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-light p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Image
            src="/kuvio-logos/kuvio-logo-colors.svg"
            alt="Kuvio Logo"
            width={200}
            height={36}
            className="mx-auto"
            priority
          />
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
          </>
        )}

      </div>
    </div>
  );
}
