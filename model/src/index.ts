import { TiddlerData  } from './tiddlers'
import { NodeTiddler } from './node-tiddler'
import { EdgeTypeTiddler,NodeTypeTiddler } from './tiddlymap'

export type tiddlydate = number;

export const TIDDLERTYPE="text/vnd.tiddlywiki"

export interface TiddlyModel {

	path:string
	nodesPath:string
	nodeMap:Map<string,NodeTiddler>
	mapViews:string
	mapEdgeTypesPath:string
	edgeTypes:EdgeTypeTiddler[]
	mapNodeTypesPath:string
	nodeTypes:NodeTypeTiddler[]
	system:string
	templates:string
	namedMaps:Set<string>

	schemas:any,

	nodes:() => void
	readTiddlerFile:(path:string) => any
	loadNodeTiddler:(path:string) => void
	load:() => Promise<void>
	save:() => Promise<void>

	slugify:(x:string) => string
	ensurePath:(base:string,dir?:string)  => string

	createNodeTiddler:(data:TiddlerData) => NodeTiddler
	createEdgeTypeTiddler:(parts:string[]) => EdgeTypeTiddler
	createNodeTypeTiddler:(parts:string[]) => NodeTypeTiddler

	registerNamedMap:(name:string) => void
}


export * from './tiddlers'
export * from './tiddlymap'
export * from './node-tiddler'
export * from './impl'
