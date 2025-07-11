
"use client";

import type { ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Type, Sparkles, Edit } from "lucide-react";

type BrandKitDisplayProps = {
  brandInfo: ExtractBrandFromLogoOutput;
  onColorChange: (index: number, newColor: string) => void;
  onFontStyleChange: (newStyle: string) => void;
  onBrandToneChange: (newTone: string) => void;
};

const fontStyles = ["sans-serif", "serif", "display", "handwriting", "monospace"];
const brandTones = ["modern", "playful", "minimal", "elegant", "corporate"];

export function BrandKitDisplay({ 
  brandInfo, 
  onColorChange, 
  onFontStyleChange, 
  onBrandToneChange 
}: BrandKitDisplayProps) {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Palette className="w-5 h-5 text-primary" />
            Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-start">
            {brandInfo.colorPalette.map((color, index) => (
              <div key={index} className="relative group">
                <label
                  aria-label={`Change color ${color}`}
                  className="block w-20 h-20 rounded-lg border cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Edit className="w-6 h-6 text-white"/>
                  </div>
                  <input 
                    type="color"
                    value={color}
                    onChange={(e) => onColorChange(index, e.target.value)}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    aria-label={`Change color for ${color}`}
                  />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
          <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
              <Type className="w-5 h-5 text-primary" />
              Typography
              </CardTitle>
          </CardHeader>
          <CardContent>
              <Select onValueChange={onFontStyleChange} defaultValue={brandInfo.fontStyle}>
                  <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select a font style" />
                  </SelectTrigger>
                  <SelectContent>
                  {fontStyles.map((style) => (
                      <SelectItem key={style} value={style} className="capitalize">
                      {style}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
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
              <Select onValueChange={onBrandToneChange} defaultValue={brandInfo.brandTone}>
                  <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select a brand tone" />
                  </SelectTrigger>
                  <SelectContent>
                  {brandTones.map((tone) => (
                      <SelectItem key={tone} value={tone} className="capitalize">
                      {tone}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
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
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
