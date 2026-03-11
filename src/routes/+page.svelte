<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import Machine from '$lib/components/Machine.svelte';
	import SvgPieChart from '$lib/components/SvgPieChart.svelte';
	import { factoryData } from '$lib/stores/factory';
	
	
	function simulateMachine() {
		factoryData.set({
			availability: Math.floor(Math.random() * 20) + 80,
			performance: Math.floor(Math.random() * 20) + 75,
			quality: Math.floor(Math.random() * 10) + 90
		});
	}

	function toWholePercentShares(values: number[]) {
		const scaled = values.map((value) => value * 100);
		const floors = scaled.map((value) => Math.floor(value));
		let remainder = 100 - floors.reduce((sum, value) => sum + value, 0);

		const order = scaled
			.map((value, index) => ({ index, fraction: value - floors[index] }))
			.sort((a, b) => b.fraction - a.fraction);

		for (let i = 0; i < remainder; i += 1) {
			floors[order[i % order.length].index] += 1;
		}

		return floors;
	}

	const totalParts = 350;

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

	// Build the pie chart from the OEE loss cascade so the segments represent
	// productive time plus losses as a share of total planned time.
	$: availabilityRatio = availability / 100;
	$: performanceRatio = performance / 100;
	$: qualityRatio = quality / 100;
	$: oeeRatio = availabilityRatio * performanceRatio * qualityRatio;
	$: availabilityLossRatio = 1 - availabilityRatio;
	$: performanceLossRatio = availabilityRatio * (1 - performanceRatio);
	$: qualityLossRatio = availabilityRatio * performanceRatio * (1 - qualityRatio);
	$: [oeeShare, availabilityLoss, performanceLoss, qualityLoss] = toWholePercentShares([
		oeeRatio,
		availabilityLossRatio,
		performanceLossRatio,
		qualityLossRatio
	]);

	$: pieChartData = [
		{ label: 'OEE', value: oeeShare, c1: '#00a800', c2: '#3cff3c' },
		{ label: 'Availability Loss', value: availabilityLoss, c1: '#ffe600', c2: '#f9f200' },
		{ label: 'Performance Loss', value: performanceLoss, c1: '#0d4fa3', c2: '#3d7ad6' },
		{ label: 'Quality Loss', value: qualityLoss, c1: '#c40000', c2: '#ff2b2b' }
	];

	$: scrapCount = Math.round(totalParts * ((100 - quality) / 100));
	$: goodCount = totalParts - scrapCount;
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
			<h1>HaldanMES Cart Components</h1>
			<p class="subtitle">
				Charts use the same simulated factory metrics so you can compare the presentation of the same data.
			</p>
			<button on:click={simulateMachine}>
				Update Values
			</button>
		</div>

		<div class="grid">
			<section class="panel">
				<h2>OEE Bar Chart</h2>
				<p>OEE = Availability x Performance x Quality.</p>
				<BarChart data={barChartData} />
			</section>

			<section class="panel">
				<h2>Losses Pie Chart</h2>
				<p>Pie chart showing OEE alongside availability, performance, and quality losses.</p>
				<SvgPieChart data={pieChartData} />
			</section>

			<section class="panel">
				<h2>Machine Component</h2>
				<p>Machine status card using the same SVG palette, shell, and OEE threshold rules.</p>
				<Machine
					title="Turning Cell 1"
					assetId="V30-A03"
					oee={oee}
					goodCount={goodCount}
					scrapCount={scrapCount}
					data={barChartData}
				/>
			</section>
		</div>
	</div>
</div>
