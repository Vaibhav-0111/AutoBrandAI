"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import { type Template } from "./autobrand-page";

const templates: Template[] = [
  { id: "flyer-01", name: "Business Flyer", hint: "business flyer", width: 400, height: 518, assetType: "Business Flyer" },
  { id: "ig-post-01", name: "Instagram Post", hint: "social media", width: 400, height: 400, assetType: "Instagram Post" },
  { id: "bizcard-01", name: "Business Card", hint: "business card", width: 400, height: 233, assetType: "Business Card" },
  { id: "story-01", name: "Instagram Story", hint: "phone wallpaper", width: 400, height: 711, assetType: "Instagram Story" },
];

type TemplateGalleryProps = {
  brandInfo: ExtractBrandFromLogoOutput;
  onTemplateSelect: (template: Template) => void;
};

function TemplateCard({
  template,
  brandInfo,
  onSelect,
}: {
  template: Template;
  brandInfo: ExtractBrandFromLogoOutput;
  onSelect: () => void;
}) {
  return (
    <Card className="overflow-hidden cursor-pointer group" onClick={onSelect}>
      <CardContent className="p-0">
        <div className="aspect-w-1 aspect-h-1 bg-muted">
            <Image
            src={`https://placehold.co/${template.width}x${template.height}.png`}
            alt={template.name}
            width={template.width}
            height={template.height}
            data-ai-hint={template.hint}
            className="w-full h-auto object-cover transition-transform group-hover:scale-105"
            style={{
                borderBottom: `8px solid ${brandInfo.colorPalette[0] || 'hsl(var(--primary))'}`
            }}
            />
        </div>
      </CardContent>
       <div className="p-4">
        <p className="font-semibold text-sm">{template.name}</p>
      </div>
    </Card>
  );
}

export function TemplateGallery({ brandInfo, onTemplateSelect }: TemplateGalleryProps) {
  return (
    <div>
      <h2 className="text-3xl font-headline font-bold tracking-tight mb-1">
        Branded Templates
      </h2>
      <p className="text-muted-foreground mb-4">Select a template to preview and generate your asset.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            brandInfo={brandInfo}
            onSelect={() => onTemplateSelect(template)}
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
            <div className="p-4">
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
