<script lang="ts">
	import { barChartLayout } from '$lib/components/barChart.layouts';
	import type { BarData } from '$lib/types';
	import { getThresholdColor } from '$lib/utils/chartTheme';

	type BarKey = 'availability' | 'performance' | 'quality' | 'oee';

	let { data = [] }: { data?: BarData[] } = $props();

	const layout = barChartLayout;

	const normalizeKey = (label: string): BarKey => {
		switch (label.toLowerCase()) {
			case 'availability':
				return 'availability';
			case 'performance':
				return 'performance';
			case 'quality':
				return 'quality';
			default:
				return 'oee';
		}
	};

	const barItems = $derived(
		data.map((item) => ({
			...item,
			key: normalizeKey(item.label)
		}))
	);

	const barItemsByKey = $derived(
		Object.fromEntries(barItems.map((item) => [item.key, item])) as Partial<Record<BarKey, (typeof barItems)[number]>>
	);

	const oeeValue = $derived(barItems.find((item) => item.key === 'oee')?.value ?? 0);
	const thresholdColor = $derived(getThresholdColor(oeeValue));
	const hasData = $derived(barItems.length > 0);

	const barsToRender = $derived(
		layout.dynamicShell.bars.items
			.map((slot) => {
				const metric = barItemsByKey[slot.key as BarKey];
				return metric ? { slot, metric } : null;
			})
			.filter((item): item is { slot: (typeof layout.dynamicShell.bars.items)[number]; metric: BarData & { key: BarKey } } => Boolean(item))
	);

	const valuesToRender = $derived(
		layout.dynamicShell.values.items
			.map((slot) => {
				const metric = barItemsByKey[slot.key as BarKey];
				return metric ? { slot, metric } : null;
			})
			.filter((item): item is { slot: (typeof layout.dynamicShell.values.items)[number]; metric: BarData & { key: BarKey } } => Boolean(item))
	);

	const barHeight = (value: number) =>
		Math.max(0, Math.min(layout.dynamicShell.bars.slotHeight, (value / 100) * layout.dynamicShell.bars.slotHeight));

	const barTop = (value: number) => layout.dynamicShell.bars.slotHeight - barHeight(value);

	const barStyle = (item: BarData, x: number) =>
		`left:${x}px;top:${barTop(item.value)}px;width:${layout.dynamicShell.bars.items[0].width}px;height:${barHeight(item.value)}px;background:linear-gradient(90deg, ${item.c1} 0%, ${item.c2} 100%);`;

	const valueStyle = (item: BarData, x: number, y: number) =>
		`left:${x}px;top:${y}px;width:${layout.dynamicShell.values.items[0].width}px;height:${layout.dynamicShell.values.items[0].height}px;color:${item.c2};`;
</script>

<style>
	.chartRoot {
		position: relative;
		width: 500px;
		height: 500px;
		margin: 0 auto;
	}

	.chartShell {
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		background: #202020;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	.plotFrame {
		position: absolute;
		left: 40px;
		top: 100px;
		width: 420px;
		height: 300px;
		box-sizing: border-box;
		background: #2b2b2b;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	.title {
		position: absolute;
		left: 40px;
		top: 20px;
		margin: 0;
		color: #ffffff;
		font-size: 36px;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: 700;
		line-height: 1;
	}

	.grid {
		position: absolute;
		left: 45px;
		top: 105px;
		width: 410px;
		height: 290px;
	}

	.gridLabels {
		position: absolute;
		inset: 0;
	}

	.gridLabel {
		position: absolute;
		color: #d5d5d5;
		font-size: 12px;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: 700;
		line-height: 1;
		text-align: right;
		white-space: nowrap;
	}

	.gridLines {
		position: absolute;
		left: 42.64px;
		top: 8.53px;
		width: 367.36px;
		height: 275.07px;
	}

	.gridLine {
		position: absolute;
		left: 0;
		width: 367.36px;
		height: 1px;
		background: #666666;
	}

	.labels {
		position: absolute;
		left: 98px;
		top: 400px;
		width: 351px;
		height: 24px;
	}

	.labelItem {
		position: absolute;
		height: 24px;
	}

	.labelBox {
		position: absolute;
		inset: 0;
		background: #2b2b2b;
		border-radius: 4px;
	}

	.labelText {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 3px;
		color: #ffffff;
		font-size: 14px;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: 400;
		line-height: 1;
		box-sizing: border-box;
	}

	.valueRowFrameDefault {
		position: absolute;
		left: 98px;
		top: 424px;
		width: 351px;
		height: 48px;
		box-sizing: border-box;
		background: #2b2b2b;
		border: 4px solid #4a4a4a;
		border-radius: 10px;
	}

	.dynamicShell {
		position: absolute;
		left: 98px;
		top: 150px;
		width: 351px;
		height: 322px;
	}

	.dynamicBorder {
		position: absolute;
		left: 0;
		top: 274px;
		width: 351px;
		height: 48px;
		box-sizing: border-box;
		background: #2b2b2b;
		border: 4px solid var(--threshold-color);
		border-radius: 10px;
	}

	.bars {
		position: absolute;
		left: 8px;
		top: 0;
		width: 329px;
		height: 239px;
	}

	.bar {
		position: absolute;
		border-radius: 5px;
		transition:
			height 200ms ease,
			top 200ms ease;
	}

	.values {
		position: absolute;
		left: 10px;
		top: 278px;
		width: 333px;
		height: 40px;
	}

	.value {
		position: absolute;
	}

	.number {
		position: absolute;
		left: 0;
		top: 0;
		color: inherit;
		font-size: 34px;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: 700;
		line-height: 1;
	}

	.percent {
		position: absolute;
		left: 38px;
		top: 9px;
		color: inherit;
		font-size: 24px;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: 700;
		line-height: 1;
	}

	.emptyState {
		margin: 0;
		padding: 24px;
		text-align: center;
		color: #d5d5d5;
		background: #202020;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
		font-family: Arial, Helvetica, sans-serif;
	}
</style>

{#if hasData}
	<div class="chartRoot" style={`--threshold-color:${thresholdColor};`}>
		<div class="chartShell"></div>
		<div class="plotFrame"></div>
		<div class="valueRowFrameDefault"></div>
		<h2 class="title">Bar Chart</h2>

		<div class="grid">
			<div class="gridLabels">
				{#each layout.staticShell.grid.labelPositions as item}
					<div class="gridLabel" style={`left:${item.x}px;top:${item.y}px;`}>
						{item.value}%
					</div>
				{/each}
			</div>

			<div class="gridLines">
				{#each layout.staticShell.grid.lineYs as y}
					<div class="gridLine" style={`top:${y}px;`}></div>
				{/each}
			</div>
		</div>

		<div class="labels">
			{#each layout.staticShell.labels.items as item}
				<div class="labelItem" style={`left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px;`}>
					<div class="labelBox"></div>
					<div class="labelText">{item.label}</div>
				</div>
			{/each}
		</div>

		<div class="dynamicShell">
			<div class="bars">
				{#each barsToRender as { slot, metric }}
					<div class="bar" style={barStyle(metric, slot.x)}></div>
				{/each}
			</div>

			<div class="dynamicBorder"></div>

			<div class="values">
				{#each valuesToRender as { slot, metric }}
					<div class="value" style={valueStyle(metric, slot.x, slot.y)}>
						<span class="number">{metric.value}</span>
						<span class="percent">%</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<p class="emptyState">No chart data available.</p>
{/if}
