import { Component, computed, input } from '@angular/core';
import { RouterLink, type Params } from '@angular/router';

export type AppRoute = string | (string | number)[];
export type LinkAppearance = 'inline' | 'navigation' | 'button';
export type LinkVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-link',
  imports: [RouterLink],
  template: `
    @if (routerLink()) {
      <a [class]="classes()" [routerLink]="routerLink()" [queryParams]="queryParams()">{{
        text()
      }}</a>
    } @else {
      <a [class]="classes()" [href]="href()">{{ text() }}</a>
    }
  `,
})
export class UiLink {
  readonly text = input.required<string>();
  readonly routerLink = input<AppRoute | null>(null);
  readonly queryParams = input<Params | null>(null);
  readonly href = input<string | null>(null);
  readonly appearance = input<LinkAppearance>('inline');
  readonly variant = input<LinkVariant>('primary');

  protected readonly classes = computed(() => {
    const variant =
      this.variant() === 'primary'
        ? 'text-primary-foreground hover:text-text'
        : 'text-secondary-foreground hover:text-text';
    const appearance = {
      inline: `font-semibold underline ${variant}`,
      navigation: `font-medium underline-offset-4 hover:underline ${variant}`,
      button:
        this.variant() === 'primary'
          ? 'inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover'
          : 'inline-flex min-h-11 items-center justify-center rounded-lg bg-secondary px-4 py-2 text-center font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover',
    }[this.appearance()];

    return appearance;
  });
}
