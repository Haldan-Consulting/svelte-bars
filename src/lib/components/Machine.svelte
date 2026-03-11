<script lang="ts">
	import type { BarData } from '$lib/types';
	import { chartThresholdTokens, getThresholdColor } from '$lib/utils/chartTheme';

	let {
		title = 'Turning Cell 1',
		assetId = 'V30-A03',
		oee = 0,
		goodCount = 0,
		scrapCount = 0,
		data = []
	}: {
		title?: string;
		assetId?: string;
		oee?: number;
		goodCount?: number;
		scrapCount?: number;
		data?: BarData[];
	} = $props();

	// Glossary:
	// - chartShell: outer card wrapper
	// - frame: main machine body / embedded chart border
	// - plot region: black area containing bars and grid lines
	// - cap: thin top strip inside the machine body
	// - badges: right-side stacked status callouts
	// - assetLabel: bottom machine id text

	const machineId = $props.id();
	const width = 460;
	const height = 306;
	const borderWidth = 6;
	const frameX = 28;
	const frameY = 44;
	const frameWidth = 286;
	const frameHeight = 188;
	const badgeGap = 14;
	const badgeWidth = 110;
	const badgeHeight = 44;
	const badgeX = frameX + frameWidth + badgeGap;
	const badgeTop = frameY + 8;
	const badgeGapY = 18;
	const badgeCenterX = badgeX + badgeWidth / 2;
	const plotLeft = frameX + 22;
	const plotTop = frameY + 34;
	const plotWidth = frameWidth - 44;
	const plotHeight = frameHeight - 64;
	const capX = frameX + 18;
	const capY = frameY + 12;
	const capWidth = 206;
	const capHeight = 10;
	const barWidth = 34;
	const max = 100;

	const hasData = $derived(data.length > 0);
	const slotWidth = $derived(hasData ? plotWidth / data.length : 0);
	const thresholdColor = $derived(getThresholdColor(oee));
	const badges = $derived.by(() => [
		{ value: `${oee}%`, border: thresholdColor, text: 'var(--chart-accent-good)' },
		{ value: `${goodCount}`, border: chartThresholdTokens.good, text: 'var(--chart-accent-good)' },
		{ value: `${scrapCount}`, border: chartThresholdTokens.bad, text: chartThresholdTokens.bad }
	]);
</script>

<style>
	svg {
		display: block;
		width: 100%;
		height: 306px;
		overflow: visible;
	}

	.machineTitle {
		font-size: 28px;
		font-weight: 800;
		fill: var(--chart-text);
	}

	.assetLabel {
		font-size: 26px;
		font-weight: 800;
		fill: var(--chart-text);
		letter-spacing: 0.04em;
	}

	/* badgeText: shared type style for OEE/good/scrap status badges. */
	.badgeText {
		font-size: 30px;
		font-weight: 900;
	}

	.gridLine {
		stroke: var(--chart-grid-color);
		stroke-width: 2;
	}

	.machineBar {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
	}
</style>

<div class="chartSystem chartShell">
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

			<!-- machineTitle is centered to the full component width. -->
			<text class="machineTitle" x={width / 2} y="28" text-anchor="middle">{title}</text>

			<!-- frame: threshold-colored machine outline and chart boundary. -->
				<rect
					x={frameX}
					y={frameY}
					width={frameWidth}
					height={frameHeight}
					rx="18"
					fill="#000000"
					style={`stroke:${thresholdColor}`}
					stroke-width={borderWidth}
				/>
			<!-- cap: decorative top strip inside the frame. -->
			<rect x={capX} y={capY} width={capWidth} height={capHeight} fill="#0a0a0a" />

			<!-- gridLine: simplified machine plot guide lines. -->
			{#each [1, 2, 3, 4] as row}
				<line
					class="gridLine"
					x1={plotLeft}
					x2={plotLeft + plotWidth}
					y1={plotTop + row * (plotHeight / 4)}
					y2={plotTop + row * (plotHeight / 4)}
				/>
			{/each}

			<!-- machineBar: reuses the shared metric gradients. -->
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

			<!-- badges: OEE, good parts, and scrap parts status stack. -->
			{#each badges as badge, index}
				{@const badgeY = badgeTop + index * (badgeHeight + badgeGapY)}
				<rect
					x={badgeX}
					y={badgeY}
					width={badgeWidth}
					height={badgeHeight}
					rx="12"
					fill="#111111"
					style={`stroke:${badge.border}`}
					stroke-width={borderWidth}
				/>
				<text
					class="badgeText"
					x={badgeCenterX}
					y={badgeY + badgeHeight / 2 + 1}
					text-anchor="middle"
					dominant-baseline="central"
					style={`fill:${badge.text}`}
				>
					{badge.value}
				</text>
			{/each}

			<!-- assetLabel is centered to the full component width. -->
			<text class="assetLabel" x={width / 2} y="294" text-anchor="middle">{assetId}</text>
		</svg>
	{:else}
		<p class="emptyState">No machine data available.</p>
	{/if}
</div>
