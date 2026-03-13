# HaldanMES SVG Components

Svelte components for bespoke manufacturing visuals that are designed in Figma and rebuilt in code from fixed geometry.

## Development

```sh
npm install
npm run dev
```

Validate the repo:

```sh
npm run check
npm run build
```

## Current Direction

This repo no longer treats shared structural CSS as the default for highly custom components.

The preferred method is:

1. design the component in Figma
2. split the handoff into `StaticShell` and `DynamicShell`
3. extract fixed coordinates into a layout spec
4. rebuild the live component in Svelte
5. keep only the changing parts dynamic

This worked for the rebuilt bar chart and is now the default for similar components.

## Component System

Live components are in `src/lib/components`:

- `BarChart.svelte`
- `SvgPieChart.svelte`
- `Machine.svelte`
- `ChartJsBarChart.svelte` as reference/comparison work

Supporting files:

- per-component layout specs in `src/lib/components/*.layouts.ts`
- shared logic in `src/lib/utils`
- shared types in `src/lib/types.ts`

## Figma Handoff Standard

For fidelity-sensitive components, provide:

- one `StaticShell` frame
- one `DynamicShell` frame

`StaticShell` should contain the parts that never change.

`DynamicShell` should contain only:

- bars/fills
- live values
- dynamic borders
- any other data-driven overlays

This gives Codex enough structure to rebuild the component faithfully without guessing.

## Workflow

The full workflow is documented in [docs/component-workflow.md](/Users/Erikhansen/Library/CloudStorage/OneDrive-HaldanConsulting/4.3%20Haldan%20Development/svg/svelte-bars/docs/component-workflow.md).

In short:

1. design in Figma
2. create `StaticShell` and `DynamicShell`
3. rebuild in Svelte from fixed coordinates
4. validate
5. tune coordinates rather than re-guessing structure

## Assets

Repo SVG assets live in `src/lib/assets`.

Use them for review, packaging, or documentation, but not as the runtime source for live component behavior.
