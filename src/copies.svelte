<script>
	import { paths, copies, masterSelected } from './stores.js'
	import { slide } from 'svelte/transition'

	function removeCopy(copy) {
		if (confirm(`Etes-vous sur de vouloir supprimer la copie "${copy.name}" ?\n\nLes modifications qui n'ont pas été proposées seront perdues !`)) {
			fetch(`copies/${copy.section}/${copy.name}/remove`, {
				method: 'POST'
			})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					$copies = $copies.filter(c => `${c.section}/${c.name}` != `${copy.section}/${copy.name}`)
				}else{
					alert(data.message)
				}
			})
		}
	}

	function pullCopy(copy) {
		var comment = prompt('Quels sont les changements ?')
		if (comment) {
			fetch(`/copies/${copy.section}/${copy.name}/pull`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({comment})
			})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					alert(`Merci !\n\nVos modifications seront prise en compte dés qu'elles seront validé !` )
					let index = $copies.map(c => `${c.section}/${c.name}`).indexOf(`${copy.section}/${copy.name}`)
					$copies[index].log = comment
				}else{
					alert(data.message)
				}
			})

		}else{
			alert('Vous devez faire un commentaire !')
		}
	}


</script>

<style>
	li .buttons { display: none;}
	li:hover .buttons {display: block;}

	li {cursor: pointer;}
	ul i:hover {transform: scale(1.2);}
</style>


<div>
	<span class="w3-xlarge">
	  	<i class="far fa-copy"></i>
	  	Copies d'{$masterSelected}
	</span>

	<ul class="w3-ul">
		{#each $copies as copy}

			<li on:click in:slide class:w3-hide={copy.hide}>

				<b>{copy.log.replace('Copie pour ', '')}</b>
				<em class="w3-right log">
					{copy.section}
				</em>
				<br>
				{new Date(copy.time).toLocaleString()}

				<span class="w3-right buttons">
					<a href="{$paths.copy}/{copy.section}/{copy.name}">
						<i class="far fa-folder-open"></i>
					</a>&nbsp;&nbsp;
					<i class="far fa-trash-alt" on:click="{() => removeCopy(copy)}"></i>&nbsp;&nbsp;
					<i class="fas fa-upload"  	on:click="{() => pullCopy(copy)}"></i>
				</span>
			</li>

		{:else}
			<div class="w3-center w3-xlarge w3-spin"><i class="fas fa-sync-alt"></i></div>
		{/each}
	</ul>

</div>
