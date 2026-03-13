<script lang="ts">
	import { machineLayout } from '$lib/components/machine.layouts';
	import type { BarData } from '$lib/types';
	import { getThresholdColor } from '$lib/utils/chartTheme';

	let {
		title = 'Machine',
		partNo = 'Part No',
		oee = undefined,
		goodCount = 0,
		scrapCount = 0,
		data = []
	}: {
		title?: string;
		partNo?: string;
		oee?: number;
		goodCount?: number;
		scrapCount?: number;
		data?: BarData[];
	} = $props();

	// Glossary:
	// - chartShell: outer 600x380 card shell from the fixed handoff
	// - plotFrame: dark machine body that holds the grid viewport and status frames
	// - gridFrame: black viewport shell in the static handoff under the threshold border overlay
	// - labels: centered machine title and part number anchors from the shell
	// - dynamicBorders: OEE-driven bar/value borders from the dynamic handoff
	// - values: OEE, good-parts, and scrap-parts live text positions from the dynamic handoff

	const layout = machineLayout;
	type MachineKey = 'availability' | 'performance' | 'quality' | 'oee';

	const rectStyle = (rect: { x: number; y: number; width: number; height: number }) =>
		`left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;`;

	const frameStyle = (frame: {
		x: number;
		y: number;
		width: number;
		height: number;
		radius: number;
		borderWidth: number;
	}) => `${rectStyle(frame)}border-radius:${frame.radius}px;border-width:${frame.borderWidth}px;`;

	const valueText = (value: number) => `${Math.max(0, Math.round(value))}`;

	const normalizeKey = (label: string): MachineKey => {
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

	const dataByKey = $derived(
		Object.fromEntries(
			data.map((item) => [normalizeKey(item.label), { ...item, value: Math.max(0, Math.min(100, item.value)) }])
		) as Partial<Record<MachineKey, BarData>>
	);

	const oeeValue = $derived(oee ?? dataByKey.oee?.value ?? 0);
	const thresholdColor = $derived(getThresholdColor(oeeValue));

	const bars = $derived.by(() =>
		layout.dynamicShell.bars.items
			.map((slot) => {
				const metric = dataByKey[slot.key as MachineKey];
				if (!metric) return null;

				const height = Math.max(0, Math.min(slot.height, (metric.value / 100) * layout.dynamicShell.bars.slotHeight));
				return {
					...metric,
					x: slot.x,
					y: slot.height - height,
					width: slot.width,
					height
				};
			})
			.filter((bar): bar is BarData & { x: number; y: number; width: number; height: number } => Boolean(bar))
	);
</script>

<style>
	.machineRoot {
		position: relative;
		width: 600px;
		height: 380px;
		margin: 0 auto;
	}

	.shellLayer,
	.dynamicLayer {
		position: absolute;
		inset: 0;
	}

	.chartShell,
	.plotSurface,
	.gridFrame,
	.gridLine,
	.goodPartsFrame,
	.scrapPartsFrame,
	.dynamicShell,
	.dynamicBorders,
	.barBorder,
	.valueBorder,
	.bar,
	.values,
	.oeeValue,
	.oeeNumber,
	.oeePercent,
	.goodPartsValue,
	.scrapPartsValue,
	.machineLabel,
	.partNoLabel,
	.labels,
	.plotFrame,
	.grid,
	.bars {
		position: absolute;
		box-sizing: border-box;
	}

	.chartShell {
		background: #202020;
		border-style: solid;
		border-color: #4a4a4a;
	}

	.plotSurface {
		background: #2b2b2b;
		border-style: solid;
		border-color: #4a4a4a;
	}

	.machineLabel,
	.partNoLabel {
		color: #ffffff;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: 700;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
	}

	.gridFrame {
		background: #000000;
		border-style: solid;
		border-color: #4a4a4a;
	}

	.gridLine {
		left: 0;
		width: 242.01px;
		height: 0;
		border-top: 1px solid #666666;
		opacity: 0.9;
	}

	.goodPartsFrame,
	.scrapPartsFrame {
		background: #000000;
		border-style: solid;
	}

	.goodPartsFrame {
		border-color: #00cc33;
	}

	.scrapPartsFrame {
		border-color: #ff2b2b;
	}

	.barBorder,
	.valueBorder {
		background: transparent;
		border-style: solid;
	}

	.bars {
		overflow: hidden;
	}

	.bar {
		border-radius: 3.33px 3.33px 3.33px 3.33px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
		transition:
			height 200ms ease,
			top 200ms ease;
	}

	.goodPartsValue,
	.scrapPartsValue {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 30px;
		font-weight: 700;
		line-height: 1;
	}

	.values {
		color: #4a4a4a;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: 700;
	}

	.oeeValue {
		color: var(--threshold-color);
	}

	.oeeNumber,
	.oeePercent {
		position: absolute;
		text-align: center;
		line-height: 1;
	}

	.oeeNumber {
		left: 0;
		top: 0;
		font-size: 34px;
	}

	.oeePercent {
		left: 38px;
		top: 9px;
		font-size: 24px;
	}

	.goodPartsValue {
		color: var(--chart-accent-good, #3cff3c);
		font-size: 34px;
	}

	.scrapPartsValue {
		color: var(--chart-threshold-bad, #ff2b2b);
		font-size: 34px;
	}
</style>

<div
	class="machineRoot"
	role="img"
	aria-label={`${title} machine card for part ${partNo} with ${goodCount} good parts and ${scrapCount} scrap parts`}
>
	<div class="shellLayer" aria-hidden="true">
		<div class="chartShell" style={frameStyle(layout.staticShell.chartShell)}></div>

		<div class="plotFrame" style={rectStyle(layout.staticShell.plotFrame)}>
			<div class="plotSurface" style={frameStyle(layout.staticShell.plotSurface)}></div>
		</div>

		<div class="labels" style={rectStyle(layout.staticShell.labels.frame)}>
			<div
				class="machineLabel"
				style={`left:${layout.staticShell.labels.machine.x - layout.staticShell.labels.frame.x}px;top:${layout.staticShell.labels.machine.y}px;width:${layout.staticShell.labels.machine.width}px;font-size:${layout.staticShell.labels.machine.fontSize}px;`}
			>
				{title}
			</div>
			<div
				class="partNoLabel"
				style={`left:${layout.staticShell.labels.partNo.x}px;top:${layout.staticShell.labels.partNo.y}px;width:${layout.staticShell.labels.frame.width - layout.staticShell.labels.partNo.x}px;font-size:${layout.staticShell.labels.partNo.fontSize}px;`}
			>
				{partNo}
			</div>
		</div>

		<div class="gridFrame" style={frameStyle(layout.staticShell.gridFrame)}></div>
		<div class="grid" style={rectStyle(layout.staticShell.grid.frame)}>
			{#each layout.staticShell.grid.lineYs as y}
				<div class="gridLine" style={`top:${y}px;`}></div>
			{/each}
		</div>

		<div class="goodPartsFrame" style={frameStyle(layout.staticShell.goodPartsFrame)}></div>
		<div class="scrapPartsFrame" style={frameStyle(layout.staticShell.scrapPartsFrame)}></div>
	</div>

	<div class="dynamicLayer dynamicShell" style={rectStyle(layout.dynamicShell.frame)}>
		<div class="dynamicBorders" style={rectStyle(layout.dynamicShell.borders.frame)}>
			<div class="barBorder" style={`${frameStyle(layout.dynamicShell.borders.barBorder)}border-color:${thresholdColor};`}></div>
			<div class="valueBorder" style={`${frameStyle(layout.dynamicShell.borders.valueBorder)}border-color:${thresholdColor};`}></div>
		</div>

		<div class="values" style={rectStyle(layout.dynamicShell.values.frame)}>
			<div class="oeeValue" style={rectStyle(layout.dynamicShell.values.oeeValue)}>
				<div
					class="oeeNumber"
					style={`font-size:${layout.dynamicShell.values.numberFontSize}px;color:${thresholdColor};`}
				>
					{valueText(oeeValue)}
				</div>
				<div
					class="oeePercent"
					style={`left:${layout.dynamicShell.values.percentOffsetX}px;top:${layout.dynamicShell.values.percentOffsetY}px;font-size:${layout.dynamicShell.values.percentFontSize}px;color:${thresholdColor};`}
				>
					%
				</div>
			</div>

			<div class="goodPartsValue" style={rectStyle(layout.dynamicShell.values.goodPartsCount)}>
				{valueText(goodCount)}
			</div>
			<div class="scrapPartsValue" style={rectStyle(layout.dynamicShell.values.scrapPartsCount)}>
				{valueText(scrapCount)}
			</div>
		</div>

		<div class="bars" style={rectStyle(layout.dynamicShell.bars.frame)}>
			{#each bars as bar}
				<div
					class="bar"
					title={`${bar.label}: ${bar.value}%`}
					style={`left:${bar.x}px;top:${bar.y}px;width:${bar.width}px;height:${bar.height}px;background:linear-gradient(90deg, ${bar.c1} 0%, ${bar.c2} 100%);`}
				></div>
			{/each}
		</div>
	</div>
</div>
