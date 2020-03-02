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
		const name = t.title
		let map = this.model.maps.tagmapsByTitle.get(name)
		if(!map) {
			map = new BaseMap({
				type:'tagmap',
				definition:this.createDefinition(t),
				nodes:this.createNodeFilter(t),
				edges:this.createEdgeFilter(t),
				layout:this.utilities.createGenericMapLayout(t,"tagmap")
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
			title: "$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title,
			wiki_text:"Tag Map of "+t.title,
			fields:mapFields({
				"id":id,
				//"config.central-topic":t.guid,
				"config.vis":this.utilities.physics(),
				"config.neighbourhood_scope":2,
				"config.show_inter_neighbour_edges":true,
				"isview":false,
				"map.role":"definition",
				"map.base":t.guid,
				"map.type":"tagmap"
			})
		})
	}
	createEdgeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/edges",
			fields: mapFields({
				filter:' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]',
				"map.role":"edge-filter",
				"map.base":t.guid,
				"map.type":"tagmap"
			})
		})
	}

	createNodeFilter(t:Tiddler):Tiddler {
		const id = uuid.v4()
		const fields = t.fields || {}
		const value = t.title
		const field = t.getFieldAsString('metamodel.fieldname')
		if(!field)
			throw new Error("Missing metamodel field "+t.title+JSON.stringify(fields,null,2))
		return new SimpleTiddler({
			guid:id,
			tiddler_classification:"map",
			title:"$:/plugins/felixhayashi/tiddlymap/graph/views/" + t.title + "/filter/nodes",
			fields:mapFields({
				filter:"[["+value+"]listed["+field+"]]",
				"map.role":"node-filter",
				"map.base":t.guid,
				"map.type":"tagmap"
			})
		})
	}


}
