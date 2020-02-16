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
		byPath:Map<string,Tiddler>
	}

	maps:{
		byGuid:Map<string,TiddlyMap>,
		byTitle:Map<string,TiddlyMap>,
		named:Map<string,TiddlyMap>,
		neighbor:Map<string,TiddlyMap>
	}

	constructor() {
		this.guidMap = new Map<string,Tiddler>()
		this.nodes = {
			byGuid:new Map<string,Tiddler>(),
			byTitle:new Map<string,Tiddler>(),
			byPath:new Map<string,Tiddler>()
		}
		this.maps = {
			byGuid:new Map<string,TiddlyMap>(),
			byTitle:new Map<string,TiddlyMap>(),
			named:new Map<string,TiddlyMap>(),
			neighbor:new Map<string,TiddlyMap>()
		}
	}

	integrateMap(m:TiddlyMap) {
		this.maps.byGuid[m.definition.guid] = m
		//this.maps.byTitle[m.definition.getField('title')] = m
	}

	integrateTiddler(t:Tiddler) {
		// check if already in guid map....

		// if all clear
		this.guidMap[t.guid] = t
	}



	forAllTiddlersMatchingPredictate(predicate:(t:Tiddler)=>boolean,action:(t:Tiddler)=>Promise<any>):Promise<any>[] {
		const result=[] as Promise<any>[]
		this.guidMap.forEach((tiddler,guid)=> {
			if(predicate(tiddler))
				result.push(action(tiddler))
		})
		return result
	}


	async forAllTiddlers(action:(t:Tiddler)=>Promise<any>) {
		return await Promise.all(
			this.forAllTiddlersMatchingPredictate((t:Tiddler) => true,action))
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

	load(path:string) {
	}

	save(path:string) {
	}

}


export * from './tiddlers'
export * from './tiddlymap'
