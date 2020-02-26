import { Tiddler  } from './tiddlers'
import { TiddlyMap } from './tiddlymap'
import { lowerDashedSlug } from './util'

export type tiddlydate = number;

export const TIDDLERTYPE="text/vnd.tiddlywiki"

export class TiddlyModel {

	guidMap:Map<string,Tiddler>
	byTitleSlug:Map<string,Tiddler>

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
		this.byTitleSlug = new Map<string,Tiddler>()
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
		this.integrateTiddler(m.definition)
		this.integrateTiddler(m.edges)
		this.integrateTiddler(m.nodes)
		this.integrateTiddler(m.layout)
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

		const tslug=lowerDashedSlug(t.title)
		const n = this.byTitleSlug.get(tslug)
		if(n) {
			console.log("Collision:"+t.title+" already in map\n"
				+"Existing Title:"+n.title+"\n"
				+"Existing Type:"+n.tiddler_classification+":"+n.general_type+"/"+n.general_subtype+"\n"
				+"New Type:"+t.tiddler_classification+":"+t.general_type+"/"+t.general_subtype+"\n"
				+"\n")
				t.title = t.title + "("+t.general_type+"/"+t.general_subtype+")"

				if(t.general_type == n.general_type) {
					t.title = t.title + " ("+t.general_subtype+")"
					n.title = n.title + " ("+n.general_subtype+")"
				}
				else {
					t.title = t.title + " ("+t.general_type+")"
					n.title = n.title + " ("+n.general_type+")"
				}
				this.byTitleSlug.delete(tslug)
				this.byTitleSlug.set(lowerDashedSlug(n.title),n)
		}

		// if all clear
		this.byTitleSlug.set(tslug,t)
		this.guidMap.set(t.guid,t)
		if(t.tiddler_classification == 'node') {
			this.nodes.byGuid.set(t.guid,t)
			this.nodes.byTitle.set(t.title,t)
		}
		if(t.tiddler_classification == 'metamodel') {
			this.metamodel.byGuid.set(t.guid,t)
			this.metamodel.byTitle.set(t.title,t)
		}

	}

	tiddlerForGuid(guid:string):Tiddler|undefined {
		return this.guidMap.get(guid)
	}

	findAnyTitleMatch(x:string):Tiddler|undefined {
		const target=lowerDashedSlug(x)
		return this.byTitleSlug.get(target)
	}

	findNodeTitleMatch(x:string):Tiddler|undefined {
		let result:Tiddler|undefined = undefined
		const target=lowerDashedSlug(x)
		this.nodes.byTitle.forEach((value,key) => {
			if(lowerDashedSlug(key) == target) {
				if(result) {
					console.log("Multiple matches",value.title,"replacing",result.title)
				}
				result = value
			}
		})
		return result
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
export * from './util'
