import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-personal-area-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './personal-area-sidebar.html',
  host: {
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class PersonalAreaSidebar {
  protected readonly auth = inject(AuthService);
  readonly open = input(false);
  readonly closed = output<void>();
  protected readonly memberships = computed(() => this.auth.session()?.memberships ?? []);

  protected close(): void {
    this.closed.emit();
  }

  protected closeOnEscape(): void {
    if (this.open()) this.close();
  }
}
