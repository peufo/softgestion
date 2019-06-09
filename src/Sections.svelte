<script>
	import { sections, masterSelected, copies } from './stores.js'

	export let visible = false
	export let search = ''

	function toggleVisible() {
		visible = !visible
		if (!visible) search = ''
	}

	let canCreateSection = false
	$: canCreateSection = $sections.filter(s => s.indexOf(search) != -1).length == 0

	function createSection() {
		if (!search.length) {
			alert('Il faut entrer un nom dans le champ de recherche !')
		}else{
			fetch('copies/sections', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({section: search})
			})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					sections.update(s => [search, ...s])
					search = ''
				}else {
					alert(data.message)
				}
			})			
		}
	}

	function createCopy(section) {
		let log = prompt(`Quelle est la raison d'être de cette copie ?`)
		if (log) {
			let copy = { master: $masterSelected, section, log }
			let index = $copies.map(c => `${c.section}/${c.name}`).indexOf(`${copy.section}/${copy.master}`)
			if (index == -1 || confirm(`Cette copie existes déjà à cette emplacement !\nSouhaitez-vous l'écraser ?`)) {
				fetch('copies', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(copy)
				})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						copy.name = copy.master
						copy.time = new Date().getTime()
						if (index == -1 ){
							$copies = [copy, ...$copies]
						}else{
							$copies[index].log = log
						}
					}else {
						alert(data.message)
					}
				})			
			}
		}else{
			alert('Annulé !')
		}
		visible = false
	}

</script>

<style>
	.visible {display: block;}
	.clickable {cursor: pointer;}
	i.clickable:hover {transform: scale(1.2);}
	div.clickable:hover {transform: scale(1.1);}
	li.clickable:hover {border-left: solid 3px grey;}
</style>

<div class="w3-modal" class:visible>
	<div class="w3-modal-content w3-round" style="max-width: 280px;">
		<div class="w3-large w3-padding">
			Choisir une section
			<i on:click="{toggleVisible}" class="clickable fas fa-times w3-right"></i>
		</div>
		<input bind:value={search} type="text" placeholder="Recherche" class="w3-input">

		<ul class="w3-ul">
			{#each $sections as section}
				<li 
					class:w3-hide="{section.indexOf(search) == -1}" 
					class="clickable"
					on:click="{() => createCopy(section)}"
				>{section}</li>
			{/each}
		</ul>

		<div 
			class:w3-hide="{!canCreateSection}"
			class="clickable w3-padding w3-center"
			on:click={createSection}
		>
			<i class="fas fa-plus"></i> Nouvelle section
		</div>

	</div>
</div>