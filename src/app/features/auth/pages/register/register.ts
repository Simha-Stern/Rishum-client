import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getSafeReturnUrl } from '../../utils/return-url';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { UiLink } from '../../../../shared/components/ui/ui-link';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, UiButton, UiFormControl, UiFormField, UiHeading, UiLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly returnUrl = getSafeReturnUrl(this.route);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    idNumber: [''],
    password: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error.error?.message ?? 'לא ניתן היה ליצור חשבון. נסו שוב.');
        this.isSubmitting.set(false);
      },
    });
  }
}
