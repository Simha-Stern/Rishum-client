import { Component, inject, signal } from '@angular/core';
import { InstitutionCard } from '../../components/institution-card/institution-card';
import { Institution } from '../../models/institution';
import { InstitutionsService } from '../../services/institutions.service';

@Component({
  selector: 'app-home',
  imports: [InstitutionCard],
  providers: [InstitutionsService],
  templateUrl: './home.html',
})
export class Home {
  private readonly institutionsService = inject(InstitutionsService);

  protected readonly institutions = signal<Institution[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);

  constructor() {
    this.loadInstitutions();
  }

  protected loadInstitutions(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.institutionsService.getAll().subscribe({
      next: (institutions) => {
        this.institutions.set(institutions);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
