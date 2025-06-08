// components/app-wrapper.tsx
"use client"

import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import ErrorBoundary from "@/components/error-boundary";

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <ErrorBoundary>
      <GoogleMapsProvider>
        {children}
      </GoogleMapsProvider>
    </ErrorBoundary>
  );
}