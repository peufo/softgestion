<script>
	import Masters from './Masters.svelte'
	import Copies from './Copies.svelte'
  	import Backups from './Backups.svelte'
	import Section from './Sections.svelte'
	import { masterSelected, masters, copies, sections, view } from './stores.js'

  	let search = ''

	let sectionChoiceOpen = false
	let searchSection = ''
	function sectionChoiceOpenForce() {
		sectionChoiceOpen = false
		sectionChoiceOpen = true
	}

	let pdfPath = ''
	$: fetch(`masters/${$masterSelected}`)
		.then(res => res.json())
		.then(files => {
			var pdfs = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
			if (pdfs.length > 0) pdfPath = `${$masterSelected}/${pdfs[0]}`
			else pdfPath = ''
		})


</script>

<style>
	#navButton i:hover {
		transform: rotate(15deg);
	}
</style>

<div class="w3-display-container" style="height: 100%">
	<h1><em>SoftGestion</em> ᕕ( ᐛ )ᕗ <span class="w3-small">alpha</span></h1>

	<input bind:value={search} type="search" name="search" placeholder="Recherche" class="w3-input m4 w3-col">

	<div class="w3-row" style="height: calc(100% - 48px);">

		<div class="w3-col w3-padding m3">
			<Masters
	        	search={search.toLowerCase()}
				on:clickdownload="{sectionChoiceOpenForce}"/>
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

		<div id="viewer" class="w3-col m5" style="height: calc(100% - 60px)">
			<object title="pdfViewer" id="pdfViewer" width="100%" height="100%" data="{pdfPath}"></object> 
		</div>
	</div>

	<Section visible={sectionChoiceOpen} search={searchSection}/>

	<span id="navButton" class="w3-xlarge w3-display-bottomleft w3-margin">
		  <a href="/admin"><i class="fas fa-cog"></i></a>
		  <a href="/help"><i class="far fa-question-circle"></i></a>	
	</span>

</div>