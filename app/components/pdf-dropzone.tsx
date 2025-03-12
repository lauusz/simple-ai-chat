'use client';

import { cn } from '@/lib/utils';
import { FileUp } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFDropzoneProps {
  onPDFSelect: (file: File) => void;
  isLoading: boolean;
}

export function PDFDropzone({ onPDFSelect, isLoading }: PDFDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === 'application/pdf') {
        onPDFSelect(file);
      }
    },
    [onPDFSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <FileUp className="h-8 w-8 mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-center">
        {isDragActive
          ? 'Drop your PDF here'
          : 'Drag & drop a PDF file here, or click to select one'}
      </p>
    </div>
  );
}