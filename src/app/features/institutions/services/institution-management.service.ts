import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Institution } from '../models/institution';

export interface InstitutionAnalytics {
  institutionId: string;
  totalRegistrations: number;
  byStatus: Array<{ status: string; total: number }>;
}

export interface InstitutionTeamMember {
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'manager' | 'secretary';
  status: 'active' | 'pending';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InstitutionManagementService {
  private readonly http = inject(HttpClient);

  getAllForAdmin() {
    return this.http.get<Institution[]>('/api/admin/institutions');
  }

  create(input: Omit<Institution, 'id'> & { managerEmail: string; secretaryEmail: string }) {
    return this.http.post<Institution>('/api/admin/institutions', input);
  }

  update(institutionId: string, input: Omit<Institution, 'id'> & { managerEmail: string; secretaryEmail: string }) {
    return this.http.put<Institution>(`/api/admin/institutions/${institutionId}`, input);
  }

  delete(institutionId: string) {
    return this.http.delete<void>(`/api/admin/institutions/${institutionId}`);
  }

  assignMember(institutionId: string, email: string, role: 'manager' | 'secretary') {
    return this.http.put(`/api/admin/institutions/${institutionId}/members`, { email, role });
  }

  getTeam(institutionId: string) {
    return this.http.get<InstitutionTeamMember[]>(`/api/institutions/${institutionId}/members`);
  }

  inviteMember(institutionId: string, email: string, role: InstitutionTeamMember['role']) {
    return this.http.post(`/api/institutions/${institutionId}/members`, { email, role });
  }

  updateTeamMember(institutionId: string, email: string, role: InstitutionTeamMember['role']) {
    return this.http.put<void>(`/api/institutions/${institutionId}/members/${encodeURIComponent(email)}`, { role });
  }

  removeTeamMember(institutionId: string, email: string) {
    return this.http.delete<void>(`/api/institutions/${institutionId}/members/${encodeURIComponent(email)}`);
  }

  getAnalytics(institutionId: string) {
    return this.http.get<InstitutionAnalytics>(`/api/institutions/${institutionId}/analytics`);
  }
}
