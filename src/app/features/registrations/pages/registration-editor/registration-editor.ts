import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiCheckbox, UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { ActivatedRoute } from '@angular/router';
import { RegistrationFieldInput, RegistrationFlowService } from '../../services/registration-flow.service';

type EditorField = RegistrationFieldInput & { optionsText: string };

const toDateTimeInputValue = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  const twoDigits = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}T${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
};

@Component({
  selector: 'app-registration-editor',
  imports: [FormsModule, UiButton, UiCheckbox, UiFormControl, UiFormField, UiHeading],
  templateUrl: './registration-editor.html',
})
export class RegistrationEditor {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RegistrationFlowService);
  private readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;
  protected readonly name = signal('טופס הרשמה');
  protected readonly fields = signal<RegistrationFieldInput[]>([]);
  protected readonly version = signal<number | null>(null);
  protected readonly status = signal<'draft' | 'published' | 'closed'>('draft');
  protected readonly closesAt = signal('');
  protected readonly message = signal<string | null>(null);
  protected readonly newField = signal<EditorField>({ key: '', label: '', type: 'text', required: false, options: [], optionsText: '', profileKey: null });

  constructor() {
    this.service.getEditorFlow(this.institutionId).subscribe({
      next: ({ flow, version, fields }) => {
        this.name.set(flow.name);
        this.version.set(version?.version ?? null);
        this.status.set(flow.status);
        this.closesAt.set(toDateTimeInputValue(flow.closesAt));
        this.fields.set(fields.map(({ id: _id, sortOrder: _sortOrder, ...field }) => field));
      },
      error: () => this.message.set('לא ניתן לטעון את תהליך ההרשמה.'),
    });
  }

  protected addField(): void {
    const field = this.newField();
    const options = field.type === 'select'
      ? [...new Set(field.optionsText.split(',').map((option) => option.trim()).filter(Boolean))]
      : [];
    if (!field.key.trim() || !field.label.trim() || (field.type === 'select' && !options.length) || this.fields().some((current) => current.key === field.key.trim())) {
      this.message.set('יש להזין מזהה ושם שדה ייחודיים.');
      return;
    }
    this.fields.update((fields) => [...fields, { key: field.key.trim(), label: field.label.trim(), type: field.type, required: field.required, options, profileKey: field.profileKey }]);
    this.newField.set({ key: '', label: '', type: 'text', required: false, options: [], optionsText: '', profileKey: null });
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
    const closesAt = this.closesAt();
    if (!version || !closesAt || new Date(closesAt) <= new Date()) {
      this.message.set('יש לשמור טיוטה ולהגדיר תאריך סגירה עתידי לפני פרסום.');
      return;
    }
    this.service.publish(this.institutionId, version, new Date(closesAt).toISOString()).subscribe({
      next: () => {
        this.status.set('published');
        this.message.set(`גרסה ${version} פורסמה להרשמה עד ${new Date(closesAt).toLocaleString('he-IL')}.`);
      },
      error: () => this.message.set('הפרסום נכשל.'),
    });
  }

  protected close(): void {
    this.service.close(this.institutionId).subscribe({
      next: () => {
        this.status.set('closed');
        this.message.set('ההרשמה נסגרה לכלל הציבור.');
      },
      error: () => this.message.set('סגירת ההרשמה נכשלה.'),
    });
  }
}
