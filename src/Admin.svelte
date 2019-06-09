<script>
	import { paths, pulls, copies } from './stores.js'
	import { slide } from 'svelte/transition'

	let tab = 0

	//Gestion des modifications
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
	}

	//Gestion des copies
	const DAY = 1000*60*60*24
	let daysLimite = -365
	let copiesRemoved = []
	$: copiesRemoved = $copies.filter(copy => copy.time < new Date().getTime() + daysLimite * DAY)

	function toggleUnselectCopy(i) {
		copiesRemoved[i].unselect = !copiesRemoved[i].unselect
	}

	function removeCopies() {
		let copiesRemovedConfirmed = copiesRemoved.filter(copy => !copy.unselect)
		if (confirm(`Etes-vous certain de vouloir supprimer tous les éléments séléctionés ?`)) {
			Promise.all(copiesRemovedConfirmed.map(copy => {
				return fetch(`copies/${copy.section}/${copy.name}/remove`, {
					method: 'POST',
					headers: {"Content-Type": "application/json"}
				})
			}))
			.then(() => {
				let crcTimes = copiesRemovedConfirmed.map(c => c.time)
				$copies = $copies.filter(copy => crcTimes.indexOf(copy.time) == -1)
			})
			.catch(() => {
				alert('Erreur')
			})
		}
	}


	//Gestion des chemins
	function savePaths() {
		fetch('paths', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify($paths)
		}).then(res => {
			if (res.ok) alert('Mise à jour réussie !')
			else alert('Mise à jour impossible !')
		})
	}


	//Mot de passe
	let pwd = ''
	let newpwd = ''
	let newpwdConfirm = ''
	let unlock = false
	unlockAdmin()

	function changePwd() {
		fetch('pwd', {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({oldpwd: pwd, newpwd})
		})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				alert('Mot de passe changé !')
				pwd = newpwd = newpwdConfirm = ''
			}else alert('Mot de passe invalide')
		})
	}

	function unlockAdmin() {
		fetch(`checkpwd`, {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({pwd})
		})
		.then(res => res.json())
		.then(data => {
			pwd = ''
			if (data.success) {
				unlock = true
			}else{
				alert('Mot de passe invalide !')
			}
		})
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

	a {
		text-decoration: none;
	}

	#menu li, #copies li i {
		cursor: pointer;
	}

	#editPlace.fullheight {
		height: calc(100% - 100px);
	}

	#editPlace .content{
		height: 100%;
	}

	#pulls {
		max-height: calc(100% - 72px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	#copies {
		max-height: calc(100% - 180px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	#copies li i:hover {
		transform: scale(1.1);
	}

	.selected {
		border-left: solid 5px grey;
	}

	.pathinput{
		width: 90%;
		margin-left: 35px;
	}

	.pwd {
		width: 70%;
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

	#navButton i:hover {
		transform: rotate(-10deg);
	}
</style>


<div class="w3-display-container" style="height: 100%">
	<h1><em>SoftGestion</em> (╭ರ_•́) <span class="w3-small">alpha</span></h1>

{#if unlock}

	<!-- Menu de navigation -->
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
			<li on:click="{() => tab = 3}" class:selected="{tab == 3}">
				<i class="fas fa-unlock-alt"></i>
				Mot de passe
			</li>
		</ul>		
	</div>

	<!-- Place d'édition -->
	<div id="editPlace" class:fullheight="{tab < 2}" class="w3-col m7 w3-border w3-padding w3-margin w3-round w3-card">
		

		<!--GESTION DES MODIFICATIONS-->
		<div class:w3-hide="{tab != 0}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="fas fa-clipboard-check"></i>
				Gestion des modifications
			</span><br>

				{#if $pulls.length == 0}
					<span class="w3-large">
						Aucune validation en attente
						<i class="fa fa-check"></i>
					</span>
				{:else if $pulls.length == 1}
					<span class="w3-small">Une modification en attente</span>
				{:else}
					<span class="w3-small">{$pulls.length} modifications en attentes</span>
				{/if}
			<br><br>

			<ul id="pulls" class="w3-ul">
				{#each $pulls as pull (pull.time)}

					<li transition:slide>
						<i on:click="{() => acceptPull(pull)}"  class="acceptpull fas fa-check w3-xlarge w3-right w3-button w3-round"></i>
						<i on:click="{() => removePull(pull)}" class="removepull fas fa-times w3-xlarge w3-right w3-button w3-round"></i>	
						<a href="{pull.path}">
							<b>{pull.log}</b><br>
							<span class="w3-large">{pull.pull}</span>
							<span class="w3-small w3-opacity">{new Date(pull.time).toLocaleString()}</span>
						</a>
					</li>

				{/each}
			</ul>
		</div>


		<!--GESTION DES COPIES-->
		<div class:w3-hide="{tab != 1}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="far fa-copy"></i>
				Gestion des copies
			</span><br>
			
			{#if $copies.length == 0}
				<span class="w3-large">
					Aucune copie en circulation !
					<i class="fa fa-check"></i>
				</span>	
			{:else }

				<!-- Selection de la limite -->
				<div class="w3-border w3-round w3-padding">

					{#if daysLimite == 0}
						<h3>Toutes les copies</h3>
					{:else}
						<h3>Copies datant de plus de {-daysLimite} jours</h3>
					{/if}

					<input bind:value={daysLimite} type="range" name="daysLimite" min="-360" max="0" step="10">

					{#if copiesRemoved.filter(copy => !copy.unselect).length}
						<span on:click={removeCopies} class="w3-button w3-border w3-round w3-large w3-right w3-red">
							<i class="far fa-trash-alt"></i>
							Supprimer la sélection ({copiesRemoved.filter(copy => !copy.unselect).length})
						</span>
					{/if}

				</div>

				<ul id="copies" class="w3-ul w3-margin">
					{#each copiesRemoved as copy, i}
						<li transition:slide class:w3-opacity={copy.unselect}>
							<span class="w3-left w3-xlarge fa-stack">
								<i on:click="{() => toggleUnselectCopy(i)}" class="far fa-trash-alt fa-stack-1x"></i>
								{#if copy.unselect}
									<i on:click="{() => toggleUnselectCopy(i)}" class="fa fa-ban fa-stack-2x"></i>
								{/if}
							</span>
							<div>
								<em class="w3-right log">{copy.section}</em>
								<a href="{copy.path}">								
									<b>{copy.log.replace('Copie pour ', '')}</b><br>
									<span class="w3-large">{copy.name}</span>
									<span class="w3-small w3-opacity">{new Date(copy.time).toLocaleString()}</span>
								</a>	
							</div>
						</li>
					{:else}
						<span class="w3-large">
							Pas de copie aussi ancienne !
							<i class="fa fa-check"></i>
						</span>
					{/each}
				</ul>



			{/if} 
		</div>


		<!--GESTION DES CHEMINS-->
		<div class:w3-hide="{tab != 2}" class="content w3-padding">

			<span class="w3-xlarge">
				<i class="far fa-folder-open"></i>
				Gestion des chemins
			</span><br><br><br>

			<i class="far fa-clipboard w3-xlarge w3-left"></i>
			<input 
				bind:value={$paths.master} 
				type="text" 
				class="pathinput w3-input"
				placeholder="Votre répertoire ../MASTER">
			<br><br>

			<i class="far fa-copy w3-xlarge w3-left"></i>
			<input 
				bind:value={$paths.copy} 
				type="text" 
				class="pathinput w3-input"
				placeholder="Votre répertoire ../COPY">
			<br><br>

			<i class="fas fa-clipboard-check w3-xlarge w3-left"></i>
			<input 
				bind:value={$paths.pull} 
				type="text" 
				class="pathinput w3-input"
				placeholder="Votre répertoire ../PULL">
			<br><br>

			<i class="fas fa-history w3-xlarge w3-left"></i>
			<input 
				bind:value={$paths.backup}
				type="text"
				class="pathinput w3-input"
				placeholder="Votre répertoire ../BACKUP" >
			<br><br>

			<input 
				on:click={savePaths}
				type="submit"
				value="Sauvegarder"
				class="w3-button w3-right w3-border w3-round"
				class:w3-disabled="{$paths.master == '' || $paths.copy == '' || $paths.pull == '' || $paths.backup == ''}" >
		</div>

		<!--Mot de passe-->
		<div class:w3-hide="{tab != 3}" class="content w3-padding">
			<span class="w3-xlarge">
				<i class="fas fa-unlock-alt"></i>
				Mot de passe
			</span><br><br><br>


			<i class="fa fa-key w3-xlarge w3-left"></i>
			<input 
				bind:value={pwd}
				type="password"
				class="w3-input pwd"
				placeholder="Mot de passe actuel" >

			<i class="fa fa-key w3-xlarge w3-left"></i>
			<input 
				bind:value={newpwd}
				type="password"
				class="w3-input pwd"
				placeholder="Votre nouveau mot de passe" >

			<i class="fa fa-key w3-xlarge w3-left"></i>
			<input 
				bind:value={newpwdConfirm}
				type="password"
				class="w3-input pwd"
				placeholder="Confimation nouveau mot de passe" >

			<br>

			<input
				class:w3-disabled="{newpwd != newpwdConfirm}"
				on:click={changePwd}
				type="submit"
				value="Sauvegarder"
				class="w3-button w3-right w3-border w3-round">
			<br>
			<br>

			<div class="w3-panel w3-pale-red w3-leftbar w3-border-red">
				<p>Attention ! Ce mot de passe est enregistré en clair dans le répertoire de l'application. Vous pourrez donc le retrouver en cas de perte à l'addresse suivante: <em>../softgestion/data/password</em></p>
			</div>
		</div>
	</div>


{:else}

	<div class="w3-display-middle" style="width: 400px;">
		<i class="fa fa-unlock-alt w3-xxlarge w3-left"></i>
		<input 
			on:keyup="{e => e.which == 13 && unlockAdmin()}"
			bind:value={pwd}
			type="password"
			class="w3-input pwd"
			placeholder="Mot de passe">
	</div>

{/if}

	<span id="navButton" class="w3-xlarge w3-display-bottomleft w3-margin">
	  	<a href="/"><i class="fas fa-home"></i></a>
	  	<a href="/help"><i class="far fa-question-circle"></i></a>	
	</span>
</div>
