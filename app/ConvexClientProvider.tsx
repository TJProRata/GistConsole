"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { usePreviewConversion } from "@/lib/hooks/usePreviewConversion";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function PreviewConversionHandler() {
  usePreviewConversion();
  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <PreviewConversionHandler />
      {children}
    </ConvexProviderWithClerk>
  );
}
