import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="classes()"
      [type]="buttonType()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-busy]="busy() || null"
      (click)="pressed.emit($event)"
    >
      {{ text() }}
    </button>
  `,
})
export class UiButton {
  readonly text = input.required<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly buttonType = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input(false);
  readonly busy = input(false);
  readonly fullWidth = input(false);
  readonly pressed = output<MouseEvent>();

  protected readonly classes = computed(() => {
    const base =
      'inline-flex min-h-11 items-center justify-center rounded-lg px-4 font-medium transition-colors disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground';
    const size = {
      small: 'py-1.5 text-sm',
      medium: 'py-2',
      large: 'px-5 py-2.5',
    }[this.size()];
    const variant = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      destructive: 'bg-danger text-danger-foreground hover:bg-danger-hover',
      text: 'px-0 py-1 text-primary-foreground underline hover:text-text',
    }[this.variant()];

    return `${base} ${size} ${variant}${this.fullWidth() ? ' w-full' : ''}`;
  });
}
