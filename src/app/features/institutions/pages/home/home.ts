import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { InstitutionCard } from '../../components/institution-card/institution-card';
import { Institution } from '../../models/institution';
import { InstitutionsService } from '../../services/institutions.service';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { UiLink } from '../../../../shared/components/ui/ui-link';

@Component({
  selector: 'app-home',
  imports: [InstitutionCard, RouterLink, UiButton, UiHeading, UiLink],
  providers: [InstitutionsService],
  templateUrl: './home.html',
})
export class Home {
  private readonly institutionsService = inject(InstitutionsService);
  protected readonly auth = inject(AuthService);

  protected readonly institutions = signal<Institution[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly workspaces = computed(() => {
    const memberships = this.auth.session()?.memberships ?? [];
    return memberships.flatMap((membership) => {
      const institution = this.institutions().find((item) => item.id === membership.institutionId);
      return institution ? [{ institution, role: membership.role }] : [];
    });
  });

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
