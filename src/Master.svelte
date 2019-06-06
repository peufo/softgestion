<script>

	import { paths, copies } from './stores.js'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let name
	export let selected = false

	let opened = false


</script>

<style>

	li span { display: none;}
	li:hover span {display: block;}
	li {cursor: pointer;}
	i:hover {transform: scale(1.2);}
	.selected {
		border-left: 5px solid grey;
	}

</style>

<li on:click class:selected>
	{name}
	<span class="w3-right">
		<a href="{$paths.master}/{name}">
			<i class="far fa-folder-open"></i>
		</a>&nbsp;&nbsp;
		<i class="far fa-copy"		on:click="{() => dispatch('clickcopy')}"	></i>&nbsp;&nbsp;
		<i class="fas fa-history"	on:click="{() => dispatch('clickhistory')}"	></i>&nbsp;&nbsp;
		<i class="fas fa-download" 	on:click="{() => dispatch('clickdownload')}"></i>
	</span>
</li>