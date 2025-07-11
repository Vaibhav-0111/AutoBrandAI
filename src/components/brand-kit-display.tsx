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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type BrandKitDisplayProps = {
  brandInfo: ExtractBrandFromLogoOutput;
  onColorChange: (index: number, newColor: string) => void;
};

export function BrandKitDisplay({ brandInfo, onColorChange }: BrandKitDisplayProps) {

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
            <div className="flex gap-2 justify-around">
              {brandInfo.colorPalette.map((color, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <button
                      aria-label={`Change color ${color}`}
                      className="relative w-20 h-20 rounded-lg flex items-end justify-end p-2 border cursor-pointer group transition-transform hover:scale-105"
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
                    </button>
                  </PopoverTrigger>
                </Popover>
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
            <div className="flex gap-2 justify-around">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
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
