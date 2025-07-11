"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import { autoApplyBrandToTemplate } from "@/ai/flows/auto-apply-brand-to-template";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2 } from "lucide-react";

const templates = [
  { id: "flyer-01", name: "Business Flyer", hint: "business flyer", width: 400, height: 518 },
  { id: "ig-post-01", name: "Instagram Post", hint: "social media", width: 400, height: 400 },
  { id: "bizcard-01", name: "Business Card", hint: "business card", width: 400, height: 233 },
  { id: "story-01", name: "Instagram Story", hint: "phone wallpaper", width: 400, height: 711 },
];

type TemplateGalleryProps = {
  brandInfo: ExtractBrandFromLogoOutput;
};

function TemplateCard({
  template,
  brandInfo,
}: {
  template: (typeof templates)[0];
  brandInfo: ExtractBrandFromLogoOutput;
}) {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = React.useState(false);
  const [isApplied, setIsApplied] = React.useState(false);

  const handleApplyBrand = async () => {
    setIsApplying(true);
    try {
      await autoApplyBrandToTemplate({
        templateId: template.id,
        colorPalette: brandInfo.colorPalette,
        fontStyle: brandInfo.fontStyle,
        brandTone: brandInfo.brandTone,
      });
      setIsApplied(true);
      toast({
        title: "Brand Applied!",
        description: `Your brand has been applied to the ${template.name} template.`,
      });
    } catch (error) {
      console.error("Error applying brand:", error);
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: "Could not apply brand to the template.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-w-1 aspect-h-1 bg-muted">
          <Image
            src={`https://placehold.co/${template.width}x${template.height}.png`}
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
      <CardFooter className="flex justify-between items-center pt-4">
        <p className="font-semibold">{template.name}</p>
        <Button
          onClick={handleApplyBrand}
          disabled={isApplying || isApplied}
          size="sm"
          variant={isApplied ? "secondary" : "default"}
        >
          {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isApplied && <Check className="mr-2 h-4 w-4" />}
          {isApplied ? "Applied" : "Apply Brand"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TemplateGallery({ brandInfo }: TemplateGalleryProps) {
  return (
    <div>
      <h2 className="text-3xl font-headline font-bold tracking-tight mb-4">
        Branded Templates
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            brandInfo={brandInfo}
          />
        ))}
      </div>
    </div>
  );
}

export function TemplateGallerySkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-72 mb-4" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-0">
              <Skeleton className="w-full h-48" />
            </CardContent>
            <CardFooter className="pt-4 flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
