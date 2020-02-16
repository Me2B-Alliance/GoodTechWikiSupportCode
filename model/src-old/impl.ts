import slugify from 'slugify'
import fs from 'fs-extra'
import klaw from 'klaw'
import { schemas } from 'twiki-schema'

import { TiddlyModel,tiddlydate  } from '.'
import { TiddlerData  } from './tiddlers'
import { NodeTiddler, SimpleNodeTiddler } from './tiddlers'
import { EdgeTypeTiddler,NodeTypeTiddler, SimpleEdgeTypeTiddler, SimpleNodeTypeTiddler, SimpleTiddlyMap, NeighborMap} from './tiddlymap'
export const subtypeFields = {
  'event':'Category',
  'working-group':"Category",
  'person':undefined,
  'organization':"Org Type",
  'project-or-product':"Category",
  'publication':"Publication Type"
}


export class TiddlyModelImpl implements TiddlyModel {

	nodeMap:Map<string,NodeTiddler>
	edgeTypes:EdgeTypeTiddler[]
	nodeTypes:NodeTypeTiddler[]
	namedMaps:Set<string>
	schemas:any

	constructor(path:string) {

		this.nodeMap = new Map<string,NodeTiddler>()
		this.edgeTypes = []
		this.nodeTypes = []
		this.namedMaps = new Set<string>()

		this.schemas = schemas
	}

	registerNamedMap(name:string):void {
		this.namedMaps.add(slugify(name,{lower:true}))
	}

	nodes() {
		const n=[] as NodeTiddler[]
		for(let nid in this.nodeMap) {
			const node = this.nodeMap[nid]
			n.push(node)
			}
		return n
	}


	slugify(x:string) : string {
		const slug=
			slugify(x, {
				replacement: '.',    // replace spaces with replacement
				//remove: null,        // regex to remove characters
				lower: true,         // result in lower case
			})
		return ''+slug
	}

	createNodeTiddler(data:TiddlerData):NodeTiddler {
		const result = new SimpleNodeTiddler(data,this)
		//console.log("Node Tiddler:",result.tiddlerfile())
		this.nodeMap[result.guid] = result
		return result
	}
	createEdgeTypeTiddler(parts:string[]):EdgeTypeTiddler {
		const result = new EdgeTypeTiddler(parts,this)
		this.edgeTypes.push(result)
		return result
	}
	createNodeTypeTiddler(parts:string[]):NodeTypeTiddler {
		const result = new NodeTypeTiddler(parts,this)
		this.nodeTypes.push(result)
		return result
	}

}
