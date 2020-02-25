import { TiddlyModel } from '..'
import { Tiddler,SimpleTiddler,mapFields } from '../tiddlers'
import uuid from 'uuid'

export interface TiddlyMapPosition {
	x:number
	y:number
}

export interface TiddlyMap {
	type:string

	layout:Tiddler
	edges:Tiddler
	nodes:Tiddler
	definition:Tiddler

	positions:Map<string,TiddlyMapPosition>

}


export class BaseMap implements TiddlyMap {
	type:string

	layout:Tiddler
	edges:Tiddler
	nodes:Tiddler
	definition:Tiddler

	positions:Map<string,TiddlyMapPosition>

	constructor(args:{
		type:string,
		layout:Tiddler,
		edges:Tiddler,
		nodes:Tiddler,
		definition:Tiddler
	}) {
		this.type = args.type

		this.layout = args.layout
		this.edges = args.edges
		this.nodes = args.nodes
		this.definition = args.definition

		this.positions = this.parsePositions(JSON.parse(this.layout.wiki_text))
	}

	parsePositions(pos:any):Map<string,TiddlyMapPosition> {
		const results = new Map<string,TiddlyMapPosition>()
		for(let guid in pos) {
			const entry = pos[guid]
			results[guid]={
				x:entry.x,
				y:entry.y
			}
		}
		return results
	}



}

export class TiddlyMapFactoryUtilities {
	constructor() {
	}

	physics():string {
		const physics = {
			forceAtlas2Based: {
				// <- more repulsion between nodes - 0 - more attraction between nodes ->
				gravitationalConstant: -1250, // default: -50
				// edge length
				springLength: 650, // default: 100
				// <- less stiff edges - 0 - stiffer edges ->
				springConstant: 0.05, // default: 0.08
				// pulls the entire network back to the center.
				centralGravity: 0.01, // default: 0.01
				// kinetic energy reduction
				damping: 0.4
			},
			solver: 'forceAtlas2Based',
			stabilization: {
				enabled: false,
				iterations: 1000,
				updateInterval: 10,
				onlyDynamicEdges: false,
				fit: true
			}
		}

		return JSON.stringify(physics)
	}


	createGenericMapEdgeFilter(title:string,filter:string = ' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]'):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"edge-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + title + "/filter/edges",
			fields: mapFields({
				filter
			})
		})
	}

	createGenericMapNodeFilter(title:string,filter:string):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"node-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + title + "/filter/nodes",
			fields:mapFields({
				filter
			})
		})
	}

	createGenericMapLayout(title:string):Tiddler {
		const ld = {}
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"layout",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + title + "/map",
			wiki_text: JSON.stringify(ld,null,2)
		})
	}
}

import { TiddlyNeighborMapFactory } from './neighbor-map-builder'
import { TiddlyTagMapFactory } from './tag-map-builder'

export class TiddlyMapFactory {

	model:TiddlyModel
	util:TiddlyMapFactoryUtilities
	neighborFactory:TiddlyNeighborMapFactory
	tagFactory:TiddlyTagMapFactory

	constructor(model:TiddlyModel) {
		this.model = model
		this.util = new TiddlyMapFactoryUtilities()
		this.neighborFactory = new TiddlyNeighborMapFactory(this.model,this.util)
		this.tagFactory = new TiddlyTagMapFactory(this.model,this.util)

	}

	createNeighborMap(t:Tiddler):TiddlyMap {
		return this.neighborFactory.createMap(t)
	}

	createTagMap(t:Tiddler):TiddlyMap {
		return this.tagFactory.createMap(t)
	}

	createMapFromDefinitionTiddler(args:{
		definition:Tiddler,
		nodes:Tiddler,
		edges:Tiddler,
		layout:Tiddler
	}):TiddlyMap {
		const type = args.definition.getFieldAsString('tmap.type') || 'unknown'
		const map = new BaseMap({type,...args})
		this.model.integrateMap(map)
		return map
	}




/*
	async layoutGraph() {
		const n2 = [] as any[]
		for(let x in this.nodes) {
			const node = this.model.nodeMap[x]
			n2.push({
				data:node
			})
			console.log("Process Edgemap",node.edgemap)
		}
		const e2 = [] as any[]
		for(let x in this.edges) {
			e2.push({
				data:x
			})
		}
		var cy = cytoscape({
			headless: true,
			elements: [
				...n2,
				...e2
			]
		})
		var layout = cy.elements().layout({
			name: 'cose'
		});
		layout.run();

		console.log("LAYOUT COMPLETE")
		for(let x of cy.elements().jsons() ) {
			const elt = JSON.parse(x)
			console.log("POS:",elt.data.id,elt.position)
		}
	}
*/

}
