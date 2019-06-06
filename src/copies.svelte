<script>
	import Copy from './copy.svelte'
	import { copies } from './stores.js'
</script>

<style>

</style>

<div>
	<span class="w3-xlarge">
	  	<i class="far fa-copy"></i>
	  	Copies
	</span>

	<ul class="w3-ul">
		{#each $copies as copy}
			<Copy {...copy}/>
		{:else}
			<div class="w3-center w3-xlarge w3-spin"><i class="fas fa-sync-alt"></i></div>
		{/each}
	</ul>

</div>