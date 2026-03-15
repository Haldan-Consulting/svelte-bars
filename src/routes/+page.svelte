<script lang="ts">
	import WeeklyTrend from '$lib/components/WeeklyTrend.svelte';

	let weekNumber = 24;
	let weeklyTrendData = [
		{ label: 'Monday', value: 10, color: '#00cc33' },
		{ label: 'Tuesday', value: 8.5, color: '#00cc33' },
		{ label: 'Wednesday', value: 9.5, color: '#00cc33' },
		{ label: 'Thursday', value: 8, color: '#00cc33' },
		{ label: 'Friday', value: 7.2, color: '#00cc33' },
		{ label: 'Saturday', value: 10, color: '#00cc33' },
		{ label: 'Sunday', value: 10, color: '#00cc33' }
	];

	function simulateTrend() {
		weekNumber = weekNumber >= 52 ? 1 : weekNumber + 1;
		weeklyTrendData = [
			{ label: 'Monday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Tuesday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Wednesday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Thursday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Friday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Saturday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' },
			{ label: 'Sunday', value: Math.round((Math.random() * 3 + 7) * 10) / 10, color: '#00cc33' }
		];
	}
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
		width: 710px;
		max-width: 100%;
	}
</style>

<div class="page">
	<button on:click={simulateTrend}>Update Values</button>
	<div class="chartStage">
		<WeeklyTrend machine="Machine 7" metric="OEE" weekNumber={weekNumber} data={weeklyTrendData} />
	</div>
</div>
