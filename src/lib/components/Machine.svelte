<script lang="ts">
	import type { BarData } from '$lib/types';

	let {
		title = 'Turning Cell 1',
		assetId = 'V30-A03',
		oee = 0,
		data = []
	}: {
		title?: string;
		assetId?: string;
		oee?: number;
		data?: BarData[];
	} = $props();

	const machineId = $props.id();
	const width = 460;
	const height = 290;
	const plotLeft = 56;
	const plotTop = 78;
	const plotWidth = 270;
	const plotHeight = 132;
	const plotInset = 10;
	const barWidth = 38;
	const max = 100;

	const hasData = $derived(data.length > 0);
	const slotWidth = $derived(hasData ? plotWidth / data.length : 0);
	const badgeColor = $derived(oee > 75 ? '#00cc33' : oee < 70 ? '#ff2b2b' : '#f9f200');
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

	svg {
		display: block;
		width: 100%;
		height: 290px;
		overflow: visible;
	}

	.machineTitle {
		font-size: 28px;
		font-weight: 800;
		fill: white;
	}

	.assetLabel {
		font-size: 26px;
		font-weight: 800;
		fill: white;
		letter-spacing: 0.04em;
	}

	.badgeText {
		font-size: 34px;
		font-weight: 900;
	}

	.gridLine {
		stroke: #666;
		stroke-width: 2;
	}

	.machineBar {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
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
	{#if hasData}
		<svg viewBox={`0 0 ${width} ${height}`} aria-label={`${title} machine card`}>
			<defs>
				{#each data as item, i}
					<linearGradient id={`${machineId}-bar-${i}`} x1="0%" x2="100%">
						<stop offset="0%" stop-color={item.c1} />
						<stop offset="100%" stop-color={item.c2} />
					</linearGradient>
				{/each}
			</defs>

			<text class="machineTitle" x={width / 2} y="28" text-anchor="middle">{title}</text>

			<rect x="18" y="44" width="336" height="188" rx="18" fill="#000000" stroke="#00cc33" stroke-width="12" />
			<rect x="30" y="56" width="254" height="12" fill="#0a0a0a" />
			<rect
				x={plotLeft - plotInset}
				y={plotTop - plotInset}
				width={plotWidth + plotInset * 2}
				height={plotHeight + plotInset * 2}
				rx="12"
				fill="#000000"
			/>

			{#each [1, 2, 3, 4] as row}
				<line
					class="gridLine"
					x1={plotLeft - 12}
					x2={plotLeft + plotWidth + 8}
					y1={plotTop + row * (plotHeight / 4)}
					y2={plotTop + row * (plotHeight / 4)}
				/>
			{/each}

			{#each data as item, i}
				<rect
					class="machineBar"
					x={plotLeft + i * slotWidth + (slotWidth - barWidth) / 2}
					y={plotTop + plotHeight - (item.value / max) * plotHeight}
					width={barWidth}
					height={(item.value / max) * plotHeight}
					fill={`url(#${machineId}-bar-${i})`}
				/>
			{/each}

			<rect x="322" y="102" width="114" height="56" rx="12" fill="#111111" stroke={badgeColor} stroke-width="6" />
				<text
					class="badgeText"
					x="379"
					y="132"
					text-anchor="middle"
					dominant-baseline="central"
					fill={badgeColor}
				>
					{oee}%
			</text>

			<text class="assetLabel" x={width / 2} y="278" text-anchor="middle">{assetId}</text>
		</svg>
	{:else}
		<p class="emptyState">No machine data available.</p>
	{/if}
</div>
