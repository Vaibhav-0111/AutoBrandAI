"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateJingle } from "@/ai/flows/generate-jingle";
import { Loader2, Music4, Play, StopCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type AudioJinglePlayerProps = {
  brandName: string;
  businessType: string;
};

export function AudioJinglePlayer({ brandName, businessType }: AudioJinglePlayerProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [jingleData, setJingleData] = React.useState<{ url: string, script: string } | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleGenerateJingle = async () => {
    setIsGenerating(true);
    setJingleData(null);
    setIsPlaying(false);
    try {
      const result = await generateJingle({
        brandName: brandName || "My Brand", // Provide a fallback
        businessType
      });
      setJingleData({ url: result.jingleUrl, script: result.jingleScript });
      toast({
        title: "Jingle Generated!",
        description: "Your new audio jingle is ready to play.",
      });
    } catch (error) {
      console.error("Error generating jingle:", error);
      toast({
        variant: "destructive",
        title: "Jingle Generation Failed",
        description: "Could not generate an audio jingle. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  };
  
  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);

      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [jingleData]);

  if (isGenerating) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Music4 className="w-5 h-5 text-primary" />
                    Audio Jingle
                </CardTitle>
                <CardDescription>Generate a catchy audio snippet for your brand.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-col gap-4 text-center p-8">
                 <Loader2 className="w-10 h-10 animate-spin text-primary" />
                 <p className="font-semibold">Writing and recording your jingle...</p>
                 <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Music4 className="w-5 h-5 text-primary" />
          Audio Jingle
        </CardTitle>
        <CardDescription>Generate a catchy audio snippet for your brand.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {jingleData && (
          <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
             <Button size="icon" variant="primary" onClick={togglePlay}>
                {isPlaying ? <StopCircle className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
             </Button>
             <div className="flex-1">
                <p className="font-semibold">Your Brand Jingle</p>
                <p className="text-sm text-muted-foreground italic">&quot;{jingleData.script}&quot;</p>
             </div>
             <audio ref={audioRef} src={jingleData.url} className="hidden"/>
          </div>
        )}
        <Button onClick={handleGenerateJingle} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Music4 className="mr-2 h-4 w-4" />
          )}
          {jingleData ? "Regenerate Jingle" : "Generate Jingle"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function AudioJinglePlayerSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-36 mb-1"/>
                <Skeleton className="h-4 w-full"/>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full"/>
            </CardContent>
        </Card>
    )
}
