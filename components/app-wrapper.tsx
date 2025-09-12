// components/app-wrapper.tsx
"use client"

import ErrorBoundary from "@/components/error-boundary";

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}