<script>
	import { paths } from './stores.js'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let name
	export let section
	export let log

</script>

<style>
	li span { display: none;}
	li:hover span {display: block;}
	li {cursor: pointer;}
	i:hover {transform: scale(1.2);}
</style>

<li on:click>
	{section} / {name}
	<span class="w3-right">
		<a href="{$paths.copy}/{section}/{name}">
			<i class="far fa-folder-open"></i>
		</a>&nbsp;&nbsp;
		<i class="far fa-trash-alt" on:click="{() => dispatch('clicktrash')}"></i>&nbsp;&nbsp;
		<i class="fas fa-upload"></i>
	</span>
</li>
