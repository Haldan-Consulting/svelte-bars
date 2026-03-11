<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Chart } from 'chart.js';
	import type { BarData } from '$lib/types';

	export let data: BarData[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart<'bar'> | null = null;
	let ChartJS: (typeof import('chart.js/auto'))['default'] | null = null;

	function syncChart() {
		if (!browser || !canvas || !ChartJS) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		if (!data.length) {
			chart?.destroy();
			chart = null;
			return;
		}

		if (!chart) {
			chart = new ChartJS(context, {
				type: 'bar',
				data: {
					labels: data.map((item) => item.label),
					datasets: [
						{
							label: 'OEE Metrics',
							data: data.map((item) => item.value),
							borderRadius: 12,
							borderSkipped: false,
							barThickness: 72,
							backgroundColor: (ctx) => {
								const item = data[ctx.dataIndex];
								const area = ctx.chart.chartArea;

								if (!item) return '#888';
								if (!area) return item.c2;

								const gradient = ctx.chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
								gradient.addColorStop(0, item.c1);
								gradient.addColorStop(1, item.c2);

								return gradient;
							}
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					animation: {
						duration: 500
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							callbacks: {
								label: (ctx) => `${ctx.parsed.y}%`
							}
						}
					},
					scales: {
						x: {
							grid: {
								display: false
							},
							ticks: {
								color: '#f1f1f1',
								font: {
									size: 14,
									weight: 'bold'
								}
							}
						},
						y: {
							beginAtZero: true,
							max: 100,
							ticks: {
								stepSize: 25,
								color: '#d5d5d5',
								callback: (value) => `${value}%`
							},
							grid: {
								color: 'rgba(255, 255, 255, 0.18)'
							}
						}
					}
				}
			});
			return;
		}

		chart.data.labels = data.map((item) => item.label);
		chart.data.datasets[0].data = data.map((item) => item.value);
		chart.update();
	}

	onMount(() => {
		void import('chart.js/auto').then(({ default: chartModule }) => {
			ChartJS = chartModule;
			syncChart();
		});

		return () => {
			chart?.destroy();
			chart = null;
		};
	});

	$: if (browser && canvas && ChartJS) {
		data;
		syncChart();
	}
</script>

<style>
	.chartShell {
		position: relative;
		width: 100%;
		min-height: 420px;
		padding: 16px;
		box-sizing: border-box;
		background: #202020;
		border: 2px solid #4a4a4a;
		border-radius: 14px;
	}

	.chartCanvas {
		position: relative;
		height: 388px;
	}

	.valueRow {
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		gap: clamp(12px, 2vw, 28px);
		margin-top: 20px;
		padding: 20px 10px;
		box-sizing: border-box;
		background: #2b2b2b;
		border: 2px solid #00cc33;
		border-radius: 10px;
	}

	.value {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.12em;
		min-width: 0;
		font-size: clamp(24px, 4.2vw, 52px);
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
	}
</style>

<div class="chartShell">
	{#if data.length}
		<div class="chartCanvas">
			<canvas bind:this={canvas} aria-label="Chart.js bar chart comparison"></canvas>
		</div>
		<div class="valueRow" style={`--count:${data.length}`}>
			{#each data as item}
				<div class="value" style={`color:${item.c2}`}>
					<span>{item.value}</span>
					<span class="percent">%</span>
				</div>
			{/each}
		</div>
	{:else}
		<p class="emptyState">No chart data available.</p>
	{/if}
</div>
