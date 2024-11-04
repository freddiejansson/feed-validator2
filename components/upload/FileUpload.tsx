import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FileText, Upload, HardDrive, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DataTable } from '@/components/upload/DataTable';
import { ColumnList } from '@/components/upload/ColumnList';
import { FieldSpecifications } from './FieldSpecifications';

interface FileUploadProps {
  onFileProcessed: (data: any[], columns: string[]) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    rows: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleFile = useCallback(async (file: File) => {
    console.log('Starting file processing:', file.name);
    setIsUploading(true);
    setShowProgress(true);
    setUploadProgress(0);
    setFileInfo({
      name: file.name,
      size: file.size,
      rows: 0,
    });

    // Simulate progress
    const startTime = Date.now();
    const duration = 5000; // 5 seconds
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 99);
      setUploadProgress(progress);
      
      if (elapsed >= duration) {
        clearInterval(progressInterval);
      }
    }, 50);

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parse complete:', results);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);
        const typedData = results.data as Record<string, any>[];
        const columns = Object.keys(typedData[0] || {});
        setParsedData(typedData);
        setColumns(columns);
        setFileInfo(prev => prev ? { 
          ...prev, 
          rows: results.data.length,
        } : null);
        onFileProcessed(results.data, columns);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
        setShowProgress(false);
      },
    });
  }, [onFileProcessed]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl bg-white p-12 text-center 
          transition-colors cursor-pointer relative group
          ${isDragActive ? 'border-purple bg-gray-light/50' : 'border-gray-medium hover:border-purple'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-coral/5 to-teal/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Upload className="w-12 h-12 mx-auto mb-4 text-purple" />
        <p className="text-text-dark/70">
          {isDragActive ? "Drop the CSV file here..." : "Drag and drop a CSV file here, or click to select a file"}
        </p>
      </div>

      {showProgress && (
        <ProgressBar 
          progress={uploadProgress}
          isUploading={isUploading}
        />
      )}

      {fileInfo && (
        <>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-text-dark/80">
                  <FileText className="w-4 h-4 text-purple" />
                  <span className="font-medium">Name:</span>
                  <span className="font-mono text-sm">{fileInfo.name}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-text-dark/80">
                    <HardDrive className="w-4 h-4 text-coral" />
                    <span className="font-medium">Size:</span>
                    <span>{(fileInfo.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  
                  {fileInfo.rows > 0 && (
                    <div className="flex items-center gap-3 text-text-dark/80">
                      <Database className="w-4 h-4 text-teal" />
                      <span className="font-medium">Rows:</span>
                      <span>{fileInfo.rows.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <ColumnList columns={columns} />

          <DataTable data={parsedData} columns={columns} />

          {fileInfo && parsedData.length > 0 && (
            <FieldSpecifications data={parsedData} />
          )}
        </>
      )}
    </div>
  );
}
