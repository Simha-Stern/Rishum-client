export type InstitutionRole = 'manager' | 'secretary';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  idNumber: string | null;
  isSystemAdmin: boolean;
}

export interface Membership {
  institutionId: string;
  role: InstitutionRole;
}

export interface CurrentSession {
  user: UserProfile;
  memberships: Membership[];
}

export interface AuthenticationResult {
  user: UserProfile;
  token: string;
}
