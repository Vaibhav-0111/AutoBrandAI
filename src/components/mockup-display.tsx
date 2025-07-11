"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Sparkles } from "lucide-react";
import { generateMockup } from "@/ai/flows/generate-mockup";

type MockupDisplayProps = {
  assetDataUri: string;
  assetType: string;
  businessType: string;
};

export function MockupDisplay({ assetDataUri, assetType, businessType }: MockupDisplayProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [mockup, setMockup] = React.useState<string | null>(null);

  const handleGenerateMockup = async () => {
    setIsGenerating(true);
    setMockup(null);
    try {
      const result = await generateMockup({
        assetDataUri,
        assetType,
        businessType,
      });
      setMockup(result.mockupDataUri);
      toast({
        title: "Mockup Generated!",
        description: "Your new mockup is ready to be downloaded.",
      });
    } catch (error) {
      console.error("Error generating mockup:", error);
      toast({
        variant: "destructive",
        title: "Mockup Generation Failed",
        description: "Could not generate a mockup. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!mockup) return;
    const link = document.createElement("a");
    link.href = mockup;
    link.download = `${assetType.replace(/\s+/g, '-')}-mockup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold">Generate a Mockup</h3>
        <p className="text-muted-foreground">
          Bring your asset to life by placing it in a realistic scene.
        </p>
      </div>

      {mockup && !isGenerating && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={mockup}
              alt={`${assetType} Mockup`}
              width={512}
              height={512}
              className="w-full h-auto object-contain"
            />
          </CardContent>
        </Card>
      )}

      {isGenerating && (
         <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-4 p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h3 className="text-xl font-headline font-semibold">Creating Mockup...</h3>
                <p className="text-muted-foreground">The AI is building a scene for your asset. This may take a moment.</p>
            </div>
        </div>
      )}


      <div className="flex flex-col gap-4">
        <Button onClick={handleGenerateMockup} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {mockup ? "Regenerate Mockup" : "Generate Mockup"}
        </Button>

        {mockup && !isGenerating && (
          <Button onClick={handleDownload} variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download Mockup
          </Button>
        )}
      </div>
    </div>
  );
}
