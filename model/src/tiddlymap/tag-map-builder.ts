import { BaseMap,TiddlyMap,TiddlyMapFactoryUtilities } from '.'
import { TiddlyModel } from '..'
import { Tiddler,SimpleTiddler,mapFields } from '../tiddlers'
import uuid from 'uuid'

export class TiddlyTagMapFactory {

	model:TiddlyModel
	utilities:TiddlyMapFactoryUtilities

	constructor(model:TiddlyModel,utilities:TiddlyMapFactoryUtilities) {
		this.model = model
		this.utilities = utilities
	}

	createMap(t:Tiddler):TiddlyMap {
		const name = t.title+"-map"
		let map = this.model.maps.tagmapsByTitle.get(name)
		if(!map) {
			map = new BaseMap({
				type:'tag ',
				definition:this.createDefinition(t),
				nodes:this.createNodeFilter(t),
				edges:this.createEdgeFilter(t),
				layout:this.utilities.createGenericMapLayout(t.title)
			})
			this.model.integrateMap(map)
		}
		return map
	}


	createDefinition(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"definition",
			title: "$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "-map",
			wiki_text:"Tag Map of "+t.title,
			fields:mapFields({
				"id":id,
				//"config.central-topic":t.guid,
				"config.vis":this.utilities.physics(),
				"config.neighbourhood_scope":2,
				"config.show_inter_neighbour_edges":true,
				"isview":false
			})
		})
	}
	createEdgeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"edge-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/edges",
			fields: mapFields({
				filter:' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]'
			})
		})
	}

	createNodeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		const fields = t.fields || {}
		const value = t.title
		const field = fields.get('metamodel.fieldname')
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			element_type:"node-filter",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/nodes",
			fields:mapFields({
				filter:"[["+value+"]listed["+field+"]]"
			})
		})
	}


}
