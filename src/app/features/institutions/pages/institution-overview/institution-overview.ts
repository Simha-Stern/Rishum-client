import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';

@Component({
  selector: 'app-institution-overview',
  imports: [RouterLink, UiHeading],
  templateUrl: './institution-overview.html',
})
export class InstitutionOverview {
  private readonly route = inject(ActivatedRoute);
  protected readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
}
