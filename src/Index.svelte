<script>
	import Masters from './Masters.svelte'
	import Copies from './Copies.svelte'
  import Backups from './Backups.svelte'
	import Section from './Sections.svelte'
	import { masters, copies, sections, view } from './stores.js'

  let search = ''

	let sectionChoiceOpen = false
	let searchSection = ''
	function sectionChoiceOpenForce() {
		sectionChoiceOpen = false
		sectionChoiceOpen = true
	}

</script>

<style>

	.fa-cog:hover {
		transform: rotate(10deg);
	}

</style>

<div>
	<h1>Gestionnaire de programmes</h1>
	<input bind:value={search} type="search" name="search" placeholder="Recherche" class="w3-input m7 w3-col">

	<div class="w3-row" style="height: calc(100% - 48px);">

	<div class="w3-col w3-padding m3">
			<Masters
        search={search.toLowerCase()}
				on:clickdownload="{sectionChoiceOpenForce}"
			/>
		</div>
  {#if $view == 'copies'}
		<div class="w3-col w3-padding m4">
			<Copies/>
		</div>    
  {:else if $view == 'backups'}
    <div class="w3-col w3-padding m4">
      <Backups/>
    </div>
  {/if}
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

	<Section visible={sectionChoiceOpen} search={searchSection}/>

  <a href="/admin">
    	<i class="fas fa-cog w3-xlarge w3-display-bottomleft w3-margin"></i>
  </a>
</div>