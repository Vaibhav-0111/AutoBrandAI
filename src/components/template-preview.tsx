
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import { generateBrandedAsset } from "@/ai/flows/generate-branded-asset";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Wand2 } from "lucide-react";
import { type Template } from "./autobrand-page";
import { Card, CardContent } from "./ui/card";

type TemplatePreviewProps = {
  template: Template;
  brandInfo: ExtractBrandFromLogoOutput;
  businessType: string;
};

export function TemplatePreview({
  template,
  brandInfo,
  businessType,
}: TemplatePreviewProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedAsset, setGeneratedAsset] = React.useState<string | null>(null);

  const handleGenerateAsset = async () => {
    setIsGenerating(true);
    setGeneratedAsset(null);
    try {
      const result = await generateBrandedAsset({
        assetType: template.assetType,
        colorPalette: brandInfo.colorPalette,
        fontStyle: brandInfo.fontStyle,
        brandTone: brandInfo.brandTone,
        businessType: businessType,
      });
      setGeneratedAsset(result.assetDataUri);
      toast({
        title: "Asset Generated!",
        description: `Your ${template.name} has been created.`,
      });
    } catch (error) {
      console.error("Error generating asset:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate the asset.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedAsset) return;
    const link = document.createElement("a");
    link.href = generatedAsset;
    link.download = `${template.name.replace(/\s+/g, '-')}-branded.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
        <h2 className="text-3xl font-headline font-bold tracking-tight mb-4">{template.name} Preview</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                         <div className="aspect-w-1 aspect-h-1 bg-muted">
                            <Image
                                src={generatedAsset || `https://placehold.co/${template.width}x${template.height}.png`}
                                alt={template.name}
                                width={template.width}
                                height={template.height}
                                data-ai-hint={template.hint}
                                className="w-full h-auto object-cover"
                                style={{
                                    borderBottom: `8px solid ${brandInfo.colorPalette[0] || 'hsl(var(--primary))'}`
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">This is a preview of your selected template with your brand's primary color. Click generate to create a unique, fully branded asset with AI.</p>
                <Button
                    onClick={handleGenerateAsset}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full"
                >
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {generatedAsset ? "Regenerate" : "Generate Asset"}
                </Button>
                
                {generatedAsset && (
                    <Button onClick={handleDownload} variant="secondary" size="lg" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Asset
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}
