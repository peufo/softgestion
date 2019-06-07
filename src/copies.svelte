<script>
	import Copy from './Copy.svelte'
	import { copies } from './stores.js'


	function removeCopy(copy) {
		if (confirm(`Etes-vous sur de vouloir supprimer la copie "${copy.name}" ?\n\nLes modifications qui n'ont pas été proposées seront perdues !`)) {
			fetch(`copies/${copy.section}/${copy.name}/remove`, {
				method: 'POST'
			})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					copies.update(c => c.filter(c => `${c.section}/${c.name}` != `${copy.section}/${copy.name}`))
				}else{
					alert(data.message)
				}
			})
		}
	}

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
			<Copy 
				{...copy}
				on:clicktrash="{() => removeCopy(copy)}"
			/>
		{:else}
			<div class="w3-center w3-xlarge w3-spin"><i class="fas fa-sync-alt"></i></div>
		{/each}
	</ul>

</div>