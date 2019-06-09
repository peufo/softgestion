<script>
	import { backups, masterSelected } from './stores.js'
	import { slide } from 'svelte/transition'
</script>

<style>
	li .buttons { display: none;}
	li:hover .buttons {display: block;}
	li i:hover {transform: scale(1.2);}
</style>

<div>
	<span class="w3-xlarge">
	  	<i class="fas fa-history"></i>
	  	Historique d'{$masterSelected}
	</span>

	<ul class="w3-ul">
		{#each $backups as backup}
			<li in:slide class:w3-hide={backup.hide}>

				<b>{backup.log}</b>
				<br>
				{new Date(backup.time).toLocaleString()}
				<span class="w3-right buttons">
					<a href="{backup.path}">
						<i class="far fa-folder-open"></i>
					</a>&nbsp;&nbsp;
				</span>
			</li>
		{/each}
	</ul>
</div>