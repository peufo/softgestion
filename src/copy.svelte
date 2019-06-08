<script>
	import { paths } from './stores.js'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let name
	export let section
	export let log

</script>

<style>
	li .log { display: block;}
	li:hover .log {display: none;}

	li .buttons { display: none;}
	li:hover .buttons {display: block;}

	li {cursor: pointer;}
	i:hover {transform: scale(1.2);}
</style>

<li on:click>
	{section} / {name}

	<em class="w3-right log">
		{log.replace('Copie pour ', '')}
	</em>

	<span class="w3-right buttons">
		<a href="{$paths.copy}/{section}/{name}">
			<i class="far fa-folder-open"></i>
		</a>&nbsp;&nbsp;
		<i class="far fa-trash-alt" on:click="{() => dispatch('clicktrash')}"></i>&nbsp;&nbsp;
		<i class="fas fa-upload"  	on:click="{() => dispatch('clickupload')}"></i>
	</span>
</li>
