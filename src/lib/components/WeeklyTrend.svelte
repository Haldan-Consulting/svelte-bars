<script lang="ts">
	import { weeklyTrendLayout } from '$lib/components/weeklyTrend.layouts';
	import tennecoLogo from '$lib/assets/tennecologo.png';

	type TrendPoint = {
		label: string;
		value: number;
		color?: string;
	};

	const defaultLogo = tennecoLogo;

	const layout = weeklyTrendLayout;
	const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
	type DayKey = (typeof dayKeys)[number];

	let {
		machine = 'Machine',
		metric = 'Metric',
		weekNumber = 1,
		logoSrc = defaultLogo,
		scaleMax = 10,
		data = []
	}: {
		machine?: string;
		metric?: string;
		weekNumber?: number | string;
		logoSrc?: string;
		scaleMax?: number;
		data?: TrendPoint[];
	} = $props();

	const normalizedWeekNumber = $derived.by(() => {
		const parsed = typeof weekNumber === 'number' ? weekNumber : Number.parseInt(`${weekNumber}`, 10);
		if (Number.isNaN(parsed)) return 1;
		return Math.max(1, Math.min(52, parsed));
	});

	// Glossary:
	// - page: white 710x465 report card shell
	// - plotArea: fixed chart surface and grid geometry from the handoff
	// - yAxisValues: live 1..10 scale labels positioned outside the chart on the left
	// - bars: fixed Monday-Sunday slots whose heights change from live values
	// - trendLine: single regression line spanning the weekly bars

	const rectStyle = (rect: { x: number; y: number; width: number; height: number }) =>
		`left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;`;

	const normalizeDayKey = (label: string): DayKey => {
		switch (label.toLowerCase()) {
			case 'tuesday':
				return 'tuesday';
			case 'wednesday':
				return 'wednesday';
			case 'thursday':
				return 'thursday';
			case 'friday':
				return 'friday';
			case 'saturday':
				return 'saturday';
			case 'sunday':
				return 'sunday';
			default:
				return 'monday';
		}
	};

	const pointsByDay = $derived(
		Object.fromEntries(
			data.map((point) => [
				normalizeDayKey(point.label),
				{
					...point,
					value: Math.max(0, Math.min(scaleMax, point.value))
				}
			])
		) as Partial<Record<DayKey, TrendPoint>>
	);

	const yAxisLabels = $derived(
		layout.dynamicShell.yAxisValues.items.map((item) => ({
			...item,
			label: `${Math.round((item.value / 10) * scaleMax)}`
		}))
	);

	const bars = $derived.by(() =>
		layout.dynamicShell.bars.items.map((slot) => {
			const point = pointsByDay[slot.key as DayKey] ?? { label: slot.key, value: 0, color: '#00cc33' };
			const height = (point.value / scaleMax) * layout.dynamicShell.bars.frame.maxBarHeight;
			return {
				...point,
				x: slot.x,
				width: slot.width,
				height,
				y: layout.dynamicShell.bars.frame.baselineY - height
			};
		})
	);

	const trendLine = $derived.by(() => {
		const frame = layout.dynamicShell.trendLine;
		const barPoints = bars.map((bar) => ({
			x: bar.x + bar.width / 2,
			y: bar.y + 4
		}));

		if (barPoints.length < 2) {
			return { x: frame.x, y: frame.y, width: frame.width, angle: -1 };
		}

		const count = barPoints.length;
		const sumX = barPoints.reduce((total, point) => total + point.x, 0);
		const sumY = barPoints.reduce((total, point) => total + point.y, 0);
		const sumXY = barPoints.reduce((total, point) => total + point.x * point.y, 0);
		const sumXX = barPoints.reduce((total, point) => total + point.x * point.x, 0);
		const slope = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX || 1);
		const intercept = (sumY - slope * sumX) / count;
		const startY = intercept + slope * frame.x;
		const endY = intercept + slope * (frame.x + frame.width);
		const dy = endY - startY;
		return {
			x: frame.x,
			y: startY,
			width: Math.sqrt(frame.width * frame.width + dy * dy),
			angle: (Math.atan2(dy, frame.width) * 180) / Math.PI
		};
	});
</script>

<style>
	.weeklyTrendRoot {
		position: relative;
		width: 710px;
		height: 465px;
		margin: 0 auto;
		background: #ffffff;
		border-radius: 5px;
		overflow: hidden;
	}

	.page,
	.labels,
	.logo,
	.machine,
	.metric,
	.weekLabel,
	.weekNumber,
	.plotArea,
	.plotSurface,
	.gridLine,
	.xAxis,
	.xAxisLine,
	.dayLabel,
	.yAxis,
	.yAxisLine,
	.dynamicShell,
	.yAxisValues,
	.yAxisValue,
	.bars,
	.bar,
	.trendLine {
		position: absolute;
		box-sizing: border-box;
	}

	.page {
		background: #ffffff;
		border-radius: 5px;
	}

	.labels,
	.plotArea,
	.xAxis,
	.yAxis,
	.dynamicShell {
		position: absolute;
	}

	.logo {
		object-fit: contain;
	}

	.machine,
	.metric,
	.weekLabel,
	.weekNumber {
		color: #000000;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 24px;
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
	}

	.machine {
		text-align: center;
	}

	.metric {
		text-align: right;
	}

	.weekLabel,
	.weekNumber {
		text-align: left;
	}

	.plotSurface {
		background: #d9d9d9;
	}

	.gridLine {
		left: 0;
		width: 650px;
		height: 0;
		border-top: 1px solid #666666;
	}

	.xAxisLine,
	.yAxisLine {
		background: #000000;
	}

	.xAxisLine {
		left: 0;
		top: 0;
		width: 650px;
		height: 2px;
	}

	.yAxisLine {
		left: 20px;
		top: 0;
		width: 2px;
		height: 378px;
	}

	.dayLabel,
	.yAxisValue {
		color: #000000;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 14px;
		font-weight: 400;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
	}

	.bars {
		overflow: visible;
	}

	.bar {
		background: #00cc33;
		border-radius: 5px;
		transition:
			height 200ms ease,
			top 200ms ease,
			background-color 200ms ease;
	}

	.trendLine {
		height: 1px;
		border-top: 1px solid #000000;
		transform-origin: top left;
	}
</style>

<div
	class="weeklyTrendRoot"
	role="img"
	aria-label={`Weekly trend for ${machine}, metric ${metric}, week ${normalizedWeekNumber}`}
>
	<div class="page" style={rectStyle(layout.component)}></div>

	<div class="labels" style={rectStyle(layout.staticShell.labels.frame)}>
		<img class="logo" alt="Tenneco" src={logoSrc} style={rectStyle(layout.staticShell.labels.logo)} />
		<div
			class="machine"
			style={`left:${layout.staticShell.labels.machine.x}px;top:${layout.staticShell.labels.machine.y}px;width:${layout.staticShell.labels.machine.width}px;font-size:${layout.staticShell.labels.machine.fontSize}px;`}
		>
			{machine}
		</div>
		<div
			class="metric"
			style={`left:${layout.staticShell.labels.metric.x}px;top:${layout.staticShell.labels.metric.y}px;width:${layout.staticShell.labels.metric.width}px;font-size:${layout.staticShell.labels.metric.fontSize}px;`}
		>
			{metric}
		</div>
		<div
			class="weekLabel"
			style={`left:${layout.staticShell.labels.weekLabel.x}px;top:${layout.staticShell.labels.weekLabel.y}px;width:${layout.staticShell.labels.weekLabel.width}px;font-size:${layout.staticShell.labels.weekLabel.fontSize}px;`}
		>
			Week
		</div>
		<div
			class="weekNumber"
			style={`left:${layout.staticShell.labels.weekNumber.x}px;top:${layout.staticShell.labels.weekNumber.y}px;width:${layout.staticShell.labels.weekNumber.width}px;font-size:${layout.staticShell.labels.weekNumber.fontSize}px;`}
		>
			{normalizedWeekNumber}
		</div>
	</div>

	<div class="plotArea" style={rectStyle(layout.staticShell.plotArea)} aria-hidden="true">
		<div class="plotSurface" style={rectStyle({ x: 0, y: 0, width: layout.staticShell.plotArea.width, height: layout.staticShell.plotArea.height })}></div>
		{#each layout.staticShell.gridLines as line}
			<div class="gridLine" style={`top:${line.y}px;`}></div>
		{/each}
	</div>

	<div class="xAxis" style={rectStyle(layout.staticShell.xAxis.frame)} aria-hidden="true">
		<div class="xAxisLine" style={`top:${layout.staticShell.xAxis.lineY}px;`}></div>
		{#each layout.staticShell.xAxis.days as day}
			<div class="dayLabel" style={`left:${day.x}px;top:${day.y}px;`}>{day.label}</div>
		{/each}
	</div>

	<div class="yAxis" style={rectStyle(layout.staticShell.yAxis)} aria-hidden="true">
		<div
			class="yAxisLine"
			style={`left:${layout.staticShell.yAxis.lineX}px;top:${layout.staticShell.yAxis.lineY}px;height:${layout.staticShell.yAxis.lineLength}px;`}
		></div>
	</div>

	<div class="dynamicShell" style={rectStyle(layout.dynamicShell.frame)}>
		<div class="yAxisValues" style={rectStyle(layout.dynamicShell.yAxisValues.frame)}>
			{#each yAxisLabels as item}
				<div class="yAxisValue" style={`left:${item.x}px;top:${item.y}px;`}>{item.label}</div>
			{/each}
		</div>

		<div class="bars" style={rectStyle(layout.dynamicShell.bars.frame)}>
			{#each bars as bar}
				<div
					class="bar"
					title={`${bar.label}: ${bar.value}`}
					style={`left:${bar.x}px;top:${bar.y}px;width:${bar.width}px;height:${bar.height}px;background:${bar.color ?? '#00cc33'};border-radius:${layout.dynamicShell.bars.frame.radius}px;`}
				></div>
			{/each}
		</div>

		<div
			class="trendLine"
			style={`left:${trendLine.x}px;top:${trendLine.y}px;width:${trendLine.width}px;transform:rotate(${trendLine.angle}deg);`}
		></div>
	</div>
</div>
