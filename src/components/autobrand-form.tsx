"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Wand2 } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { generateLogo } from "@/ai/flows/generate-logo";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  logo: z.string().optional(),
  logoDescription: z.string().optional(),
  businessType: z.string({ required_error: "Please select a business type." }),
});

type AutoBrandFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isGenerating: boolean;
  setLogoPreview: (dataUri: string | null) => void;
  logoPreview: string | null;
};

const businessTypes = [
  "Food",
  "Fitness",
  "Tech",
  "Fashion",
  "Retail",
  "Real Estate",
  "Consulting",
  "Creative",
  "Other",
];

export function AutoBrandForm({
  onSubmit,
  isGenerating,
  setLogoPreview,
  logoPreview
}: AutoBrandFormProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("logo", result, { shouldValidate: true });
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLogo = async () => {
    const description = form.getValues("logoDescription");
    if (!description) {
      form.setError("logoDescription", { type: "manual", message: "Please describe your business." });
      return;
    }
    setIsGeneratingLogo(true);
    try {
      const result = await generateLogo({ description });
      form.setValue("logo", result.logoDataUri, { shouldValidate: true });
      setLogoPreview(result.logoDataUri);
      toast({
        title: "Logo Generated!",
        description: "Your new logo is ready.",
      });
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({
        variant: "destructive",
        title: "Logo Generation Failed",
        description: "Could not generate a logo. Please try again.",
      });
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleSubmitWithCheck = (values: z.infer<typeof formSchema>) => {
    if (!values.logo) {
      toast({
        variant: "destructive",
        title: "No Logo Provided",
        description: "Please upload or generate a logo before continuing.",
      });
      return;
    }
    onSubmit(values);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithCheck)} className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Logo</TabsTrigger>
            <TabsTrigger value="generate">Generate Logo</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="pt-4">
             <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/png, image/jpeg, image/svg+xml"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-32 border-dashed flex-col gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              width={100}
                              height={100}
                              className="max-h-28 w-auto object-contain"
                            />
                          ) : (
                            <>
                              <UploadCloud className="h-8 w-8 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Click to upload
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </TabsContent>
          <TabsContent value="generate" className="pt-4 space-y-4">
             <FormField
                control={form.control}
                name="logoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe Your Business</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A cozy coffee shop that serves artisanal pastries and locally roasted beans."
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>Our AI will generate a logo based on your description.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" className="w-full" onClick={handleGenerateLogo} disabled={isGeneratingLogo}>
                 {isGeneratingLogo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Logo
              </Button>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This helps us tailor the brand tone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isGenerating || isGeneratingLogo}>
          {(isGenerating || isGeneratingLogo) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Brand Kit
        </Button>
      </form>
    </Form>
  );
}
