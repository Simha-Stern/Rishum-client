import { Component, computed, input, numberAttribute } from '@angular/core';

export type HeadingSize = 'page' | 'section' | 'subsection' | 'card';

@Component({
  selector: 'app-heading',
  template: `
    @switch (level()) {
      @case (1) {
        <h1 [id]="headingId()" [class]="classes()">{{ text() }}</h1>
      }
      @case (2) {
        <h2 [id]="headingId()" [class]="classes()">{{ text() }}</h2>
      }
      @case (3) {
        <h3 [id]="headingId()" [class]="classes()">{{ text() }}</h3>
      }
      @default {
        <h4 [id]="headingId()" [class]="classes()">{{ text() }}</h4>
      }
    }
  `,
})
export class UiHeading {
  readonly text = input.required<string>();
  readonly level = input(2, { transform: numberAttribute });
  readonly size = input<HeadingSize>('section');
  readonly headingId = input<string | null>(null);

  protected readonly classes = computed(
    () =>
      ({
        page: 'text-3xl font-bold tracking-tight text-text sm:text-4xl',
        section: 'text-xl font-bold text-text',
        subsection: 'text-lg font-bold text-text',
        card: 'text-xl font-bold text-text',
      })[this.size()],
  );
}
