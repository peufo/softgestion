import { readable, writable } from 'svelte/store'

export let paths = writable([], getPaths)
export let masters = writable([], getMasters)
export let masterSelected = writable('')
export let copies = writable([], getCopies)
export let sections = writable([], getSections)
export let pulls = writable([], getPulls)

function getPaths(set) {
	fetch('paths').then(res => res.json()).then(set)	
}

function getMasters(set) {
	fetch('masters').then(res => res.json()).then(set)	
}

function getCopies(set) {
	fetch('copies').then(res => res.json()).then(set)	
}

function getSections(set) {
	fetch('copies/sections').then(res => res.json()).then(set)	
}

function getPulls(set) {
	fetch('pulls').then(res => res.json())
	.then(data => {
		data.sort((a, b) => a.time - b.time)
		set(data)
	})	
}