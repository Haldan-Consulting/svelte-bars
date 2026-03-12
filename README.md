# HaldanMES SVG Components

Svelte components for data-driven manufacturing visuals, plus SVG exports for Figma review and packaging.

## Development

Install dependencies and run the app locally:

```sh
npm install
npm run dev
```

Validate the repo:

```sh
npm run check
npm run build
```

## Component System

The live components are in `src/lib/components`:

- `BarChart.svelte`
- `SvgPieChart.svelte`
- `Machine.svelte`
- `ChartJsBarChart.svelte` for reference/comparison work

Shared styling and behavior live here:

- `src/lib/styles/chart-system.css`
- `src/lib/utils/chartTheme.ts`
- `src/lib/types.ts`

Default demo wiring lives in `src/routes/+page.svelte`.

## Figma Assets

Editable SVG exports for Figma are stored in `src/lib/assets`:

- `figma-components.svg`
- `figma-bar-chart.svg`
- `figma-pie-chart.svg`
- `figma-machine.svg`
- `figma-design-system.svg`
- `bar-chart-anatomy.svg`

Import these SVGs into Figma as vectors. Do not treat Figma as the primary source of truth for component geometry or behavior.

## Workflow

This repo uses a code-first hybrid workflow:

1. Sketch intent in Figma only if the concept is still loose.
2. Build the real component in Svelte first.
3. Keep glossary comments inside the component file.
4. Refresh SVG exports in `src/lib/assets` after code changes.
5. Use Figma for review, annotation, and presentation.
6. Apply revisions in code first, then regenerate the SVG exports.

The detailed workflow is documented in [docs/component-workflow.md](/Users/Erikhansen/Library/CloudStorage/OneDrive-HaldanConsulting/4.3%20Haldan%20Development/svg/svelte-bars/docs/component-workflow.md).

That workflow document also includes a Mermaid diagram of the full Figma/Codex loop, and the matching Figma-importable SVG export is [src/lib/assets/figma-codex-workflow.svg](/Users/Erikhansen/Library/CloudStorage/OneDrive-HaldanConsulting/4.3%20Haldan%20Development/svg/svelte-bars/src/lib/assets/figma-codex-workflow.svg).
