<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Chart } from 'chart.js';
	import type { BarData } from '$lib/types';
	import { getThresholdColor } from '$lib/utils/chartTheme';

	let { data = [] }: { data?: BarData[] } = $props();

	// Glossary:
	// - chartShell: outer component card
	// - chartCanvas: fixed-height mount point for Chart.js
	// - syncChart: create/update lifecycle for the Chart.js instance
	// - valueRow: numeric summary row below the canvas

	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chart: Chart<'bar'> | null = null;
	let ChartJS: (typeof import('chart.js/auto'))['default'] | null = null;
	const oeeValue = $derived(data.find((item) => item.label === 'OEE')?.value ?? 0);
	const valueRowBorder = $derived(getThresholdColor(oeeValue));

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

	$effect(() => {
		if (browser && canvas && ChartJS) {
			data;
			syncChart();
		}
	});
</script>

<style>
	.chartShell {
		--chart-value-row-offset: 14px;
		--chart-value-row-border: var(--value-row-border);
		min-height: 420px;
	}

	/* chartCanvas: controls the visible plot height for the Chart.js canvas. */
	.chartCanvas {
		position: relative;
		height: 388px;
	}

	.value {
		align-items: baseline;
	}
</style>

<div class="chartSystem chartShell" style={`--value-row-border:${valueRowBorder}`}>
	{#if data.length}
		<div class="chartCanvas">
			<canvas bind:this={canvas} aria-label="Chart.js bar chart comparison"></canvas>
		</div>
		<div class="valueRowFrame">
			<div class="valueRow" style={`--count:${data.length}`}>
				{#each data as item}
					<div class="value" style={`color:${item.c2}`}>
						<span>{item.value}</span>
						<span class="percent">%</span>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="emptyState">No chart data available.</p>
	{/if}
</div>
