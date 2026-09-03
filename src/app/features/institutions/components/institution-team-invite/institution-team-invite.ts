import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { concatMap, from } from 'rxjs';
import {
  InstitutionManagementService,
  InstitutionTeamMember,
} from '../../services/institution-management.service';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiDialog } from '../../../../shared/components/ui/ui-dialog';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';

@Component({
  selector: 'app-institution-team-invite',
  imports: [FormsModule, UiButton, UiDialog, UiFormControl],
  templateUrl: './institution-team-invite.html',
})
export class InstitutionTeamInvite {
  private readonly service = inject(InstitutionManagementService);

  readonly institutionId = input.required<string>();
  readonly inviteCompleted = output<number>();
  protected readonly isOpen = signal(false);
  protected readonly emailInputs = signal<string[]>(['']);
  protected readonly inviteRole = signal<InstitutionTeamMember['role']>('secretary');
  protected readonly isSubmitting = signal(false);
  protected readonly message = signal<string | null>(null);

  protected open(): void {
    this.message.set(null);
    this.isOpen.set(true);
  }

  protected addEmailInput(): void {
    this.emailInputs.update((emails) => [...emails, '']);
  }

  protected updateEmailInput(index: number, email: string): void {
    this.emailInputs.update((emails) =>
      emails.map((current, currentIndex) => (currentIndex === index ? email : current)),
    );
  }

  protected removeEmailInput(index: number): void {
    this.emailInputs.update((emails) =>
      emails.length === 1 ? [''] : emails.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  protected invite(): void {
    const emails = [
      ...new Set(
        this.emailInputs()
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
    const invalidEmail = emails.find((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (!emails.length || invalidEmail) {
      this.message.set('יש להזין לפחות כתובת אימייל תקינה אחת.');
      return;
    }

    this.isSubmitting.set(true);
    this.message.set(null);
    from(emails)
      .pipe(
        concatMap((email) =>
          this.service.inviteMember(this.institutionId(), email, this.inviteRole()),
        ),
      )
      .subscribe({
        complete: () => {
          this.emailInputs.set(['']);
          this.isSubmitting.set(false);
          this.isOpen.set(false);
          this.inviteCompleted.emit(emails.length);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting.set(false);
          this.message.set(error.error?.message ?? 'לא ניתן היה לשלוח את ההזמנות. נסו שוב.');
        },
      });
  }
}
