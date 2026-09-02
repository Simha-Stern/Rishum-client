import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface RegistrationField {
  id: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  profileKey: 'firstName' | 'lastName' | 'phone' | 'idNumber' | null;
  sortOrder: number;
}

export interface RegistrationFlow {
  flow: { name: string; status: 'draft' | 'published' | 'closed'; publishedVersion: number | null; closesAt: string | null };
  version: { id: string; version: number } | null;
  fields: RegistrationField[];
}

export interface PublicRegistrationForm {
  institutionId: string;
  flow: { name: string; version: number; closesAt: string };
  fields: RegistrationField[];
}

export type RegistrationFieldInput = Omit<RegistrationField, 'id' | 'sortOrder'>;

@Injectable({ providedIn: 'root' })
export class RegistrationFlowService {
  private readonly http = inject(HttpClient);

  getEditorFlow(institutionId: string) {
    return this.http.get<RegistrationFlow>(`/api/institutions/${institutionId}/registration-flow`);
  }

  saveDraft(institutionId: string, input: { name: string; fields: RegistrationFieldInput[] }) {
    return this.http.put<{ id: string; version: number }>(`/api/institutions/${institutionId}/registration-flow`, input);
  }

  publish(institutionId: string, version: number, closesAt: string) {
    return this.http.post<void>(`/api/institutions/${institutionId}/registration-flow/publish`, { version, closesAt });
  }

  close(institutionId: string) {
    return this.http.post<void>(`/api/institutions/${institutionId}/registration-flow/close`, {});
  }

  getPublicForm(institutionId: string) {
    return this.http.get<PublicRegistrationForm>(`/api/public/institutions/${institutionId}/registration-form`);
  }

  submitRegistration(institutionId: string, answers: Record<string, unknown>) {
    return this.http.post(`/api/public/institutions/${institutionId}/registrations`, { answers });
  }
}
