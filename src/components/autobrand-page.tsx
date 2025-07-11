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
import { generateSocialMediaHeaders } from "@/ai/flows/generate-social-media-headers";
import { useToast } from "@/hooks/use-toast";
import { AutoBrandForm } from "./autobrand-form";
import { BrandKitDisplay, BrandKitDisplaySkeleton } from "./brand-kit-display";
import { SocialMediaKit, SocialMediaKitSkeleton } from "./social-media-kit";
import { TemplateGallery, TemplateGallerySkeleton } from "./template-gallery";
import { Logo } from "./icons";

const formSchema = z.object({
  logo: z.string(),
  businessType: z.string(),
});

type BrandData = {
  brandInfo: ExtractBrandFromLogoOutput;
  businessType: string;
}

export default function AutoBrandPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [brandData, setBrandData] = React.useState<BrandData | null>(null);
  const [socialHeaders, setSocialHeaders] = React.useState<string[] | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setBrandData(null);
    setSocialHeaders(null);
    try {
      const brandPromise = extractBrandFromLogo({
        logoDataUri: values.logo,
        businessType: values.businessType,
      });
      const headersPromise = generateSocialMediaHeaders({
        logoDataUri: values.logo,
        businessType: values.businessType,
      });

      const [brandResult, headersResult] = await Promise.all([
        brandPromise,
        headersPromise,
      ]);

      setBrandData({ brandInfo: brandResult, businessType: values.businessType });
      setSocialHeaders(headersResult.headerSuggestions);

      toast({
        title: "Success!",
        description: "Your brand kit has been generated.",
      });
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
          <AutoBrandForm onSubmit={onSubmit} isGenerating={isGenerating} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8 space-y-8">
          {isGenerating ? (
            <>
              <BrandKitDisplaySkeleton />
              <SocialMediaKitSkeleton />
              <TemplateGallerySkeleton />
            </>
          ) : brandData ? (
            <>
              <BrandKitDisplay brandInfo={brandData.brandInfo} />
              {socialHeaders && <SocialMediaKit headers={socialHeaders} />}
              <TemplateGallery brandInfo={brandData.brandInfo} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center bg-card rounded-xl border border-dashed">
                <Logo className="w-24 h-24 text-muted-foreground/50"/>
                <h2 className="mt-6 text-2xl font-headline font-semibold">Welcome to AutoBrand AI</h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                    Get started by uploading your logo and selecting your business type in the sidebar. We&apos;ll instantly generate a complete brand kit for you.
                </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
