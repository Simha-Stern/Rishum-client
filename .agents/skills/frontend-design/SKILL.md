---
name: frontend-design
description: >
  UI and frontend design guidelines for Rishum Plus.
  Use this skill whenever creating or modifying pages, layouts, components,
  forms, tables, dialogs, navigation, responsive behavior, or visual styling.
---

# Frontend Design

Use this skill whenever creating or modifying user-facing UI.

The goal is to build a consistent, responsive, maintainable interface using
existing project components and Tailwind CSS.

## Core Principles

- Design mobile-first.
- Prefer existing reusable components over creating new ones.
- Prefer composition of small UI components over large monolithic components.
- Use Tailwind CSS for styling.
- Follow existing project design patterns before introducing new ones.
- Keep visual behavior consistent across the application.
- Prefer simple and predictable interfaces over visually complex solutions.
- Do not introduce a new visual pattern when an existing project pattern solves the same problem.
- Accessibility requirements are defined separately in `.agents/skills/israeli-web-compliance/SKILL.md` and must also be followed for UI work.

## Before Building UI

Before implementing a new page or component:

1. Inspect similar existing pages and components.
2. Check whether the required UI already exists as a reusable component.
3. Check the project's existing component library before building custom UI.
4. Reuse existing spacing, typography, colors, controls, layouts, and interaction patterns.
5. Identify the mobile layout before designing larger breakpoints.

Do not create duplicate components that differ only slightly from existing ones.

If an existing component can reasonably support the requirement through composition or a small extension, prefer extending or composing it instead of creating a parallel implementation.

## Component Library

Prefer components from the project's existing UI/component library for common UI primitives such as:

- buttons
- inputs
- selects
- checkboxes
- radio groups
- dialogs
- dropdowns
- tooltips
- tabs
- badges
- cards
- tables
- pagination
- alerts
- menus
- navigation
- loading indicators

Do not manually recreate a standard component when the project's component library already provides an appropriate implementation.

Use the component library for behavior and structure, and Tailwind utilities for layout and project-specific presentation where appropriate.

Before introducing another UI library or component dependency, verify that the existing stack cannot reasonably provide the required functionality.

## Tailwind CSS

Use Tailwind CSS utilities as the primary styling mechanism.

Prefer:

- Tailwind utility classes
- responsive variants
- state variants
- existing design tokens
- existing shared component styles

Avoid:

- unnecessary custom CSS
- inline `style` attributes
- arbitrary values when a project token or standard Tailwind value exists
- repeated large class lists across many components
- introducing one-off colors or spacing values without a clear reason

Prefer:

`p-4`

over:

`p-[17px]`

when the precise custom value is not required.

Prefer semantic project tokens such as:

`bg-primary`
`text-muted-foreground`
`border-border`

when they exist, rather than hard-coded colors such as:

`bg-blue-600`
`text-gray-500`
`border-gray-200`

Do not introduce new colors when an existing design token can express the intended meaning.

## Mobile-First Design

All new UI must be designed mobile-first.

Base Tailwind classes represent the mobile layout.

Add larger-screen behavior progressively using responsive variants:

`sm:`
`md:`
`lg:`
`xl:`

For example:

`flex flex-col gap-3 md:flex-row md:items-center`

rather than designing desktop first and attempting to undo it on mobile.

Do not assume desktop screen width.

Pages must remain usable on narrow screens without horizontal scrolling unless horizontal scrolling is intentionally required for the content.

## Responsive Layout

Prefer flexible layouts using:

- `flex`
- `grid`
- `gap`
- `min-w-0`
- `w-full`
- `max-w-*`
- responsive grid columns
- responsive flex direction

Avoid fixed widths unless the UI specifically requires them.

Prefer:

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3`

over fixed pixel-based layouts.

Long text, user-generated content, and translated content must not unexpectedly break layouts.

## Page Layout

Keep page structure predictable.

A typical page should have a clear hierarchy:

1. Page title and optional description
2. Primary actions
3. Filters or secondary controls
4. Main content
5. Pagination or secondary navigation where needed

Keep primary actions visually distinct from secondary actions.

Do not overload headers with too many actions.

On small screens, allow actions and filters to stack naturally.

## Forms

Forms must work well on mobile devices.

- Use full-width controls on small screens when appropriate.
- Stack fields vertically by default.
- Use multiple columns only when enough horizontal space exists.
- Keep related fields visually grouped.
- Keep labels close to their controls.
- Make primary submit actions obvious.
- Clearly distinguish primary and secondary actions.
- Preserve user input when recoverable errors occur.
- Show validation feedback near the relevant field.

Prefer:

`grid grid-cols-1 gap-4 md:grid-cols-2`

for groups of fields that benefit from multiple columns on larger screens.

Do not compress forms into desktop-style multi-column layouts on narrow screens.

## Tables and Data Lists

Do not assume a desktop table is appropriate on mobile.

For data-heavy interfaces, determine whether mobile should use:

- responsive table scrolling
- cards
- stacked rows
- reduced columns
- expandable details
- another existing project pattern

Do not hide important information solely to make a desktop table fit.

Prioritize the information users need to make decisions.

Keep row actions discoverable and usable on touch devices.

## Buttons and Actions

Use the existing button component whenever available.

Maintain a clear hierarchy between:

- primary
- secondary
- destructive
- subtle/tertiary actions

Do not make every action visually primary.

Use icon-only buttons only when the icon's meaning is sufficiently clear and accessibility requirements are satisfied.

Avoid creating custom button styling directly in feature components when the shared button component can represent the same action.

## Loading States

Any UI that waits for asynchronous data should have an intentional loading state.

Use the project's existing loading patterns.

Prefer skeletons when preserving the approximate layout improves the experience.

Use spinners for short, focused operations when appropriate.

Avoid layout jumps when content loads where reasonably possible.

Do not leave empty areas that look broken while data is loading.

## Empty States

Lists, tables, dashboards, and search results should handle empty states intentionally.

An empty state should explain what is happening.

When useful, provide the next relevant action.

Distinguish between:

- no data exists yet
- no search results
- filters exclude all results
- data could not be loaded

Do not display an empty table or blank page when a meaningful empty state would be clearer.

## Error States

Errors visible to users should be understandable and actionable.

Do not expose:

- stack traces
- raw server errors
- database errors
- implementation details

Use the project's existing alert, notification, or error presentation patterns.

Keep recoverable errors close to the interaction that caused them.

## Dialogs and Overlays

Use dialogs for focused tasks, confirmations, or small forms.

Do not move complex workflows into dialogs merely to avoid creating a page.

Dialogs must work on narrow screens.

Avoid dialogs that become effectively unusable because their content exceeds the viewport.

For complex mobile workflows, consider whether a dedicated page or existing full-screen pattern is more appropriate.

## Spacing and Visual Consistency

Prefer consistent spacing values.

Use `gap-*` on flex/grid containers instead of manually adding margins between every child where practical.

Maintain consistent:

- page padding
- section spacing
- card padding
- field spacing
- action spacing
- border radius
- typography hierarchy

Avoid arbitrary visual adjustments made only to fix one specific screen if they create inconsistency elsewhere.

## Typography

Use the project's established typography scale.

Maintain clear hierarchy between:

- page titles
- section headings
- body text
- labels
- helper text
- metadata

Do not introduce custom font sizes when an existing typography level is appropriate.

Avoid excessively small text, especially for interactive or important information.

## Icons

Use the project's existing icon library.

Do not introduce another icon library for a small number of icons.

Keep icon sizes consistent with surrounding components.

Do not use decorative icons unnecessarily.

## Reusability

Before creating a new shared component, ask whether the UI is actually reusable.

Do not abstract every piece of markup.

Create shared components when they represent a recurring UI concept or behavior.

Good candidates include:

- page headers
- status badges
- data tables
- empty states
- form controls
- confirmation dialogs
- search/filter controls

Feature-specific markup that is unlikely to be reused can remain inside the feature.

## Visual States

Interactive components should intentionally support the states relevant to them:

- default
- hover
- focus
- active
- disabled
- loading
- error
- selected

Do not add interaction states inconsistently across similar controls.

Use the component library's built-in states whenever possible.

## RTL and Hebrew

The application must work correctly with Hebrew and RTL layouts.

Do not assume left-to-right layout.

Prefer logical layout behavior and utilities when available.

Check:

- text alignment
- icon placement
- navigation
- form controls
- directional icons
- tables
- dialogs
- dropdowns
- pagination
- spacing around directional elements

Avoid hard-coded left/right assumptions when start/end semantics are appropriate.

## Avoid Over-Engineering

Do not create:

- a new design system for a single feature
- unnecessary wrapper components
- one-off variants without clear value
- custom implementations of standard UI controls
- new dependencies for simple styling problems

Prefer the smallest solution that remains consistent with the rest of the application.

## Before Finishing

After implementing UI changes:

1. Verify the mobile layout.
2. Verify at least one larger responsive layout.
3. Check for unexpected horizontal overflow.
4. Check loading, empty, error, and disabled states where relevant.
5. Verify existing reusable components were used where appropriate.
6. Verify Tailwind classes follow project conventions.
7. Read and apply `.agents/skills/israeli-web-compliance/SKILL.md`.
8. Run the project's relevant validation commands.
