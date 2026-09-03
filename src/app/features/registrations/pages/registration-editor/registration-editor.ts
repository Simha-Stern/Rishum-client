import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import {
  UiCheckbox,
  UiFormControl,
} from '../../../../shared/components/ui/ui-form-control.directive';
import { UiFormField } from '../../../../shared/components/ui/ui-form-field';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import {
  RegistrationFieldCatalogEntry,
  RegistrationFieldSelection,
  RegistrationFlowService,
} from '../../services/registration-flow.service';

const toDateTimeInputValue = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  const twoDigits = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}T${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
};

const fieldTypeLabels: Record<string, string> = {
  text: 'טקסט',
  email: 'דואר אלקטרוני',
  tel: 'טלפון',
  number: 'מספר',
  date: 'תאריך',
  textarea: 'טקסט ארוך',
  select: 'רשימת בחירה',
  checkbox: 'אישור',
};

@Component({
  selector: 'app-registration-editor',
  imports: [FormsModule, UiButton, UiCheckbox, UiFormControl, UiFormField, UiHeading],
  templateUrl: './registration-editor.html',
})
export class RegistrationEditor {
  private readonly service = inject(RegistrationFlowService);

  readonly institutionId = input.required<string>();
  readonly flowId = input<string | null>(null);
  readonly changed = output<{ flowId: string; published: boolean }>();

  protected readonly name = signal('טופס הרשמה');
  protected readonly catalogFields = signal<RegistrationFieldCatalogEntry[]>([]);
  protected readonly selectedFields = signal<RegistrationFieldSelection[]>([]);
  protected readonly version = signal<number | null>(null);
  protected readonly status = signal<'draft' | 'published' | 'closed'>('draft');
  protected readonly closesAt = signal('');
  protected readonly message = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isPublishing = signal(false);
  private readonly savedFlowId = signal<string | null>(null);
  protected readonly selectedFieldCount = computed(() => this.selectedFields().length);

  constructor() {
    effect(() => {
      const institutionId = this.institutionId();
      const flowId = this.flowId();
      this.savedFlowId.set(flowId);
      this.name.set('טופס הרשמה');
      this.selectedFields.set([]);
      this.version.set(null);
      this.status.set('draft');
      this.closesAt.set('');
      this.message.set(null);
      this.isLoading.set(true);

      if (!flowId) {
        this.service.getAvailableFields(institutionId).subscribe({
          next: (catalogFields) => {
            this.catalogFields.set(catalogFields);
            this.isLoading.set(false);
          },
          error: () => {
            this.message.set('לא ניתן לטעון את מאגר השדות.');
            this.isLoading.set(false);
          },
        });
        return;
      }

      this.service
        .getEditorFlow(institutionId, flowId)
        .pipe(
          switchMap(({ flow, version, fields }) =>
            this.service
              .getAvailableFields(institutionId)
              .pipe(map((catalogFields) => ({ flow, version, fields, catalogFields }))),
          ),
        )
        .subscribe({
          next: ({ flow, version, fields, catalogFields }) => {
            this.name.set(flow.name);
            this.version.set(version?.version ?? null);
            this.status.set(flow.status);
            this.closesAt.set(toDateTimeInputValue(flow.closesAt));
            this.catalogFields.set(catalogFields);
            this.selectedFields.set(
              fields.flatMap((field) =>
                field.catalogFieldId
                  ? [{ catalogFieldId: field.catalogFieldId, required: field.required }]
                  : [],
              ),
            );
            if (fields.some((field) => !field.catalogFieldId))
              this.message.set('יש לבחור מחדש את השדות שהיו בטופס הישן לפני השמירה.');
            this.isLoading.set(false);
          },
          error: () => {
            this.message.set('לא ניתן לטעון את תהליך ההרשמה.');
            this.isLoading.set(false);
          },
        });
    });
  }

  protected isSelected(catalogFieldId: string): boolean {
    return this.selectedFields().some((field) => field.catalogFieldId === catalogFieldId);
  }

  protected setSelected(catalogFieldId: string, selected: boolean): void {
    if (selected) {
      this.selectedFields.update((fields) => [...fields, { catalogFieldId, required: false }]);
      return;
    }
    this.selectedFields.update((fields) =>
      fields.filter((field) => field.catalogFieldId !== catalogFieldId),
    );
  }

  protected setRequired(catalogFieldId: string, required: boolean): void {
    this.selectedFields.update((fields) =>
      fields.map((field) =>
        field.catalogFieldId === catalogFieldId ? { ...field, required } : field,
      ),
    );
  }

  protected isRequired(catalogFieldId: string): boolean {
    return (
      this.selectedFields().find((field) => field.catalogFieldId === catalogFieldId)?.required ??
      false
    );
  }

  protected fieldTypeLabel(type: string): string {
    return fieldTypeLabels[type] ?? type;
  }

  protected saveDraft(): void {
    if (!this.selectedFieldCount()) {
      this.message.set('יש לבחור לפחות שדה אחד להרשמה.');
      return;
    }
    this.service
      .saveDraft(this.institutionId(), this.savedFlowId(), {
        name: this.name(),
        selectedFields: this.selectedFields(),
      })
      .subscribe({
        next: ({ flow, version }) => {
          this.savedFlowId.set(flow.id);
          this.version.set(version);
          this.changed.emit({ flowId: flow.id, published: false });
          this.message.set(`טיוטה גרסה ${version} נשמרה.`);
        },
        error: (error: { error?: { message?: string } }) =>
          this.message.set(error.error?.message ?? 'שמירת הטיוטה נכשלה.'),
      });
  }

  protected publish(): void {
    const closesAt = this.closesAt();
    if (!this.selectedFieldCount()) {
      this.message.set('יש לבחור לפחות שדה אחד להרשמה.');
      return;
    }
    if (!closesAt || new Date(closesAt) <= new Date()) {
      this.message.set('יש להגדיר תאריך סגירה עתידי לפני פרסום.');
      return;
    }
    this.isPublishing.set(true);
    this.service
      .saveDraft(this.institutionId(), this.savedFlowId(), {
        name: this.name(),
        selectedFields: this.selectedFields(),
      })
      .pipe(
        switchMap(({ flow, version }) =>
          this.service
            .publish(this.institutionId(), flow.id, version, new Date(closesAt).toISOString())
            .pipe(map(() => ({ flow, version }))),
        ),
      )
      .subscribe({
        next: ({ flow, version }) => {
          this.savedFlowId.set(flow.id);
          this.version.set(version);
          this.status.set('published');
          this.isPublishing.set(false);
          this.changed.emit({ flowId: flow.id, published: true });
          this.message.set(
            `גרסה ${version} פורסמה להרשמה עד ${new Date(closesAt).toLocaleString('he-IL')}.`,
          );
        },
        error: (error: { error?: { message?: string } }) => {
          this.isPublishing.set(false);
          this.message.set(error.error?.message ?? 'הפרסום נכשל.');
        },
      });
  }

  protected close(): void {
    const flowId = this.savedFlowId();
    if (!flowId) return;
    this.service.close(this.institutionId(), flowId).subscribe({
      next: () => {
        this.status.set('closed');
        this.changed.emit({ flowId, published: false });
        this.message.set('ההרשמה נסגרה לכלל הציבור.');
      },
      error: () => this.message.set('סגירת ההרשמה נכשלה.'),
    });
  }
}
