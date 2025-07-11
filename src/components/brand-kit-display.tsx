"use client";

import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Type, Sparkles, Edit } from "lucide-react";

type BrandKitDisplayProps = {
  brandInfo: ExtractBrandFromLogoOutput;
  onColorChange: (index: number, newColor: string) => void;
};

export function BrandKitDisplay({ brandInfo, onColorChange }: BrandKitDisplayProps) {
  const colorInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleColorBoxClick = (index: number) => {
    colorInputRefs.current[index]?.click();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-headline font-bold tracking-tight">Your Brand Kit</h2>
        <p className="text-sm text-muted-foreground hidden md:block">Click a color to customize it.</p>
      </div>
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
                  className="relative w-full h-16 rounded-md flex items-end justify-end p-2 border cursor-pointer group"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorBoxClick(index)}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit className="w-5 h-5 text-white"/>
                  </div>
                  <span className="text-xs font-mono mix-blend-difference text-white">
                    {color}
                  </span>
                  <input 
                    type="color"
                    ref={(el) => colorInputRefs.current[index] = el}
                    value={color}
                    onChange={(e) => onColorChange(index, e.target.value)}
                    className="absolute w-0 h-0 opacity-0"
                  />
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
