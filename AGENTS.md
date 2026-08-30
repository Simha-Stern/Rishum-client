# Angular Development Guidelines

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Local Skills

- Project-specific skills are stored in `.agents/skills/`.
- Before modifying code, check whether a relevant local skill exists.
- Before working on an area covered by a local skill, read that skill's `SKILL.md` and follow its instructions.
- Local skills are the source of truth for requirements specific to the areas they cover.
- When a local skill conflicts with a general recommendation in this file, follow the local skill unless this file explicitly states otherwise.

## TypeScript Best Practices

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` when the type is uncertain.
- Prefer narrow, explicit types at system boundaries.
- Avoid unnecessary type assertions.
- Do not use casts to hide genuine type errors.

## Angular Best Practices

- Always use standalone components instead of NgModules.
- Do NOT set `standalone: true` inside Angular decorators. It is the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Implement lazy loading for feature routes.
- Do NOT use the `@HostBinding` or `@HostListener` decorators. Put host bindings and listeners inside the `host` object of the `@Component` or `@Directive` decorator instead.
- Use `NgOptimizedImage` for static images where applicable.
- `NgOptimizedImage` does not support inline base64 images.

## Components

- Keep components small and focused on a single responsibility.
- Use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators.
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of manually pairing `input()` with `output()`.
- Prefer inline templates for small components.
- When using external templates or styles, use paths relative to the component TypeScript file.
- Components should primarily coordinate presentation and user interaction.
- Keep reusable business logic outside components.

## Forms

- Prefer Signal Forms (`@angular/forms/signals`) for new forms in Angular v22+.
- Use Signal Forms for signal-based state, type-safe field access, and schema-based validation.
- When Signal Forms are not appropriate, prefer Reactive Forms over Template-driven Forms.
- Follow existing project form conventions when modifying existing forms unless there is a clear reason to change them.

## State Management

- Prefer signals for synchronous local application and UI state.
- Use `computed()` for derived read-only state.
- Use `linkedSignal()` when writable state must remain synchronized with reactive source state.
- Keep state transformations pure and predictable.
- Do NOT use `mutate()` on signals; use `update()` or `set()` instead.
- Use RxJS for asynchronous event streams, complex async composition, and APIs that already expose Observables.
- Do not convert between signals and Observables unnecessarily.
- Avoid duplicating state that can be derived with `computed()`.

## Templates

- Keep templates simple and avoid complex logic.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, and `*ngSwitch`.
- Use the `async` pipe when consuming Observables in templates.
- Do NOT use `ngClass`; use `class` bindings instead.
- Do NOT use `ngStyle`; use `style` bindings instead.
- Do not assume JavaScript globals such as `new Date()` are available directly in templates.
- Move complex calculations and transformations out of templates and into `computed()` values, component methods, or appropriate utilities.

## Services

- Design services around a single responsibility.
- For new application-wide singleton services, prefer `@Service()` and `inject()` in Angular v22+.
- Use `@Injectable()` when constructor injection, non-root scopes, or advanced provider configuration is required.
- Prefer `inject()` over constructor injection for new code where appropriate.
- Keep services focused; do not turn services into general-purpose collections of unrelated functionality.

## Accessibility and Israeli Web Compliance

- The project's accessibility and Israeli web compliance requirements are defined in:
  `.agents/skills/israeli-web-compliance/SKILL.md`
- Before modifying UI, templates, forms, navigation, focus behavior, user-facing content, or styling, you MUST read `.agents/skills/israeli-web-compliance/SKILL.md`.
- Follow that skill as the source of truth for accessibility and Israeli web compliance requirements.
- Do not duplicate or reinterpret its detailed requirements in this file.
- Changes affecting accessibility or compliance must satisfy the requirements defined by that skill before the task is considered complete.

## Architecture

- Prefer feature-based organization over grouping files only by technical type.
- Keep business logic outside components.
- Components should coordinate UI; services and domain utilities should contain reusable business logic.
- Prefer composition over inheritance.
- Avoid unnecessary abstractions.
- Extract code only when doing so improves reuse, testability, maintainability, or clarity.
- Do not create abstractions, wrappers, helpers, services, or utilities for code that is used only once unless they clearly improve readability or testability.
- Prefer existing project conventions over generic best practices when they do not conflict with explicit instructions in this file or a local skill.
- Preserve clear boundaries between presentation, application logic, and data access.

## Development Workflow

- Before modifying code, inspect the existing implementation and understand the surrounding code.
- Follow established project patterns and conventions.
- Check `.agents/skills/` for relevant local skills before working on an area.
- Read and follow all relevant `SKILL.md` files before implementing changes.
- Do not introduce new libraries when the existing stack can reasonably solve the problem.
- Prefer minimal, focused changes over broad refactors unless refactoring is explicitly requested or clearly required.
- Do not modify unrelated files.
- Preserve existing public APIs and behavior unless the task explicitly requires changing them.
- Do not rewrite working code solely to match a personal or generic stylistic preference.
- Do not create speculative infrastructure for hypothetical future requirements.

### Validation

After making changes:

- Run the relevant available formatting checks.
- Run the relevant linting checks.
- Run relevant tests.
- Run the TypeScript/compiler checks.
- Prefer targeted checks for the affected area when appropriate.
- Fix errors caused by your changes before finishing.
- Do not silence TypeScript, lint, test, or accessibility errors with casts, disables, suppressions, or ignored failures unless there is a documented and justified reason.
- If a validation command cannot be run, clearly state which validation was not performed and why.

## General Engineering Principles

- Prefer simple solutions over clever ones.
- Optimize for readability and maintainability first.
- Avoid premature optimization.
- Avoid premature abstraction.
- Reuse existing utilities and components when appropriate.
- Keep changes easy to review.
- Make behavior explicit rather than relying on hidden side effects.
- Preserve backward compatibility unless breaking behavior is explicitly required.

## Frontend Design

- Before creating or significantly modifying pages, layouts, visual components, forms, tables, navigation, or responsive behavior, read `.agents/skills/frontend-design/SKILL.md`.
- Follow it as the source of truth for UI composition, Tailwind usage, responsive design, component reuse, and mobile-first implementation.

### Color Tokens

- Use only the color tokens defined in `src/styles.css` (`@theme`) for all UI colors.
- Do not use Tailwind's default color palette classes (for example `bg-blue-700`, `text-slate-600`, or `border-red-200`), arbitrary color values, inline color styles, or raw CSS color values outside the `@theme` definitions.
- Prefer semantic tokens such as `bg-primary`, `text-text-muted`, `border-border`, and `text-danger` over brand-palette tokens.
- Use the corresponding theme tokens for interactive states (for example `hover:bg-primary-hover` and `disabled:bg-disabled`); do not use opacity alone to define a disabled state.
