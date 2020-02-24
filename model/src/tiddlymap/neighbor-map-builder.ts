import { BaseMap,TiddlyMap,TiddlyMapFactory } from '.'
import { TiddlyModel } from '..'
import { Tiddler,SimpleTiddler,mapFields } from '../tiddlers'
import uuid from 'uuid'

export class TiddlyNeighborMapFactory {

	model:TiddlyModel
	factory:TiddlyMapFactory

	constructor(factory:TiddlyMapFactory) {
		this.model = factory.model
		this.factory = factory
	}

	createMap(t:Tiddler):TiddlyMap {
		const name = t.title+"-map"
		let map = this.model.maps.neighborByTitle.get(name)
		if(!map) {
			map = new BaseMap({
				type:'neighbor',
				definition:this.createMapDefinition(t),
				nodes:this.createMapNodeFilter(t),
				edges:this.createMapEdgeFilter(t),
				layout:this.factory.createGenericMapLayout(t.title)
			})
			this.model.integrateMap(map)
		}
		return map
	}



	createMapDefinition(t:Tiddler):Tiddler {
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
				"config.vis":this.factory.physics(),
				"config.neighbourhood_scope":2,
				"config.show_inter_neighbour_edges":true,
				"isview":false
			})
		})
	}
	createMapEdgeFilter(t:Tiddler):Tiddler {
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

	createMapNodeFilter(t:Tiddler):Tiddler {
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



}
