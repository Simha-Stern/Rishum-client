import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
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
import { UiLink } from '../../../../shared/components/ui/ui-link';

@Component({
  selector: 'app-registration',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    UiButton,
    UiCheckbox,
    UiFormControl,
    UiHeading,
    UiLink,
  ],
  templateUrl: './registration.html',
})
export class Registration {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RegistrationFlowService);
  private readonly auth = inject(AuthService);
  private readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
  protected readonly user = this.auth.user;
  protected readonly registrationUrl = `/institutions/${this.institutionId}/register`;
  protected readonly form = new FormGroup<Record<string, FormControl<string | boolean>>>({});
  protected readonly registrationForm = signal<PublicRegistrationForm | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this.auth.isRestored()) this.loadRegistrationForm();
    });
  }

  protected loadRegistrationForm(): void {
    this.isLoading.set(true);
    this.message.set(null);
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
        this.isLoading.set(false);
      },
      error: () => {
        this.message.set('לא ניתן להציג את ההרשמה כרגע. נסו שוב בעוד רגע.');
        this.isLoading.set(false);
      },
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
