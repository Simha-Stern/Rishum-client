import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Institution } from '../models/institution';

export class InstitutionsService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Institution[]>('/api/institutions');
  }
}
