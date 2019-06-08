<script>
	import { paths, pulls } from './stores.js'
	let tab = 0

	function savePaths() {
		fetch('paths', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify($paths)
		}).then(res => res.json())
		.then(data => {
			alert(data.message)
		})
	}

	function removePull(pull) {
		if (confirm('Etes-vous sur de vouloir refuser cette modification ?\nLe dossier en attente de validation sera supprimer !')) {

			fetch(`/pulls/remove/${pull.pull}_${pull.time}`, {method: 'POST'})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					$pulls = $pulls.filter(p => p != pull)
				}else alert(data.message)
			})

		}
	}

	function acceptPull(pull){

		fetch(`/pulls/accept/${pull.pull}_${pull.time}`, {method: 'POST'})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				$pulls = $pulls.filter(p => p != pull)
			}else alert(data.message)
		})
		/*
		$.post(`/pulls/accept/${pull.pull}_${pull.time}`, {}, res => {
			if (res.success) {
				//alert(res.message)
				$(this).parent().remove()
				pulls.splice(index, 1)
				updateValidationNumber()
			}else alert(res.message)
		})
		*/
	}

</script>

<style>	
	html {
		overflow-y: hidden;
	}
	body {
	  padding: 50px;
	  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
	  
	}

	#menu li {
		cursor: pointer;
	}

	#editPlace.fullheight {
		height: calc(100% - 100px);
	}

	#editPlace .content{
		height: calc(100% - 000px) !important;
	}

	#editPlace ul {
		max-height: calc(100% - 72px);
		overflow-y: auto;
	}

	.selected {
		border-left: solid 5px grey;
	}

	.pathinput {
		width: 90%;
		margin-left: 35px;
	}

	.acceptpull {
		border: solid 2px #4CAF50;
		color: #4CAF50;
	}

	.removepull {
		border: solid 2px #F44336;
		color: #F44336;
		margin-right: 20px;
	}

	.fa-home:hover {
		transform: rotate(-10deg);
	}
</style>

<div style="height: 100%">
	<h1>Gestionnaire de programmes <span class="w3-small">Mode admin</span></h1>


	<div class="w3-col m4">
		<ul id="menu" class="w3-ul w3-xlarge">
			<li on:click="{() => tab = 0}" class:selected="{tab == 0}">
				<i class="fas fa-clipboard-check"></i>
				Gestion des modifications			
			</li>
			<li on:click="{() => tab = 1}" class:selected="{tab == 1}">
				<i class="far fa-copy"></i>
				Gestion des copies
			</li>
			<li on:click="{() => tab = 2}" class:selected="{tab == 2}">
				<i class="far fa-folder-open"></i>
				Gestion des chemins
			</li>
		</ul>		
	</div>


	<div id="editPlace" class:fullheight="{tab < 2}" class="w3-col m7 w3-border w3-padding w3-margin w3-round w3-card">
		

		<!--GESTION DES MODIFICATIONS-->
		<div class:w3-hide="{tab != 0}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="fas fa-clipboard-check"></i>
				Gestion des modifications
			</span><br>

			<span class="w3-small">
				{#if $pulls.length == 0}
					Pas de validation en attente
				{:else if $pulls.length == 1}
					Une modification en attente
				{:else}
					{$pulls.length} modifications en attentes
				{/if}
			</span>
			<br><br>

			<ul id="pulls" class="w3-ul">
				{#each $pulls as pull}
					<li>
						<span class="w3-large">{pull.pull}</span>
						<span class="w3-small w3-opacity">{new Date(pull.time).toLocaleString()}</span>
						<i on:click="{() => acceptPull(pull)}"  class="acceptpull fas fa-check w3-xlarge w3-right w3-button w3-round"></i>
						<i on:click="{() => removePull(pull)}" class="removepull fas fa-times w3-xlarge w3-right w3-button w3-round"></i>					
						<br><span>{pull.log.replace('->', '- ')}</span>
					</li>
				{/each}
			</ul>
			
		</div>


		<!--GESTION DES COPIES-->
		<div class:w3-hide="{tab != 1}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="far fa-copy"></i>
				Gestion des copies
			</span><br><br><br>
			Gestion des copies

		</div>


		<!--GESTION DES CHEMINS-->
		<div class:w3-hide="{tab != 2}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="far fa-folder-open"></i>
				Gestion des chemins
			</span><br><br><br>

			<i class="far fa-clipboard w3-xlarge w3-left"></i>
			<input bind:value={$paths.master} type="text" class="pathinput w3-input"><br><br>

			<i class="far fa-copy w3-xlarge w3-left"></i>
			<input bind:value={$paths.copy} type="text" class="pathinput w3-input"><br><br>

			<i class="fas fa-clipboard-check w3-xlarge w3-left"></i>
			<input bind:value={$paths.pull} type="text" class="pathinput w3-input"><br><br>

			<i class="fas fa-history w3-xlarge w3-left"></i>
			<input bind:value={$paths.backup} type="text" class="pathinput w3-input"><br><br>

			<input on:click={savePaths} type="submit" value="Sauvegarder" class="w3-button w3-right w3-border w3-round">
		</div>

	</div>

    <a href="/">
      <i class="fas fa-home w3-xlarge w3-display-bottomleft w3-margin"></i>
    </a>
</div>