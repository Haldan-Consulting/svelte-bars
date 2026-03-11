<script lang="ts">
	import type { BarData } from '$lib/types';

	let { data = [] }: { data?: BarData[] } = $props();

	const chartId = $props.id();
	const size = 388;
	const center = size / 2;
	const radius = 122;
	const labelRadius = 158;

	const hasData = $derived(data.length > 0);
	const total = $derived(data.reduce((sum, item) => sum + item.value, 0));
	const oeeValue = $derived(data.find((item) => item.label === 'OEE')?.value ?? 0);
	const totalLossValue = $derived(100 - oeeValue);
	const valueRowBorder = $derived(
		oeeValue > 75 ? '#00cc33' : oeeValue < 70 ? '#ff2b2b' : '#f9f200'
	);
	const valueRowItems = $derived.by(() =>
		data
			.map((item) =>
				item.label === 'OEE'
					? { label: 'Losses', value: totalLossValue, color: '#3cff3c' }
					: { label: item.label, value: item.value, color: item.c2 }
			)
			.sort((a, b) => b.value - a.value)
	);

	type PieSegment = BarData & {
		startAngle: number;
		endAngle: number;
	};

	function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
		return {
			x: cx + r * Math.cos(angle),
			y: cy + r * Math.sin(angle)
		};
	}

	function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
		const start = polarToCartesian(cx, cy, r, startAngle);
		const end = polarToCartesian(cx, cy, r, endAngle);
		const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

		return [
			`M ${cx} ${cy}`,
			`L ${start.x} ${start.y}`,
			`A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
			'Z'
		].join(' ');
	}

	function shortLabel(label: string) {
		if (label === 'Availability Loss') return 'A Loss';
		if (label === 'Performance Loss') return 'P Loss';
		if (label === 'Quality Loss') return 'Q Loss';
		return label;
	}

	const segments = $derived.by(() => {
		if (!total) return [];

		let startAngle = -Math.PI / 2;

		return data.map((item) => {
			const sweep = (item.value / total) * Math.PI * 2;
			const segment: PieSegment = {
				...item,
				startAngle,
				endAngle: startAngle + sweep
			};
			startAngle += sweep;
			return segment;
		});
	});
</script>

<style>
	.chartShell {
		position: relative;
		width: 100%;
		padding: 16px;
		box-sizing: border-box;
		container-type: inline-size;
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

	.slice {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45));
		transition: transform 0.5s ease;
		transform-origin: center;
	}

	.centerDisc {
		fill: #202020;
		stroke: rgba(255, 255, 255, 0.08);
		stroke-width: 2;
	}

	.centerValue {
		font-size: 48px;
		font-weight: 800;
		fill: #3cff3c;
	}

	.centerPercent {
		font-size: 26px;
		font-weight: 700;
		fill: #3cff3c;
	}

	.segmentLabel {
		font-size: 20px;
		font-weight: 700;
		fill: white;
	}

	.valueRow {
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		gap: clamp(12px, 2vw, 28px);
		margin-top: 14px;
		padding: 12px 10px;
		box-sizing: border-box;
		background: #2b2b2b;
		border: 2px solid var(--value-row-border);
		border-radius: 10px;
	}

	.value {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.12em;
		min-width: 0;
		font-size: clamp(18px, 7cqw, 42px);
		font-weight: 700;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
	}

	.percent {
		font-size: 0.72em;
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
				<svg viewBox={`0 0 ${size} ${size}`} aria-label="SVG pie chart comparison">
					<defs>
						{#each segments as segment, i}
							<linearGradient id={`${chartId}-slice-${i}`} x1="0%" x2="100%">
								<stop offset="0%" stop-color={segment.c1} />
								<stop offset="100%" stop-color={segment.c2} />
							</linearGradient>
						{/each}
					</defs>

					{#each segments as segment, i}
						<path
							class="slice"
							d={describeSlice(center, center, radius, segment.startAngle, segment.endAngle)}
							fill={`url(#${chartId}-slice-${i})`}
						/>

						{@const midAngle = (segment.startAngle + segment.endAngle) / 2}
						{@const labelPoint = polarToCartesian(center, center, labelRadius, midAngle)}
						<text
							class="segmentLabel"
							x={labelPoint.x}
							y={labelPoint.y}
							text-anchor="middle"
							dominant-baseline="middle"
						>
							{shortLabel(segment.label)}
						</text>
					{/each}

					<circle class="centerDisc" cx={center} cy={center} r="62" />
					<text class="centerValue" x={center} y={center + 16} text-anchor="middle">
						{oeeValue}
					</text>
					<text class="centerPercent" x={center + 34} y={center + 16} text-anchor="start">%</text>
				</svg>
			</div>

				<div class="valueRow" style={`--count:${valueRowItems.length};--value-row-border:${valueRowBorder}`}>
					{#each valueRowItems as item}
						<div class="value" style={`color:${item.color}`}>
							<span>{item.value}</span>
							<span class="percent">%</span>
						</div>
					{/each}
				</div>
		{:else}
			<p class="emptyState">No chart data available.</p>
		{/if}
	</div>
</div>
