
"use client";

import * as React from "react";
import { z } from "zod";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { extractBrandFromLogo, ExtractBrandFromLogoOutput } from "@/ai/flows/extract-brand-from-logo";
import { generateSocialMediaPosts } from "@/ai/flows/generate-social-media-posts";
import { useToast } from "@/hooks/use-toast";
import { AutoBrandForm } from "./autobrand-form";
import { BrandKitDisplay, BrandKitDisplaySkeleton } from "./brand-kit-display";
import { SocialMediaKit, SocialMediaKitSkeleton } from "./social-media-kit";
import { TemplateGallery, TemplateGallerySkeleton } from "./template-gallery";
import { Logo } from "./icons";
import { TemplatePreview } from "./template-preview";
import { Button } from "./ui/button";
import { ArrowLeft, BookMarked, Loader2 } from "lucide-react";
import { hexToHsl } from "@/lib/utils";
import { generateBrandGuidelines } from "@/ai/flows/generate-brand-guidelines";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { BrandGuidelinesDisplay } from "./brand-guidelines-display";
import { AudioJinglePlayer, AudioJinglePlayerSkeleton } from "./audio-jingle-player";

const formSchema = z.object({
  logo: z.string().optional(),
  logoDescription: z.string().optional(),
  businessType: z.string(),
});

type BrandData = {
  brandInfo: ExtractBrandFromLogoOutput;
  businessType: string;
  logoDataUri: string;
}

export type Template = {
  id: string;
  name: string;
  hint: string;
  width: number;
  height: number;
  assetType: string;
};

export default function AutoBrandPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isGeneratingGuidelines, setIsGeneratingGuidelines] = React.useState(false);
  const [brandData, setBrandData] = React.useState<BrandData | null>(null);
  const [socialPosts, setSocialPosts] = React.useState<string[] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [guidelinesHtml, setGuidelinesHtml] = React.useState<string | null>(null);
  const [isGuidelinesDialogOpen, setIsGuidelinesDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (brandData?.brandInfo.colorPalette) {
      const primaryColor = brandData.brandInfo.colorPalette[0];
      const accentColor = brandData.brandInfo.colorPalette[1] || brandData.brandInfo.colorPalette[0];
      
      const primaryHsl = hexToHsl(primaryColor);
      const accentHsl = hexToHsl(accentColor);

      const style = document.createElement('style');
      style.id = 'dynamic-brand-styles';
      style.innerHTML = `
        :root {
          --primary: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%;
          --accent: ${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%;
          --ring: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%;
        }
        .dark {
            --primary: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l + 10}%;
            --accent: ${accentHsl.h} ${accentHsl.s}% ${accentHsl.l + 10}%;
            --ring: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l + 10}%;
        }
      `;
      // Clean up previous style tag
      const existingStyle = document.getElementById('dynamic-brand-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      document.head.appendChild(style);
    }
  }, [brandData?.brandInfo.colorPalette]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.logo) {
      toast({
        variant: "destructive",
        title: "No Logo Provided",
        description: "Please upload or generate a logo before continuing.",
      });
      return;
    }

    setIsGenerating(true);
    setBrandData(null);
    setSocialPosts(null);
    setSelectedTemplate(null);
    setGuidelinesHtml(null);

    try {
      const brandResult = await extractBrandFromLogo({
        logoDataUri: values.logo,
        businessType: values.businessType,
      });

      const postsPromise = generateSocialMediaPosts({
        logoDataUri: values.logo,
        businessType: values.businessType,
        brandTone: brandResult.brandTone,
      });

      setBrandData({ 
        brandInfo: brandResult, 
        businessType: values.businessType, 
        logoDataUri: values.logo 
      });
      
      const postsResult = await postsPromise;
      setSocialPosts(postsResult.postSuggestions);

    } catch (error) {
      console.error("Error generating brand kit:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating your brand kit. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleBackToGallery = () => {
    setSelectedTemplate(null);
  };
  
  const handleColorChange = (colorIndex: number, newColor: string) => {
    if (!brandData) return;
    setBrandData(prev => prev && {
      ...prev,
      brandInfo: {
        ...prev.brandInfo,
        colorPalette: prev.brandInfo.colorPalette.map((c, i) => i === colorIndex ? newColor : c),
      }
    });
  };

  const handleFontStyleChange = (newFontStyle: string) => {
    if (!brandData) return;
    setBrandData(prev => prev && {
      ...prev,
      brandInfo: { ...prev.brandInfo, fontStyle: newFontStyle }
    });
  };

  const handleBrandToneChange = (newBrandTone: string) => {
    if (!brandData) return;
    setBrandData(prev => prev && {
      ...prev,
      brandInfo: { ...prev.brandInfo, brandTone: newBrandTone }
    });
  };

  const handleGenerateGuidelines = async () => {
    if (!brandData) return;
    setIsGeneratingGuidelines(true);
    setGuidelinesHtml(null);
    try {
      const result = await generateBrandGuidelines({
        brandInfo: brandData.brandInfo,
        businessType: brandData.businessType,
        logoDataUri: brandData.logoDataUri,
      });
      setGuidelinesHtml(result.guidelinesHtml);
      setIsGuidelinesDialogOpen(true);
    } catch (error) {
       console.error("Error generating brand guidelines:", error);
       toast({
        variant: "destructive",
        title: "Guidelines Generation Failed",
        description: "Could not generate brand guidelines. Please try again.",
      });
    } finally {
      setIsGeneratingGuidelines(false);
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <>
          <BrandKitDisplaySkeleton />
          <SocialMediaKitSkeleton />
          <AudioJinglePlayerSkeleton />
          <TemplateGallerySkeleton />
        </>
      );
    }
    
    if (brandData) {
      if (selectedTemplate) {
        return (
          <div>
            <Button variant="ghost" onClick={handleBackToGallery} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4"/>
              Back to Templates
            </Button>
            <TemplatePreview 
              template={selectedTemplate}
              brandInfo={brandData.brandInfo}
              businessType={brandData.businessType}
            />
          </div>
        );
      }
      return (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Your Brand Kit</h2>
            <Dialog open={isGuidelinesDialogOpen} onOpenChange={setIsGuidelinesDialogOpen}>
              <DialogTrigger asChild>
                  <Button onClick={handleGenerateGuidelines} disabled={isGeneratingGuidelines}>
                    {isGeneratingGuidelines ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BookMarked className="mr-2 h-4 w-4" />}
                    Brand Guidelines
                  </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Brand Guidelines</DialogTitle>
                </DialogHeader>
                <BrandGuidelinesDisplay htmlContent={guidelinesHtml} isLoading={isGeneratingGuidelines}/>
              </DialogContent>
            </Dialog>
          </div>
          <BrandKitDisplay 
            brandInfo={brandData.brandInfo} 
            onColorChange={handleColorChange}
            onFontStyleChange={handleFontStyleChange}
            onBrandToneChange={handleBrandToneChange}
          />
          {socialPosts ? <SocialMediaKit posts={socialPosts} /> : <SocialMediaKitSkeleton />}
          <AudioJinglePlayer brandName="My Brand" businessType={brandData.businessType} />
          <TemplateGallery 
            brandInfo={brandData.brandInfo} 
            onTemplateSelect={setSelectedTemplate}
          />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center bg-card rounded-xl border border-dashed">
          <Logo className="w-24 h-24 text-muted-foreground/50"/>
          <h2 className="mt-6 text-2xl font-headline font-semibold">Welcome to AutoBrand AI</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
              Get started by uploading or generating your logo in the sidebar. We&apos;ll instantly create a complete brand kit for you.
          </p>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="none" className="p-0">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">AutoBrand AI</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Brand me in a click.
          </p>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <AutoBrandForm 
            onSubmit={onSubmit} 
            isGenerating={isGenerating} 
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8 space-y-8">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
