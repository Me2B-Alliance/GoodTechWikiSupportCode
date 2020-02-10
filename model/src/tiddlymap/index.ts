import { TiddlyModel } from '..'

export interface TiddlerPosition {
	x:number
	y:number
}

export interface TiddlyMap {
	model:TiddlyModel
	name:string
	nodes:Set<string>
	edges:Set<string>
	positions:Map<string,Position>

	layoutGraph:() => void
}

export * from './edge-type'
export * from './node-type'
export * from './simple-map'
export * from './neighbor-map'
