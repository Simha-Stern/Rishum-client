import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-end bg-text/30 p-4 sm:items-center sm:justify-center"
        (click)="close()"
      >
        <section
          #dialog
          class="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId()"
          [attr.aria-describedby]="description() ? descriptionId() : null"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown.tab)="trapFocus($event)"
        >
          <header
            class="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6"
          >
            <div>
              <h2 class="text-xl font-bold text-text" [id]="titleId()">{{ title() }}</h2>
              @if (description(); as dialogDescription) {
                <p class="mt-1 text-sm text-text-muted" [id]="descriptionId()">
                  {{ dialogDescription }}
                </p>
              }
            </div>
            <button
              type="button"
              class="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-text hover:bg-surface-muted"
              aria-label="סגירת החלון"
              (click)="close()"
            >
              <span aria-hidden="true" class="text-2xl leading-none">×</span>
            </button>
          </header>
          <div class="p-5 sm:p-6">
            <ng-content />
          </div>
        </section>
      </div>
    }
  `,
  host: {
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class UiDialog {
  private static nextId = 0;
  private readonly document = inject(DOCUMENT);
  private readonly dialogElement = viewChild<ElementRef<HTMLElement>>('dialog');
  private previouslyFocusedElement: HTMLElement | null = null;
  private readonly id = ++UiDialog.nextId;

  readonly open = model(false);
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  protected readonly titleId = computed(() => `dialog-title-${this.id}`);
  protected readonly descriptionId = computed(() => `dialog-description-${this.id}`);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previouslyFocusedElement =
          this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
        setTimeout(() => this.dialogElement()?.nativeElement.focus());
      } else if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    });
  }

  protected close(): void {
    this.open.set(false);
  }

  protected closeOnEscape(): void {
    if (this.open()) this.close();
  }

  protected trapFocus(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;
    const dialog = this.dialogElement()?.nativeElement;
    if (!dialog) return;

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    if (event.shiftKey && this.document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && this.document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}
