<script lang="ts">
	import type { BarData } from '$lib/types';
	let { data = [] }: { data?: BarData[] } = $props();

	// Generate a stable per-instance id so repeated renders of this component
	// can define gradients without colliding in the DOM.
	const chartId = $props.id();

	// These dimensions define the internal SVG coordinate space. The SVG scales
	// responsively in CSS, but all positioning math is done against this box.
	const width = 460;
	const height = 388;
	const topPad = 18;
	const rightPad = 14;
	const bottomPad = 44;
	const leftPad = 46;
	const barWidth = 56;
	const max = 100;

	// Derived layout helpers for the plotting region inside the framed chart.
	const hasData = $derived(data.length > 0);
	const plotHeight = height - topPad - bottomPad;
	const plotWidth = width - leftPad - rightPad;
	const slotWidth = $derived(hasData ? plotWidth / data.length : 0);
	const barInset = $derived(hasData ? (slotWidth - barWidth) / 2 : 0);
	const valueRowLeft = $derived(leftPad + barInset);
	const valueRowRight = $derived(rightPad + barInset);
	const oeeValue = $derived(data.find((item) => item.label === 'OEE')?.value ?? 0);
	const valueRowBorder = $derived(
		oeeValue > 75 ? '#00cc33' : oeeValue < 70 ? '#ff2b2b' : '#f9f200'
	);

	// Horizontal guide lines and matching y-axis labels.
	const gridValues = [0, 25, 50, 75, 100];
</script>

<style>
	/* Outer shell used to match the Chart.js card footprint. */
	.chartShell {
		position: relative;
		width: 100%;
		padding: 16px;
		box-sizing: border-box;
		background: #202020;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	/* Keeps the chart and the value row grouped as one vertical block. */
	.chart {
		position: relative;
		width: 100%;
	}

	/* Inner frame around the SVG plot area to mirror the Chart.js chart box. */
	.plotFrame {
		padding: 8px 10px 0;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	/* The viewBox provides responsive scaling; the fixed CSS height keeps the
	   visible plot area aligned with the Chart.js version. */
	svg {
		display: block;
		width: 100%;
		height: 388px;
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

	/* Summary values under the chart use the same four-column rhythm as the
	   plotted bars so both rows feel connected visually. */
	.valueRow {
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		gap: clamp(12px, 2vw, 28px);
		background: #2b2b2b;
		border: 2px solid var(--value-row-border);
		border-radius: 10px;
		padding: 12px 10px;
		margin-top: 14px;
		box-sizing: border-box;
	}

	/* The number and percent sign are separate so the percent can scale down
	   without forcing the whole value to wrap. */
	.value {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.12em;
		text-align: center;
		font-size: clamp(20px, 3.0vw, 42px);
		font-weight: bold;
		line-height: 1;
		min-width: 0;
		white-space: nowrap;
	}

	.percent {
		font-size: 0.72em;
	}

	/* Dark label chips keep the category names readable against bright bars. */
	.labelBox {
		fill: #2b2b2b;
	}

	/* Small axis labels mirror the Chart.js left-side percentage ticks. */
	.gridLabel {
		font-size: 12px;
		font-weight: 600;
		fill: #d5d5d5;
	}

	/* Fallback state when the component receives no data. */
	.emptyState {
		margin: 0;
		padding: 24px;
		text-align: center;
		color: #d5d5d5;
		background: #2b2b2b;
		border: 2px solid #4a4a4a;
		border-radius: 10px;
	}
</style>

<div class="chartShell">
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
							stroke="#666"
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
							y={height - 28}
							width={slotWidth - 16}
							height="24"
							rx="4"
						/>

						<text
							x={leftPad + i * slotWidth + slotWidth / 2}
							y={height - 12}
							text-anchor="middle"
							fill="white"
							font-size="14"
						>
							{m.label}
						</text>
					{/each}
				</svg>

				<!-- Match the value row to the same left/right plot insets used by
				     the first and last bars so the numeric summary aligns with the
				     actual bar span rather than the full plot width. -->
				<div
					class="valueRow"
					style={`--count:${data.length};--value-row-border:${valueRowBorder};margin-left:${(valueRowLeft / width) * 100}%;margin-right:${(valueRowRight / width) * 100}%`}
				>
					{#each data as m}
						<div class="value" style={`color:${m.c2}`}>
							<span>{m.value}</span>
							<span class="percent">%</span>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="emptyState">No chart data available.</p>
		{/if}
	</div>
</div>
