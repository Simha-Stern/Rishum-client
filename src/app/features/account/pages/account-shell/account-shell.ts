import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersonalAreaSidebar } from '../../components/personal-area-sidebar/personal-area-sidebar';

@Component({
  selector: 'app-account-shell',
  imports: [RouterOutlet, PersonalAreaSidebar],
  templateUrl: './account-shell.html',
})
export class AccountShell {
  protected readonly isSidebarOpen = signal(false);
}
