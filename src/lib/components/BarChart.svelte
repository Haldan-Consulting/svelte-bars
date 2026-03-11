<script lang="ts">
	type BarData = {
		label: string;
		value: number;
		c1: string;
		c2: string;
	};

	export let data: BarData[] = [];

	const height = 260;
	const barWidth = 160;
	const gap = 80;
	const max = 100;

	$: width = data.length * barWidth + (data.length - 1) * gap;
</script>

<style>
	.chart {
		position: relative;
	}

	svg {
		display: block;
		overflow: visible;
	}

	.bar-shape {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6));
		transform-box: fill-box;
		transform-origin: center bottom;
		transition: transform 0.5s ease;
	}

	.valueRow {
		position: relative;
		background: #2b2b2b;
		border: 2px solid #00cc33;
		border-radius: 10px;
		height: 120px;
		margin-top: 20px;
	}

	.value {
		position: absolute;
		text-align: center;
		font-size: 64px;
		font-weight: bold;
		line-height: 120px;
	}

	.labelBox {
		fill: #2b2b2b;
	}
</style>

<div class="chart" style={`width:${width}px`}>
	<svg {width} height={height}>
		{#each [25, 50, 75, 100] as g}
			<line
				x1="0"
				x2={width}
				y1={height - (g / max) * height}
				y2={height - (g / max) * height}
				stroke="#666"
			/>
		{/each}

		{#each data as m, i}
			<defs>
				<linearGradient id={"grad" + i} x1="0%" x2="100%">
					<stop offset="0%" stop-color={m.c1} />
					<stop offset="100%" stop-color={m.c2} />
				</linearGradient>
			</defs>

			<!-- fixed-height bar that scales from the bottom -->
			<g transform={`translate(${i * (barWidth + gap)}, 0)`}>
				<rect
					class="bar-shape"
					x="0"
					y="0"
					width={barWidth}
					height={height}
					rx="12"
					fill={"url(#grad" + i + ")"}
					style={`transform: scaleY(${m.value / max});`}
				/>
			</g>

			<rect
				class="labelBox"
				x={i * (barWidth + gap) + 40}
				y={height - 20}
				width="80"
				height="24"
				rx="4"
			/>

			<text
				x={i * (barWidth + gap) + 80}
				y={height - 4}
				text-anchor="middle"
				fill="white"
				font-size="14"
			>
				{m.label}
			</text>
		{/each}
	</svg>

	<div class="valueRow">
		{#each data as m, i}
			<div
				class="value"
				style={`left:${i * (barWidth + gap)}px;width:${barWidth}px;color:${m.c2}`}
			>
				{m.value} %
			</div>
		{/each}
	</div>
</div>