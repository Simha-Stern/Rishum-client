import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  InstitutionManagementService,
  InstitutionTeamMember,
} from '../../services/institution-management.service';
import { InstitutionTeamInvite } from '../../components/institution-team-invite/institution-team-invite';
import { UiButton } from '../../../../shared/components/ui/ui-button';
import { UiFormControl } from '../../../../shared/components/ui/ui-form-control.directive';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';

@Component({
  selector: 'app-institution-management',
  imports: [FormsModule, InstitutionTeamInvite, UiButton, UiFormControl, UiHeading],
  templateUrl: './institution-management.html',
})
export class InstitutionManagement {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(InstitutionManagementService);
  protected readonly institutionId = this.route.snapshot.paramMap.get('institutionId')!;

  protected readonly team = signal<InstitutionTeamMember[]>([]);
  protected readonly editingMember = signal<InstitutionTeamMember | null>(null);
  protected readonly editedRole = signal<InstitutionTeamMember['role']>('secretary');
  protected readonly memberToRemove = signal<InstitutionTeamMember | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly message = signal<string | null>(null);
  protected readonly activeManagerCount = computed(
    () =>
      this.team().filter((member) => member.status === 'active' && member.role === 'manager')
        .length,
  );

  constructor() {
    this.loadTeam();
  }

  protected onInviteCompleted(invitationCount: number): void {
    this.message.set(
      invitationCount === 1
        ? 'ההזמנה נוספה והגישה עודכנה.'
        : `${invitationCount} הזמנות נוספו והגישות עודכנו.`,
    );
    this.loadTeam();
  }

  protected startEdit(member: InstitutionTeamMember): void {
    this.editingMember.set(member);
    this.editedRole.set(member.role);
    this.message.set(null);
  }

  protected cancelEdit(): void {
    this.editingMember.set(null);
  }

  protected saveMember(): void {
    const member = this.editingMember();
    if (!member) return;
    this.isSubmitting.set(true);
    this.service.updateTeamMember(this.institutionId, member.email, this.editedRole()).subscribe({
      next: () => {
        this.editingMember.set(null);
        this.isSubmitting.set(false);
        this.message.set('תפקיד חבר/ת הצוות עודכן.');
        this.loadTeam();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting.set(false);
        this.message.set(error.error?.message ?? 'לא ניתן לעדכן את חבר/ת הצוות.');
      },
    });
  }

  protected requestRemove(member: InstitutionTeamMember): void {
    if (!this.canRemove(member)) return;
    this.memberToRemove.set(member);
    this.message.set(null);
  }

  protected cancelRemove(): void {
    this.memberToRemove.set(null);
  }

  protected confirmRemove(): void {
    const member = this.memberToRemove();
    if (!member) return;
    this.isSubmitting.set(true);
    this.service.removeTeamMember(this.institutionId, member.email).subscribe({
      next: () => {
        this.memberToRemove.set(null);
        this.isSubmitting.set(false);
        this.message.set('חבר/ת הצוות הוסר/ה.');
        this.loadTeam();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting.set(false);
        this.message.set(error.error?.message ?? 'לא ניתן להסיר את חבר/ת הצוות.');
      },
    });
  }

  protected canRemove(member: InstitutionTeamMember): boolean {
    return member.status !== 'active' || member.role !== 'manager' || this.activeManagerCount() > 1;
  }

  protected canChangeToSecretary(member: InstitutionTeamMember): boolean {
    return member.status !== 'active' || member.role !== 'manager' || this.activeManagerCount() > 1;
  }

  protected loadTeam(): void {
    this.isLoading.set(true);
    this.service.getTeam(this.institutionId).subscribe({
      next: (team) => {
        this.team.set(team);
        this.isLoading.set(false);
      },
      error: () => {
        this.message.set('לא ניתן היה לטעון את צוות המוסד.');
        this.isLoading.set(false);
      },
    });
  }
}
