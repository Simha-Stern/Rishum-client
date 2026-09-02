import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Institution } from '../../models/institution';
import { InstitutionManagementService } from '../../services/institution-management.service';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';

@Component({
  selector: 'app-admin-institutions',
  imports: [ReactiveFormsModule, UiButton, UiFormControl, UiFormField, UiHeading],
  templateUrl: './admin-institutions.html',
})
export class AdminInstitutions {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(InstitutionManagementService);
  protected readonly institutions = signal<Institution[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly editingInstitutionId = signal<string | null>(null);
  protected readonly deletingInstitution = signal<Institution | null>(null);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    logoUrl: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    managerEmail: ['', [Validators.required, Validators.email]],
    secretaryEmail: ['', Validators.email],
  });
  protected readonly editForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    logoUrl: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    managerEmail: ['', Validators.email],
    secretaryEmail: ['', Validators.email],
  });

  constructor() {
    this.service.getAllForAdmin().subscribe({ next: (institutions) => this.institutions.set(institutions) });
  }

  protected create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.create(this.form.getRawValue()).subscribe({
      next: (institution) => {
        this.institutions.update((items) => [...items, institution]);
        this.form.reset({ name: '', logoUrl: '', address: '', city: '', managerEmail: '', secretaryEmail: '' });
        this.message.set('המוסד נוצר והמנהל קיבל גישה, או שממתינה לו הזמנה לפתיחת חשבון.');
      },
      error: (error: { error?: { message?: string } }) => this.message.set(error.error?.message ?? 'לא ניתן היה ליצור את המוסד.'),
    });
  }

  protected startEdit(institution: Institution): void {
    this.editingInstitutionId.set(institution.id);
    this.editForm.setValue({
      name: institution.name,
      logoUrl: institution.logoUrl,
      address: institution.address,
      city: institution.city,
      managerEmail: '',
      secretaryEmail: '',
    });
    this.message.set(null);
  }

  protected cancelEdit(): void {
    this.editingInstitutionId.set(null);
    this.editForm.reset({ name: '', logoUrl: '', address: '', city: '', managerEmail: '', secretaryEmail: '' });
  }

  protected saveEdit(institutionId: string): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.service.update(institutionId, this.editForm.getRawValue()).subscribe({
      next: (updatedInstitution) => {
        this.institutions.update((institutions) => institutions.map((institution) => institution.id === institutionId ? updatedInstitution : institution));
        this.cancelEdit();
        this.message.set('פרטי המוסד עודכנו.');
      },
      error: (error: { error?: { message?: string } }) => this.message.set(error.error?.message ?? 'לא ניתן היה לעדכן את המוסד.'),
    });
  }

  protected requestDelete(institution: Institution): void {
    this.deletingInstitution.set(institution);
  }

  protected cancelDelete(): void {
    this.deletingInstitution.set(null);
  }

  protected confirmDelete(): void {
    const institution = this.deletingInstitution();
    if (!institution) return;
    this.service.delete(institution.id).subscribe({
      next: () => {
        this.institutions.update((institutions) => institutions.filter((item) => item.id !== institution.id));
        this.deletingInstitution.set(null);
        this.message.set('המוסד נמחק.');
      },
      error: (error: { error?: { message?: string } }) => this.message.set(error.error?.message ?? 'לא ניתן היה למחוק את המוסד.'),
    });
  }
}
