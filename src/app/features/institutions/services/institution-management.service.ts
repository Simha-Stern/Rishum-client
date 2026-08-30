import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Institution } from '../models/institution';

export interface InstitutionAnalytics {
  institutionId: string;
  totalRegistrations: number;
  byStatus: Array<{ status: string; total: number }>;
}

@Injectable({ providedIn: 'root' })
export class InstitutionManagementService {
  private readonly http = inject(HttpClient);

  getAllForAdmin() {
    return this.http.get<Institution[]>('/api/admin/institutions');
  }

  create(input: Omit<Institution, 'id'>) {
    return this.http.post<Institution>('/api/admin/institutions', input);
  }

  assignMember(institutionId: string, email: string, role: 'manager' | 'secretary') {
    return this.http.put<void>(`/api/admin/institutions/${institutionId}/members`, { email, role });
  }

  getAnalytics(institutionId: string) {
    return this.http.get<InstitutionAnalytics>(`/api/institutions/${institutionId}/analytics`);
  }
}
