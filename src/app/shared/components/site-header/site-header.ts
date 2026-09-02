import { Component, inject } from '@angular/core';
import { UiLink } from '../ui/ui-link';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-site-header',
  imports: [UiLink],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly auth = inject(AuthService);
}
