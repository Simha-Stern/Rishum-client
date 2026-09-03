import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import {
  RegistrationFieldCatalogEntry,
  RegistrationFlowService,
} from '../../services/registration-flow.service';

type ProfileKeyFormValue = NonNullable<RegistrationFieldCatalogEntry['profileKey']> | '';

@Component({
  selector: 'app-registration-field-catalog',
  imports: [ReactiveFormsModule, UiButton, UiFormControl, UiFormField, UiHeading],
  templateUrl: './registration-field-catalog.html',
})
export class RegistrationFieldCatalog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(RegistrationFlowService);

  protected readonly fields = signal<RegistrationFieldCatalogEntry[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly form = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]],
    label: ['', Validators.required],
    type: ['text', Validators.required],
    optionsText: [''],
    profileKey: this.formBuilder.nonNullable.control<ProfileKeyFormValue>(''),
  });

  constructor() {
    this.service.getCatalogForAdmin().subscribe({
      next: (fields) => this.fields.set(fields),
      error: () => this.message.set('לא ניתן לטעון את מאגר השדות.'),
    });
  }

  protected create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const options =
      value.type === 'select'
        ? [
            ...new Set(
              value.optionsText
                .split(',')
                .map((option) => option.trim())
                .filter(Boolean),
            ),
          ]
        : [];
    if (value.type === 'select' && !options.length) {
      this.message.set('יש להזין לפחות אפשרות בחירה אחת.');
      return;
    }

    this.service
      .createCatalogEntry({
        key: value.key.trim(),
        label: value.label.trim(),
        type: value.type,
        options,
        profileKey: value.profileKey || null,
      })
      .subscribe({
        next: (field) => {
          this.fields.update((fields) =>
            [...fields, field].sort((left, right) => left.label.localeCompare(right.label, 'he')),
          );
          this.form.reset({ key: '', label: '', type: 'text', optionsText: '', profileKey: '' });
          this.message.set('השדה נוסף למאגר וזמין למזכירים ביצירת טפסי הרשמה.');
        },
        error: (error: { error?: { message?: string } }) =>
          this.message.set(error.error?.message ?? 'לא ניתן להוסיף את השדה.'),
      });
  }
}
