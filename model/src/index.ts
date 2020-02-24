import { Tiddler  } from './tiddlers'
import { TiddlyMap } from './tiddlymap'

export type tiddlydate = number;

export const TIDDLERTYPE="text/vnd.tiddlywiki"

export class TiddlyModel {

	guidMap:Map<string,Tiddler>

	//
	nodes:{
		byGuid:Map<string,Tiddler>,
		byTitle:Map<string,Tiddler>,
	}

	metamodel:{
		byGuid:Map<string,Tiddler>,
		byTitle:Map<string,Tiddler>,
	}

	maps:{
		byGuid:Map<string,TiddlyMap>,
		neighborByTitle:Map<string,TiddlyMap>,
		viewsByTitle:Map<string,TiddlyMap>,
		tagmapsByTitle:Map<string,TiddlyMap>
	}

	constructor() {
		this.guidMap = new Map<string,Tiddler>()
		this.nodes = {
			byGuid:new Map<string,Tiddler>(),
			byTitle:new Map<string,Tiddler>()
		}
		this.metamodel = {
			byGuid:new Map<string,Tiddler>(),
			byTitle:new Map<string,Tiddler>()
		}
		this.maps = {
			byGuid:new Map<string,TiddlyMap>(),
			neighborByTitle:new Map<string,TiddlyMap>(),
			viewsByTitle:new Map<string,TiddlyMap>(),
			tagmapsByTitle:new Map<string,TiddlyMap>()
		}
	}

	integrateMap(m:TiddlyMap) {
		this.maps.byGuid.set(m.definition.guid,m)
		if(m.type == 'neighbor')
			this.maps.neighborByTitle[m.definition.title] = m
		if(m.type == 'tagmap')
			this.maps.tagmapsByTitle[m.definition.title] = m
	}

	integrateTiddler(t:Tiddler) {
		// check if already in guid map....
		if(this.guidMap.get(t.guid)) {
			throw new Error("Collision:"+t.guid+" already in map")
		}

		// if all clear
		this.guidMap.set(t.guid,t)
		if(t.element_classification == 'node') {
			this.nodes.byGuid.set(t.guid,t)
			this.nodes.byTitle.set(t.title,t)
		}
		if(t.element_classification == 'metamodel') {
			this.metamodel.byGuid.set(t.guid,t)
			this.metamodel.byTitle.set(t.title,t)
		}

	}



	forAllTiddlersMatchingPredicate(predicate:(t:Tiddler)=>boolean,action:(t:Tiddler)=>Promise<any>):Promise<any>[] {
		const result=[] as Promise<any>[]
		this.guidMap.forEach((tiddler:Tiddler,guid:string)=> {
			if(predicate(tiddler))
				result.push(action(tiddler))
		})
		return result
	}


	async forAllTiddlers(action:(t:Tiddler)=>Promise<any>) {
		return await Promise.all(
			this.forAllTiddlersMatchingPredicate((t:Tiddler) => true,action))
	}


	forAllTiddlyMapsMatchingPredictate(predicate:(t:TiddlyMap)=>boolean,action:(t:TiddlyMap)=>Promise<any>):Promise<any>[] {
		const result=[] as Promise<any>[]
		this.maps.byGuid.forEach((map,guid)=> {
			if(predicate(map))
				result.push(action(map))
		})
		return result
	}


	async forAllTiddlyMaps(action:(t:TiddlyMap)=>Promise<any>) {
		return await Promise.all(
			this.forAllTiddlyMapsMatchingPredictate((t:TiddlyMap) => true,action))
	}

}


export * from './fs'
export * from './tiddlers'
export * from './tiddlymap'
