import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  template: `
    <label class="block text-sm font-medium text-text">
      <span>{{ label() }}</span>
      <ng-content />
    </label>
    @if (helpText()) {
      <p [id]="helpId()" class="mt-1 text-sm text-text-muted">{{ helpText() }}</p>
    }
  `,
})
export class UiFormField {
  readonly label = input.required<string>();
  readonly helpText = input<string | null>(null);
  readonly helpId = input<string | null>(null);
}
