import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiDialog } from '../../../../shared/components/ui/ui-dialog';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';
import { RegistrationEditor } from '../registration-editor/registration-editor';
import {
  OpenRegistrationFlow,
  RegistrationFlowService,
} from '../../services/registration-flow.service';

@Component({
  selector: 'app-open-registrations',
  imports: [RegistrationEditor, UiButton, UiDialog, UiHeading],
  templateUrl: './open-registrations.html',
})
export class OpenRegistrations {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RegistrationFlowService);
  protected readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;

  protected readonly flows = signal<OpenRegistrationFlow[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isEditorOpen = signal(false);
  protected readonly selectedFlowId = signal<string | null>(null);
  protected readonly dialogTitle = computed(() =>
    this.selectedFlowId() ? 'עריכת תהליך הרשמה' : 'הוספת רישום',
  );

  constructor() {
    this.loadFlows();
  }

  protected openNew(): void {
    this.selectedFlowId.set(null);
    this.isEditorOpen.set(true);
  }

  protected openFlow(flowId: string): void {
    this.selectedFlowId.set(flowId);
    this.isEditorOpen.set(true);
  }

  protected loadFlows(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.service.listOpenFlows(this.institutionId).subscribe({
      next: (flows) => {
        this.flows.set(flows);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('לא ניתן לטעון את ההרשמות הפתוחות.');
        this.isLoading.set(false);
      },
    });
  }

  protected handleEditorChange(event: { flowId: string; published: boolean }): void {
    this.selectedFlowId.set(event.flowId);
    this.loadFlows();
  }

  protected formatCloseDate(value: string | null): string {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return 'לא הוגדר מועד סגירה';
    return new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium', timeStyle: 'short' }).format(
      date,
    );
  }
}
