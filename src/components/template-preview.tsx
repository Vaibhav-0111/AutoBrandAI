
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { MockupDisplay } from "./mockup-display";

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
  const [brandName, setBrandName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");


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
        brandName,
        phone,
        email,
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
        description: "Could not generate the asset. Please try again.",
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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <Card className="overflow-hidden sticky top-8">
                    <CardContent className="p-0">
                         <div className="aspect-w-1 aspect-h-1 bg-muted rounded-lg flex items-center justify-center">
                            {isGenerating ? (
                                <div className="flex items-center justify-center flex-col gap-4 p-8 text-center">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                    <h3 className="text-xl font-headline font-semibold">Generating Your Asset...</h3>
                                    <p className="text-muted-foreground">The AI is working its magic. This might take a moment.</p>
                                </div>
                            ) : (
                                <Image
                                    src={generatedAsset || `https://placehold.co/${template.width}x${template.height}.png`}
                                    alt={template.name}
                                    width={template.width}
                                    height={template.height}
                                    data-ai-hint={template.hint}
                                    className="w-full h-auto object-contain"
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-headline font-semibold mb-2">1. Add Your Details</h3>
                  <p className="text-muted-foreground mb-4">This information will be included in your generated asset.</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brandName">Brand Name</Label>
                        <Input id="brandName" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., SparkleClean" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g., (555) 123-4567" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g., contact@sparkleclean.com" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
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
                        {generatedAsset ? "Regenerate Asset" : "Generate Asset"}
                    </Button>
                    
                    {generatedAsset && !isGenerating && (
                        <Button onClick={handleDownload} variant="outline" size="lg" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Asset
                        </Button>
                    )}
                </div>

                {generatedAsset && !isGenerating && (
                    <>
                        <Separator />
                        <MockupDisplay 
                            assetDataUri={generatedAsset}
                            assetType={template.assetType}
                            businessType={businessType}
                        />
                    </>
                )}
            </div>
        </div>
    </div>
  );
}
