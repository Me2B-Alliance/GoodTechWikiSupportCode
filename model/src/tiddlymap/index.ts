import { TiddlyModel } from '..'
import { Tiddler,SimpleTiddler,mapFields } from '../tiddlers'
import uuid from 'uuid'

export interface TiddlyMapPosition {
	x:number
	y:number
}

export interface TiddlyMap {
	layout:Tiddler
	edges:Tiddler
	nodes:Tiddler
	definition:Tiddler

	positions:Map<string,TiddlyMapPosition>

}


export class BaseMap implements TiddlyMap {
	layout:Tiddler
	edges:Tiddler
	nodes:Tiddler
	definition:Tiddler

	positions:Map<string,TiddlyMapPosition>

	constructor(args:{
		layout:Tiddler,
		edges:Tiddler,
		nodes:Tiddler,
		definition:Tiddler
	}) {
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

export class TiddlyMapFactory {

	model:TiddlyModel

	constructor(model:TiddlyModel) {
		this.model = model
	}

	createNeighborMap(t:Tiddler):TiddlyMap {
		const name = t.title+"-map"
		let map = this.model.maps.byTitle[name]
		if(!map) {
			map = new BaseMap({
				definition:this.createNeighborMapDefinition(t),
				nodes:this.createNeighborMapNodeFilter(t),
				edges:this.createNeighborMapEdgeFilter(t),
				layout:this.createNeighborMapLayout(t)
			})
			this.model.integrateMap(map)
		}
		return map
	}

	/*
	useExplicitNodeFilter() {
		this.nodes.forEach((val:string) => {
			this.nodeFilter += "[field:tmap.id["+val+"]] "
		})
	}

	useExplicitEdgeFilter() {
		for(let e in this.edges) {
			this.edgeFilter += "[field:tmap.id["+e+"]] "
		}
	}
	*/

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

	createNeighborMapDefinition(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			element_classification:"map",
			element_type:"definition",
			title: "$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "-map",
			wiki_text:"Neighbor Map of "+t.title,
			fields:mapFields({
				"id":id,
				"config.central-topic":t.guid,
				"config.vis":this.physics(),
				"config.neighbourhood_scope":2,
				"config.show_inter_neighbour_edges":true,
				"isview":false
			})
		})
	}
	createNeighborMapEdgeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			element_classification:"map",
			element_type:"edge-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/edges",
			fields: mapFields({
				filter:' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]'
			})
		})
	}

	createNeighborMapNodeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			element_classification:"map",
			element_type:"node-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/nodes",
			fields:mapFields({
				filter:"[field:tmap.id["+t.guid+"]]"
			})
		})
	}

	createNeighborMapLayout(t:Tiddler):Tiddler {
		const ld = {}
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			element_classification:"map",
			element_type:"node-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/map",
			wiki_text: JSON.stringify(ld,null,2)
		})
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
