import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegistrationFieldInput, RegistrationFlowService } from '../../services/registration-flow.service';

@Component({
  selector: 'app-registration-editor',
  imports: [FormsModule],
  templateUrl: './registration-editor.html',
})
export class RegistrationEditor {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RegistrationFlowService);
  private readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
  protected readonly name = signal('טופס הרשמה');
  protected readonly fields = signal<RegistrationFieldInput[]>([]);
  protected readonly version = signal<number | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly newField = signal<RegistrationFieldInput>({ key: '', label: '', type: 'text', required: false, options: [], profileKey: null });

  constructor() {
    this.service.getEditorFlow(this.institutionId).subscribe({
      next: ({ flow, version, fields }) => {
        this.name.set(flow.name);
        this.version.set(version?.version ?? null);
        this.fields.set(fields.map(({ id: _id, sortOrder: _sortOrder, ...field }) => field));
      },
      error: () => this.message.set('לא ניתן לטעון את תהליך ההרשמה.'),
    });
  }

  protected addField(): void {
    const field = this.newField();
    if (!field.key.trim() || !field.label.trim() || this.fields().some((current) => current.key === field.key.trim())) {
      this.message.set('יש להזין מזהה ושם שדה ייחודיים.');
      return;
    }
    this.fields.update((fields) => [...fields, { ...field, key: field.key.trim(), label: field.label.trim() }]);
    this.newField.set({ key: '', label: '', type: 'text', required: false, options: [], profileKey: null });
    this.message.set(null);
  }

  protected removeField(key: string): void {
    this.fields.update((fields) => fields.filter((field) => field.key !== key));
  }

  protected saveDraft(): void {
    this.service.saveDraft(this.institutionId, { name: this.name(), fields: this.fields() }).subscribe({
      next: (version) => {
        this.version.set(version.version);
        this.message.set(`טיוטה גרסה ${version.version} נשמרה.`);
      },
      error: (error: { error?: { message?: string } }) => this.message.set(error.error?.message ?? 'שמירת הטיוטה נכשלה.'),
    });
  }

  protected publish(): void {
    const version = this.version();
    if (!version) {
      this.message.set('יש לשמור טיוטה לפני פרסום.');
      return;
    }
    this.service.publish(this.institutionId, version).subscribe({
      next: () => this.message.set(`גרסה ${version} פורסמה להרשמה.`),
      error: () => this.message.set('הפרסום נכשל.'),
    });
  }
}
