import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface RegistrationField {
  id: string;
  catalogFieldId: string | null;
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  profileKey: 'firstName' | 'lastName' | 'phone' | 'idNumber' | null;
  sortOrder: number;
}

export interface RegistrationFieldCatalogEntry {
  id: string;
  key: string;
  label: string;
  type: string;
  options: string[];
  profileKey: 'firstName' | 'lastName' | 'phone' | 'idNumber' | null;
}

export interface RegistrationFlow {
  flow: {
    id: string;
    name: string;
    status: 'draft' | 'published' | 'closed';
    publishedVersion: number | null;
    closesAt: string | null;
  };
  version: { id: string; version: number } | null;
  fields: RegistrationField[];
}

export interface OpenRegistrationFlow {
  id: string;
  name: string;
  closesAt: string;
  publishedVersion: number;
  updatedAt: string;
}

export interface SavedRegistrationFlow {
  flow: { id: string; name: string };
  version: number;
}

export interface PublicRegistrationForm {
  institutionId: string;
  flow: { name: string; version: number; closesAt: string };
  fields: RegistrationField[];
}

export interface RegistrationFieldSelection {
  catalogFieldId: string;
  required: boolean;
}

export interface RegistrationFieldCatalogInput {
  key: string;
  label: string;
  type: string;
  options: string[];
  profileKey: RegistrationFieldCatalogEntry['profileKey'];
}

@Injectable({ providedIn: 'root' })
export class RegistrationFlowService {
  private readonly http = inject(HttpClient);

  getEditorFlow(institutionId: string, flowId: string) {
    return this.http.get<RegistrationFlow>(
      `/api/institutions/${institutionId}/registration-flows/${flowId}`,
    );
  }

  getAvailableFields(institutionId: string) {
    return this.http.get<RegistrationFieldCatalogEntry[]>(
      `/api/institutions/${institutionId}/registration-fields`,
    );
  }

  listOpenFlows(institutionId: string) {
    return this.http.get<OpenRegistrationFlow[]>(
      `/api/institutions/${institutionId}/registration-flows/open`,
    );
  }

  saveDraft(
    institutionId: string,
    flowId: string | null,
    input: { name: string; selectedFields: RegistrationFieldSelection[] },
  ) {
    const url = `/api/institutions/${institutionId}/registration-flows`;
    return flowId
      ? this.http.put<SavedRegistrationFlow>(`${url}/${flowId}`, input)
      : this.http.post<SavedRegistrationFlow>(url, input);
  }

  getCatalogForAdmin() {
    return this.http.get<RegistrationFieldCatalogEntry[]>('/api/admin/registration-field-catalog');
  }

  createCatalogEntry(input: RegistrationFieldCatalogInput) {
    return this.http.post<RegistrationFieldCatalogEntry>(
      '/api/admin/registration-field-catalog',
      input,
    );
  }

  publish(institutionId: string, flowId: string, version: number, closesAt: string) {
    return this.http.post<void>(
      `/api/institutions/${institutionId}/registration-flows/${flowId}/publish`,
      { version, closesAt },
    );
  }

  close(institutionId: string, flowId: string) {
    return this.http.post<void>(
      `/api/institutions/${institutionId}/registration-flows/${flowId}/close`,
      {},
    );
  }

  getPublicForm(institutionId: string) {
    return this.http.get<PublicRegistrationForm>(
      `/api/public/institutions/${institutionId}/registration-form`,
    );
  }

  submitRegistration(institutionId: string, answers: Record<string, unknown>) {
    return this.http.post(`/api/public/institutions/${institutionId}/registrations`, { answers });
  }
}
