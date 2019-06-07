<script>
	import Master from './Master.svelte'
	import { masters, masterSelected } from './stores.js'

	function openSelectFolder() {
		document.getElementById('selectfolder').click()
	}

	function newMaster(e) {
		var formData = new FormData(e.target.parentNode)
		var files = Array.from(e.target.files).map(f => f.webkitRelativePath)
		let folderName = prompt('Nom du dossier', files[0].split('/')[0])
		if (folderName) {
			folderName = folderName.replace(/[^a-zA-Z0-9]/g, '')

			//TODO: L'écrasement de fonctionne pas côté serveur!!! le supprimer ?
			if ($masters.indexOf(folderName) == -1 || confirm(`Attention, le dossier ${folderName} existe déjà !\n Etes-vous sur de vouloir l'écraser`)){

				formData.append('folderName', folderName)

				fetch('masters', {
					method: 'POST',
					body: formData
				})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						masters.update(m => [folderName, ...m])
					}else{
						alert(data.message)
					}
				})

			}				
		}
	}

</script>

<style>
	i {cursor: pointer;}
	i:hover {transform: scale(1.1);}
</style>

<div>
	<span class="w3-xlarge">
	  	<i on:click="{openSelectFolder}" class="far fa-clipboard"></i>
	  	Masters
	</span>

	<ul class="w3-ul">
		{#each $masters as master}
			<Master 
				name="{master}"
				on:click="{() => masterSelected.update(ms => ms = master)}"
				selected="{$masterSelected == master}"
				on:clickdownload
			/>
		{:else}
			<div class="w3-center w3-xlarge w3-spin"><i class="fas fa-sync-alt"></i></div>
		{/each}
	</ul> 

	<!--  Sélection du dossier à importer  -->
	<form enctype="multipart/form-data">
    	<input on:change="{newMaster}" id="selectfolder" name="selectfolder" type="file" webkitdirectory directory multiple class="w3-hide"/>
	</form>

</div>