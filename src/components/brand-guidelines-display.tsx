
"use client";

import * as React from 'react';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

type BrandGuidelinesDisplayProps = {
  htmlContent: string | null;
  isLoading: boolean;
};

export function BrandGuidelinesDisplay({ htmlContent, isLoading }: BrandGuidelinesDisplayProps) {
  
  const handleDownload = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brand-guidelines.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!htmlContent) {
    return (
       <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground">Your generated brand guidelines will appear here.</p>
       </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 border rounded-md p-4 bg-white">
         <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </ScrollArea>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download HTML
        </Button>
      </div>
    </div>
  );
}
