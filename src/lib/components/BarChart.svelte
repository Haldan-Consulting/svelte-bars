<script lang="ts">
	import type { BarData } from '$lib/types';
	import { getThresholdColor } from '$lib/utils/chartTheme';
	let { data = [] }: { data?: BarData[] } = $props();

	// Glossary:
	// - chartShell: outer card wrapper for the whole component
	// - plotFrame: bordered region containing the SVG plot and value row
	// - svg/viewBox: internal coordinate system for bar placement
	// - slotWidth: horizontal lane assigned to each metric
	// - valueRowFrame: bordered numeric summary box
	// - valueRow: equal-width columns aligned to the bar lanes

	// Generate a stable per-instance id so repeated renders of this component
	// can define gradients without colliding in the DOM.
	const chartId = $props.id();

	// These dimensions define the internal SVG coordinate space. The SVG scales
	// responsively in CSS, but all positioning math is done against this box.
	const width = 460;
	const height = 332;
	const topPad = 10;
	const rightPad = 14;
	const bottomPad = 28;
	const leftPad = 46;
	const barWidth = 56;
	const max = 100;

	// Derived layout helpers for the plotting region inside the framed chart.
	const hasData = $derived(data.length > 0);
	const plotHeight = height - topPad - bottomPad;
	const plotWidth = width - leftPad - rightPad;
	const slotWidth = $derived(hasData ? plotWidth / data.length : 0);
	const oeeValue = $derived(data.find((item) => item.label === 'OEE')?.value ?? 0);
	const thresholdColor = $derived(getThresholdColor(oeeValue));

	// Horizontal guide lines and matching y-axis labels.
	const gridValues = [0, 25, 50, 75, 100];
</script>

<style>
	.chartShell {
		--plot-height: 332px;
		--chart-value-row-offset: -12px;
		--chart-value-row-frame-padding: 0 0 6px;
		--chart-value-row-gap: 0;
		--chart-value-row-padding: 0;
		--chart-value-padding-inline: 4px;
	}

	/* chart: groups the plot and summary row vertically. */
	.chart {
		position: relative;
		width: 100%;
	}

	/* The viewBox provides responsive scaling; the fixed CSS height keeps the
	   visible plot area aligned with the Chart.js version. */
	svg {
		display: block;
		width: 100%;
		height: var(--plot-height);
		overflow: visible;
	}

	/* Bars are drawn at full height and scaled from the bottom so updates only
	   need to change one transform value per datum. */
	.bar-shape {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6));
		transform-box: fill-box;
		transform-origin: center bottom;
		transition: transform 0.5s ease;
	}

	/* valueRow: one column per metric, sized from the same plot width as the bars. */
	.value {
		align-items: baseline;
	}
</style>

<div class="chartSystem chartShell" style={`--chart-value-row-border:${thresholdColor}`}>
	<div class="chart">
		{#if hasData}
			<div class="plotFrame">
				<svg viewBox={`0 0 ${width} ${height}`} aria-label="Custom SVG bar chart comparison">
					<!-- Render the horizontal grid first so bars sit above it. -->
					{#each gridValues as g}
						<line
							x1={leftPad}
							x2={width - rightPad}
							y1={topPad + plotHeight - (g / max) * plotHeight}
							y2={topPad + plotHeight - (g / max) * plotHeight}
							stroke="var(--chart-grid-color)"
						/>
						<text
							class="gridLabel"
							x={leftPad - 8}
							y={topPad + plotHeight - (g / max) * plotHeight + 4}
							text-anchor="end"
						>
							{g}%
						</text>
					{/each}

					<!-- Each bar owns its gradient, geometry, and bottom label. -->
					{#each data as m, i}
						<defs>
							<linearGradient id={`${chartId}-grad-${i}`} x1="0%" x2="100%">
								<stop offset="0%" stop-color={m.c1} />
								<stop offset="100%" stop-color={m.c2} />
							</linearGradient>
						</defs>

						<g transform={`translate(${leftPad + i * slotWidth + (slotWidth - barWidth) / 2}, ${topPad})`}>
							<!-- Rounded corners on each bar. -->
							<rect
								class="bar-shape"
								x="0"
								y="0"
								width={barWidth}
								height={plotHeight}
								rx="5"
								fill={`url(#${chartId}-grad-${i})`}
								style={`transform: scaleY(${m.value / max});`}
							></rect>
						</g>

						<rect
							class="labelBox"
							x={leftPad + i * slotWidth + 8}
							y={height - 22}
							width={slotWidth - 16}
							height="24"
							rx="4"
						/>

						<text
							x={leftPad + i * slotWidth + slotWidth / 2}
							y={height - 6}
							text-anchor="middle"
							fill="var(--chart-text)"
							font-size="14"
						>
							{m.label}
						</text>
					{/each}
				</svg>

				<!-- The summary row is anchored to the plot width so each value tracks
				     its bar lane rather than the full card width. -->
				<div
					class="valueRowFrame"
					style={`margin-left:${(leftPad / width) * 100}%;width:${(plotWidth / width) * 100}%`}
				>
					<div class="valueRow" style={`--count:${data.length}`}>
						{#each data as m}
							<div class="value" style={`color:${m.c2}`}>
								<span>{m.value}</span>
								<span class="percent">%</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<p class="emptyState">No chart data available.</p>
		{/if}
	</div>
</div>
