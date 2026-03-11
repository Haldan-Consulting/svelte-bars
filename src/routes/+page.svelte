<script lang="ts">

	import BarChart from '$lib/components/BarChart.svelte'
	import { factoryData } from '$lib/stores/factory'
	
	
	function simulateMachine(){
	
	  factoryData.set({
	
		availability: Math.floor(Math.random()*20)+80,
		performance: Math.floor(Math.random()*20)+75,
		quality: Math.floor(Math.random()*10)+90
	
	  })
	
	}
	
	// subscribe to store
	$: ({ availability, performance, quality } = $factoryData)
	
	// calculate OEE
	$: oee = Math.round((availability/100)*(performance/100)*(quality/100)*100)
	
	// build chart data
	$: chartData = [
	
	 {label:"Availability", value:availability, c1:"#ffe600", c2:"#f9f200"},
	 {label:"Performance", value:performance, c1:"#0d4fa3", c2:"#3d7ad6"},
	 {label:"Quality", value:quality, c1:"#c40000", c2:"#ff2b2b"},
	 {label:"OEE", value:oee, c1:"#00a800", c2:"#3cff3c"}
	
	]
	
	</script>
	
	<style>
	
	.page{
	
		background:#454545;
		min-height:100vh;
		padding:40px;
	
		display:flex;
		flex-direction:column;
		align-items:center;
	
		font-family:Arial;
		color:white;
	
	}
	
	button{
	
		margin-bottom:20px;
		padding:10px 20px;
		font-size:16px;
		cursor:pointer;
	
	}
	
	</style>
	
	
	<div class="page">
	
	<button on:click={simulateMachine}>
		Update Values
	</button>
	
	<BarChart data={chartData}/>
	
	</div>