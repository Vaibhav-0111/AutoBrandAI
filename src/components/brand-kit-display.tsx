"use client";

import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Type, Sparkles } from "lucide-react";

type BrandKitDisplayProps = {
  brandInfo: ExtractBrandFromLogoOutput;
};

export function BrandKitDisplay({ brandInfo }: BrandKitDisplayProps) {
  return (
    <div>
      <h2 className="text-3xl font-headline font-bold tracking-tight mb-4">Your Brand Kit</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Palette className="w-5 h-5 text-primary" />
              Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {brandInfo.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-full h-16 rounded-md flex items-end justify-end p-2 border"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-xs font-mono mix-blend-difference text-white">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Type className="w-5 h-5 text-primary" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg capitalize">{brandInfo.fontStyle}</p>
            <p className="text-sm text-muted-foreground">
              Recommended font style
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="w-5 h-5 text-primary" />
              Brand Tone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg capitalize">{brandInfo.brandTone}</p>
            <p className="text-sm text-muted-foreground">
              Overall brand personality
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BrandKitDisplaySkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-64 mb-4" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
