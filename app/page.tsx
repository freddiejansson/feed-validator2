'use client';

import { FileUpload } from '@/components/upload/FileUpload';
import Image from 'next/image'

export default function Home() {
  const handleFileProcessed = (data: any[], columns: string[]) => {
    console.log('File processed. Number of rows:', data.length);
    console.log('Columns detected:', columns);
    console.log('First row sample:', data[0]);
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
      </div>
    </div>
  );
}
