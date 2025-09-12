import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRole } from "./use-role";

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const { role } = useRole();

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Función para sincronizar el usuario con nuestra base de datos
    const syncUser = async () => {
      try {
        const response = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            role: role,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.imageUrl,
          }),
        });

        if (!response.ok) {
          console.error('Failed to sync user with database');
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    syncUser();
  }, [user, isLoaded, role]);

  return { user, isLoaded };
}