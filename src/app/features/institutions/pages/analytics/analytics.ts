import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstitutionAnalytics, InstitutionManagementService } from '../../services/institution-management.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.html',
})
export class Analytics {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(InstitutionManagementService);
  protected readonly analytics = signal<InstitutionAnalytics | null>(null);
  protected readonly hasError = signal(false);

  constructor() {
    const institutionId = this.route.snapshot.paramMap.get('institutionId');
    if (institutionId) this.service.getAnalytics(institutionId).subscribe({
      next: (analytics) => this.analytics.set(analytics),
      error: () => this.hasError.set(true),
    });
  }
}
