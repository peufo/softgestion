<script>
	import { paths, masters, masterSelected, copies, backups, view } from './stores.js'
	import { slide } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let search = ''

	$: console.log(search)

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
			if ($masters.indexOf(folderName) != -1){
				alert(`Désolé, le dossier "${folderName}" éxiste déjà !\nVous ne pouvez pas l'écraser !`)
			}else{

				formData.append('folderName', folderName)

				fetch('masters', {
					method: 'POST',
					body: formData
				})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						$masters = [folderName, ...$masters]
						$backups = [data.backup, ...$backups]
					}else{
						alert(data.message)
					}
				})

			}				
		}
	}

	function selectMaster(master) {
		$masterSelected = master
		if ($view == 'backups') showBackups(master)
		else showCopies(master)
	}

	function showCopies(master) {
		$view = 'copies'
		$copies = $copies.map(copy => {
			if (copy.name == master) copy.hide = false
			else copy.hide = true
			return copy
		})
	}

	function showBackups(master) {
		$view = 'backups'
		$backups = $backups.map(backup => {
			if (backup.name == master) backup.hide = false
			else backup.hide = true
			return backup
		})
	}


</script>

<style>
	i {cursor: pointer;}
	i:hover {transform: scale(1.1);}

	li span { display: none;}
	li:hover span {display: block;}
	li {cursor: pointer;}
	i:hover {transform: scale(1.2);}
	.selected {
		border-left: 5px solid grey;
	}

</style>

<div>
	<span class="w3-xlarge">
	  	<i on:click="{openSelectFolder}" class="far fa-clipboard"></i>
	  	Masters
	</span>

	<ul class="w3-ul">
		{#each $masters as master}

			<li class:w3-hide="{master.toLowerCase().indexOf(search) == -1}" 
				on:click="{() => selectMaster(master)}" 
				class:selected="{$masterSelected == master}" 
				transition:slide>
				<b>{master}</b>
				<span class="w3-right">
					<a href="{$paths.master}/{name}">
						<i class="far fa-folder-open"></i>
					</a>&nbsp;&nbsp;
					<i class="far fa-copy"		on:click="{() => showCopies(master)}"	></i>&nbsp;&nbsp;
					<i class="fas fa-history"	on:click="{() => showBackups(master)}"></i>&nbsp;&nbsp;
					<i class="fas fa-download" 	on:click="{() => dispatch('clickdownload')}"></i>
				</span>
			</li>


		{:else}
			<div class="w3-center w3-xlarge w3-spin"><i class="fas fa-sync-alt"></i></div>
		{/each}
	</ul> 

	<!--  Sélection du dossier à importer  -->
	<form enctype="multipart/form-data">
    	<input on:change="{newMaster}" id="selectfolder" name="selectfolder" type="file" webkitdirectory directory multiple class="w3-hide"/>
	</form>

</div>