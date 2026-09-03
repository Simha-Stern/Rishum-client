import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appFormControl], textarea[appFormControl], select[appFormControl]',
  host: {
    class:
      'mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text transition-colors placeholder:text-text-muted hover:border-primary focus:border-primary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground',
  },
})
export class UiFormControl {}

@Directive({
  selector: 'input[type="checkbox"][appCheckbox]',
  host: {
    class: 'size-4 rounded border-border accent-primary',
  },
})
export class UiCheckbox {}
