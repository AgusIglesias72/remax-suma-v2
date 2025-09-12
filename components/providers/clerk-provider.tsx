'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/use-user-sync';

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

function UserSyncComponent({ children }: { children: React.ReactNode }) {
  useUserSync();
  return <>{children}</>;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: {
          colorPrimary: '#3b82f6',
          colorTextOnPrimaryBackground: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg',
        },
      }}
    >
      <UserSyncComponent>
        {children}
      </UserSyncComponent>
    </ClerkProvider>
  );
}