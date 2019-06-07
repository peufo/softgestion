import { readable, writable } from 'svelte/store'

export let paths = readable([], getPaths)
export let masters = writable([], getMasters)
export let masterSelected = writable('')
export let copies = writable([], getCopies)
export let sections = writable([], getSections)

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