"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareQuote } from "lucide-react";

type SocialMediaKitProps = {
  posts: string[];
};

export function SocialMediaKit({ posts }: SocialMediaKitProps) {
  return (
    <div>
      <h2 className="text-3xl font-headline font-bold tracking-tight mb-4">
        Social Media Post Ideas
      </h2>
      <Card>
        <CardContent className="pt-6">
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li key={index} className="flex items-start gap-4">
                <MessageSquareQuote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground whitespace-pre-wrap">{post}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function SocialMediaKitSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-80 mb-4" />
      <Card>
        <CardContent className="pt-6">
          <ul className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <li key={index} className="flex items-start gap-4">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
