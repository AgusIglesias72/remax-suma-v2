import { useUser } from "@clerk/nextjs";

export type UserRole = 'CLIENT' | 'AGENT' | 'TEAM_LEADER' | 'OFFICE_MANAGER' | 'ADMIN' | 'SUPER_ADMIN';

interface UserMetadata {
  role?: UserRole;
  agencyId?: string;
  teamId?: string;
}

export function useRole() {
  const { user } = useUser();
  const metadata = user?.unsafeMetadata as UserMetadata;
  const role = metadata?.role || 'CLIENT';
  
  const isClient = role === 'CLIENT';
  const isAgent = ['AGENT', 'TEAM_LEADER', 'OFFICE_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isTeamLeader = ['TEAM_LEADER', 'OFFICE_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isOfficeManager = ['OFFICE_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
  const isSuperAdmin = role === 'SUPER_ADMIN';
  
  return {
    role,
    isClient,
    isAgent,
    isTeamLeader,
    isOfficeManager,
    isAdmin,
    isSuperAdmin,
    agencyId: metadata?.agencyId,
    teamId: metadata?.teamId,
  };
}