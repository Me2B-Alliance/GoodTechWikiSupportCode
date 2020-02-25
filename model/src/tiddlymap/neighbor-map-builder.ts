import { BaseMap,TiddlyMap,TiddlyMapFactoryUtilities } from '.'
import { TiddlyModel } from '..'
import { Tiddler,SimpleTiddler,mapFields } from '../tiddlers'
import uuid from 'uuid'

export class TiddlyNeighborMapFactory {

	model:TiddlyModel
	utilities:TiddlyMapFactoryUtilities

	constructor(model:TiddlyModel,utilities:TiddlyMapFactoryUtilities) {
		this.model = model
		this.utilities = utilities
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
				layout:this.utilities.createGenericMapLayout(t,"neighbor")
			})
			this.model.integrateMap(map)
		}
		return map
	}


	createMapDefinition(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"definition",
			title: "$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "-map",
			wiki_text:"Neighbor Map of "+t.title,
			fields:mapFields({
				"id":id,
				"config.central-topic":t.guid,
				"config.vis":this.utilities.physics(),
				"config.neighbourhood_scope":2,
				"config.show_inter_neighbour_edges":true,
				"isview":false,
				"map.role":"definition",
				"map.base":t.guid,
				"map.type":"neighbor"
			})
		})
	}
	createMapEdgeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/edges",
			fields: mapFields({
				filter:' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]',
				"map.role":"edge-filter",
				"map.base":t.guid,
				"map.type":"neighbor"
			})
		})
	}

	createMapNodeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"node-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/nodes",
			fields:mapFields({
				filter:"[field:tmap.id["+t.guid+"]]",
				"map.role":"edge-filter",
				"map.base":t.guid,
				"map.type":"neighbor"
			})
		})
	}



}
