import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Institution } from '../../models/institution';
import { InstitutionManagementService } from '../../services/institution-management.service';

@Component({
  selector: 'app-admin-institutions',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-institutions.html',
})
export class AdminInstitutions {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(InstitutionManagementService);
  protected readonly institutions = signal<Institution[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    logoUrl: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
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
        this.form.reset({ name: '', logoUrl: '', address: '', city: '' });
        this.message.set('המוסד נוצר. כעת אפשר לשייך לו מנהל או מזכיר דרך ה־API.');
      },
      error: (error: { error?: { message?: string } }) => this.message.set(error.error?.message ?? 'לא ניתן היה ליצור את המוסד.'),
    });
  }
}
