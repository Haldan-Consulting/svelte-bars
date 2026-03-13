<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
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

	// build bar chart data
	$: barChartData = [
		{ label: 'Availability', value: availability, c1: '#ffe600', c2: '#f9f200' },
		{ label: 'Performance', value: performance, c1: '#0d4fa3', c2: '#3d7ad6' },
		{ label: 'Quality', value: quality, c1: '#c40000', c2: '#ff2b2b' },
		{ label: 'OEE', value: oee, c1: '#00a800', c2: '#3cff3c' }
	];
</script>

<style>
	.page {
		background: linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%);
		min-height: 100vh;
		padding: 32px 16px 48px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		font-family: Arial;
		color: white;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		border: 0;
		border-radius: 999px;
		background: #f9f200;
		color: #171717;
	}

	.chartStage {
		width: 500px;
		max-width: 100%;
	}
</style>

<div class="page">
	<button on:click={simulateMachine}>Update Values</button>
	<div class="chartStage">
		<BarChart data={barChartData} />
	</div>
</div>
