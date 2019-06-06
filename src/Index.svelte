<script>
	import Masters from './Masters.svelte'
	import Copies from './Copies.svelte'
	import { masterSelected, copies, sections } from './stores.js'

	let openedSectionChoice = false
	function toggleSectionChoice() {
		openedSectionChoice = !openedSectionChoice
	}

	let searchSection = ''
	let canCreateSection = false
	$: canCreateSection = $sections.filter(s => s.indexOf(searchSection) != -1).length == 0

	function createSection() {
		fetch('copies/sections', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({section: searchSection})
		})
		.then(res => res.json)
		.then(data => {
			if (data.success) {
				sections.update(s => [searchSection, ...s])
			}else alert(data.message)
		})
	}

</script>

<style>
	.openedSectionChoice {
		display: block;
	}
	.fa-cog:hover {
		transform: rotate(10deg);
	}
	.clickable {cursor: pointer;}
	i.clickable:hover {transform: scale(1.2);}
	div.clickable:hover {transform: scale(1.1);}
	li.clickable:hover {border-left: solid 3px grey;}
	.hidden {display: none;}
</style>

<div>
	<h1>Gestionnaire de programmes</h1>
	<input type="search" name="search" placeholder="Recherche" class="w3-input m7 w3-col">

  	<div class="w3-row" style="height: calc(100% - 48px);">

		<div class="w3-col w3-padding m3">
  			<Masters
  				on:clickdownload={toggleSectionChoice}
  			/>
  		</div>

		<div class="w3-col w3-padding m4">
			<Copies/>
		</div>


  		<!--
  		<div class="w3-col w3-padding m4">
  	 		<span class="w3-xlarge">
          		<i class="toogleList far fa-copy"></i>
          		<i class="toogleList far fa-history w3-hide"></i>
          		<span id="listTitle">Copies</span>
        	</span>
  			<ul id="copies" class="w3-ul"></ul> 			
        	<ul id="backups" class="w3-ul w3-hide"></ul>       
  		</div>
		-->
  		<div id="viewer" class="w3-col m5" style="height: calc(100% - 33px)">
        <object title="pdfViewer" id="pdfViewer" width="100%" height="100%" data=""></object> 
      </div>
  	</div>


  	<!--  Fenetre de choix de la section pour les copies  -->
	<div class="w3-modal" class:openedSectionChoice>
		<div class="w3-modal-content w3-round" style="max-width: 280px;">
			<div class="w3-large w3-padding">
				Choisir une section
				<i on:click="{toggleSectionChoice}" class="clickable fas fa-times w3-right"></i>
			</div>
			<input bind:value={searchSection} type="text" placeholder="Recherche" class="w3-input">

			<ul class="w3-ul">
				{#each $sections as section}
					<li class:hidden="{section.indexOf(searchSection) == -1}" class="clickable">{section}</li>
				{/each}
			</ul>

			<div 
				class:hidden="{!canCreateSection}"
				class="clickable w3-padding w3-center"
				on:click={createSection}
			>
				<i class="fas fa-plus"></i> Nouvelle section
			</div>

		</div>
	</div>


    <a href="/admin">
      	<i class="fas fa-cog w3-xlarge w3-display-bottomleft w3-margin"></i>
    </a>
</div>