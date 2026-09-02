import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { UiLink } from '../../../../shared/components/ui/ui-link';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, UiButton, UiFormControl, UiFormField, UiHeading, UiLink],
  templateUrl: './account.html',
})
export class Account {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly isSaving = signal(false);
  protected readonly saved = signal(false);
  protected readonly memberships = computed(() => this.auth.session()?.memberships ?? []);
  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.auth.user()?.firstName ?? '', Validators.required],
    lastName: [this.auth.user()?.lastName ?? '', Validators.required],
    phone: [this.auth.user()?.phone ?? ''],
    idNumber: [this.auth.user()?.idNumber ?? ''],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.auth.updateProfile(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saved.set(true);
      },
      error: () => this.isSaving.set(false),
    });
  }

  protected logout(): void {
    this.auth.logout().subscribe(() => void this.router.navigateByUrl('/'));
  }
}
