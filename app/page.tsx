'use client';

import { FileUpload } from '@/components/upload/FileUpload';

export default function Home() {
  const handleFileProcessed = (data: any[]) => {
    console.log('Processed data:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-light p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto bg-purple rounded-lg" />
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
