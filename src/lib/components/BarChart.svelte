<script lang="ts">
	import type { BarData } from '$lib/types';
	let { data = [] }: { data?: BarData[] } = $props();

	const chartId = $props.id();
	const width = 460;
	const height = 388;
	const topPad = 18;
	const rightPad = 14;
	const bottomPad = 44;
	const leftPad = 46;
	const barWidth = 56;
	const max = 100;

	const hasData = $derived(data.length > 0);
	const plotHeight = height - topPad - bottomPad;
	const plotWidth = width - leftPad - rightPad;
	const slotWidth = $derived(hasData ? plotWidth / data.length : 0);
	const gridValues = [0, 25, 50, 75, 100];
</script>

<style>
	.chartShell {
		position: relative;
		width: 100%;
		padding: 16px;
		box-sizing: border-box;
		background: #202020;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	.chart {
		position: relative;
		width: 100%;
	}

	.plotFrame {
		padding: 8px 10px 0;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	svg {
		display: block;
		width: 100%;
		height: 388px;
		overflow: visible;
	}

	.bar-shape {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6));
		transform-box: fill-box;
		transform-origin: center bottom;
		transition: transform 0.5s ease;
	}

	.valueRow {
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		gap: clamp(12px, 2vw, 28px);
		background: #2b2b2b;
		border: 2px solid #00cc33;
		border-radius: 10px;
		padding: 20px 10px;
		margin-top: 20px;
		box-sizing: border-box;
	}

	.value {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.12em;
		text-align: center;
		font-size: clamp(24px, 4.2vw, 52px);
		font-weight: bold;
		line-height: 1;
		min-width: 0;
		white-space: nowrap;
	}

	.percent {
		font-size: 0.72em;
	}

	.labelBox {
		fill: #2b2b2b;
	}

	.gridLabel {
		font-size: 12px;
		font-weight: 600;
		fill: #d5d5d5;
	}

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

					{#each data as m, i}
						<defs>
							<linearGradient id={`${chartId}-grad-${i}`} x1="0%" x2="100%">
								<stop offset="0%" stop-color={m.c1} />
								<stop offset="100%" stop-color={m.c2} />
							</linearGradient>
						</defs>

						<g transform={`translate(${leftPad + i * slotWidth + (slotWidth - barWidth) / 2}, ${topPad})`}>
							<rect
								class="bar-shape"
								x="0"
								y="0"
								width={barWidth}
								height={plotHeight}
								rx="12"
								fill={`url(#${chartId}-grad-${i})`}
								style={`transform: scaleY(${m.value / max});`}
							/>
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
			</div>

			<div class="valueRow" style={`--count:${data.length}`}>
				{#each data as m}
					<div class="value" style={`color:${m.c2}`}>
						<span>{m.value}</span>
						<span class="percent">%</span>
					</div>
				{/each}
			</div>
		{:else}
			<p class="emptyState">No chart data available.</p>
		{/if}
	</div>
</div>
