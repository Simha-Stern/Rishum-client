import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {
  PublicRegistrationForm,
  RegistrationFlowService,
} from '../../services/registration-flow.service';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import {
  UiCheckbox,
  UiFormControl,
} from '../../../../shared/components/ui/ui-form-control.directive';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';

@Component({
  selector: 'app-registration',
  imports: [DatePipe, ReactiveFormsModule, UiButton, UiCheckbox, UiFormControl, UiHeading],
  templateUrl: './registration.html',
})
export class Registration {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RegistrationFlowService);
  private readonly auth = inject(AuthService);
  private readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
  protected readonly form = new FormGroup<Record<string, FormControl<string | boolean>>>({});
  protected readonly registrationForm = signal<PublicRegistrationForm | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.service.getPublicForm(this.institutionId).subscribe({
      next: (registrationForm) => {
        const profile = this.auth.user();
        for (const field of registrationForm.fields) {
          const initialValue =
            field.type === 'checkbox'
              ? false
              : field.profileKey && profile
                ? String(profile[field.profileKey] ?? '')
                : '';
          this.form.addControl(
            field.key,
            new FormControl(initialValue, {
              nonNullable: true,
              validators: field.required
                ? [field.type === 'checkbox' ? Validators.requiredTrue : Validators.required]
                : [],
            }),
          );
        }
        this.registrationForm.set(registrationForm);
      },
      error: () => this.message.set('ההרשמה למוסד זה אינה פתוחה כעת.'),
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.service.submitRegistration(this.institutionId, this.form.getRawValue()).subscribe({
      next: () => {
        this.message.set('ההרשמה נשלחה בהצלחה.');
        this.isSubmitting.set(false);
      },
      error: (error: { error?: { message?: string } }) => {
        this.message.set(error.error?.message ?? 'שליחת ההרשמה נכשלה.');
        this.isSubmitting.set(false);
      },
    });
  }
}
