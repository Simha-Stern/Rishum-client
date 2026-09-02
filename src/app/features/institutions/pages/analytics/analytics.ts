import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstitutionAnalytics, InstitutionManagementService } from '../../services/institution-management.service';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { UiLink } from '../../../../shared/components/ui/ui-link';

@Component({
  selector: 'app-analytics',
  imports: [UiHeading, UiLink],
  templateUrl: './analytics.html',
})
export class Analytics {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(InstitutionManagementService);
  protected readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
  protected readonly analytics = signal<InstitutionAnalytics | null>(null);
  protected readonly hasError = signal(false);

  constructor() {
    if (this.institutionId) this.service.getAnalytics(this.institutionId).subscribe({
      next: (analytics) => this.analytics.set(analytics),
      error: () => this.hasError.set(true),
    });
  }
}
