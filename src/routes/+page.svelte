<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import ChartJsBarChart from '$lib/components/ChartJsBarChart.svelte';
	import { factoryData } from '$lib/stores/factory';
	
	
	function simulateMachine() {
		factoryData.set({
			availability: Math.floor(Math.random() * 20) + 80,
			performance: Math.floor(Math.random() * 20) + 75,
			quality: Math.floor(Math.random() * 10) + 90
		});
	}

	// subscribe to store
	$: ({ availability, performance, quality } = $factoryData);

	// calculate OEE
	$: oee = Math.round((availability / 100) * (performance / 100) * (quality / 100) * 100);

	// build chart data
	$: chartData = [
		{ label: 'Availability', value: availability, c1: '#ffe600', c2: '#f9f200' },
		{ label: 'Performance', value: performance, c1: '#0d4fa3', c2: '#3d7ad6' },
		{ label: 'Quality', value: quality, c1: '#c40000', c2: '#ff2b2b' },
		{ label: 'OEE', value: oee, c1: '#00a800', c2: '#3cff3c' }
	];
</script>

<style>
	.page {
		background: linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%);
		min-height:100vh;
		padding:clamp(16px, 4vw, 40px);
		box-sizing:border-box;
		display:flex;
		flex-direction:column;
		align-items:center;
		font-family:Arial;
		color:white;
	}

	.content {
		width: min(1280px, 100%);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	h1 {
		margin: 0;
		font-size: clamp(32px, 5vw, 48px);
	}

	.subtitle {
		margin: 0;
		max-width: 70ch;
		color: #e3e3e3;
	}

	button {
		align-self: flex-start;
		padding: 10px 20px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		border: 0;
		border-radius: 999px;
		background: #f9f200;
		color: #171717;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 24px;
		align-items: start;
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
		background: rgba(12, 12, 12, 0.28);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 18px;
		backdrop-filter: blur(8px);
	}

	.panel h2 {
		margin: 0;
		font-size: 24px;
	}

	.panel p {
		margin: 0;
		color: #d7d7d7;
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.panel {
			padding: 16px;
		}
	}
</style>

<div class="page">
	<div class="content">
		<div class="header">
			<h1>OEE Bar Chart Comparison</h1>
			<p class="subtitle">
				Both charts use the same simulated factory metrics so you can compare the custom SVG version
				against a Chart.js implementation side by side.
			</p>
			<button on:click={simulateMachine}>
				Update Values
			</button>
		</div>

		<div class="grid">
			<section class="panel">
				<h2>Custom SVG Bars</h2>
				<p>Hand-built layout with fixed bar geometry, value row, and gradient fills.</p>
				<BarChart data={chartData} />
			</section>

			<section class="panel">
				<h2>Chart.js Bars</h2>
				<p>Canvas-rendered bars with the matching metrics, axis scale, and colours.</p>
				<ChartJsBarChart data={chartData} />
			</section>
		</div>
	</div>
</div>
