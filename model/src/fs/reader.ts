import { TiddlyFileModel} from './filemap'
import { TiddlyModel,TiddlerFieldMap,TiddlerFieldDatum } from '..'
import { ITiddlyFactory,TiddlyFactory,TiddlerData,mapFields,Tiddler,extractTiddlerFieldDatum } from '../tiddlers'
import { TiddlyMap,TiddlyMapFactory } from '../tiddlymap'
import klawSync from 'klaw-sync'
import fs from 'fs-extra'
import fspath from 'path'

interface KlawReturn {
	path:string,
	stats:fs.Stats
}

export class TiddlyModelReader {

	files:TiddlyFileModel
  model:TiddlyModel
	factory:ITiddlyFactory
	mapFactory:TiddlyMapFactory
	filePathToGuidMap:Map<string,string>
	tiddlerGuidToPathMap:Map<string,string>

	constructor(
    files:TiddlyFileModel,
    options:{
      factory?:ITiddlyFactory,
      model?:TiddlyModel
    }
  ) {
		this.files = files
    this.factory = options.factory || new TiddlyFactory()
    this.model = options.model || new TiddlyModel()
		this.mapFactory = new TiddlyMapFactory(this.model)
		this.filePathToGuidMap = new Map<string,string>()
		this.tiddlerGuidToPathMap = new Map<string,string>()
	}



  async loadTiddlerData(path:string):Promise<TiddlerData> {
		return new Promise<TiddlerData>((resolve,reject) => {
			 fs.readFile(path,'utf8',function read(err, data) {
		    if (err) {
		        reject(err);
		    }
				const fields = {}
				const sections = data.split("\n\n")
				const header = (sections.shift() || '').split("\n")
				const wiki_text = sections.join("\n\n")
				for(let line of header) {
					const l2=line.trim()
					if(l2) {
						const blocks = line.split(":")
						const key = blocks.shift()
						if(key) {
							const value = blocks.join(":").trim()
							fields[key] = value
						}
					}
				}
				resolve({
					fields:mapFields(fields),
					wiki_text
					})
			})
		})
	}


	async loadTiddler(path:string,classification_hint:string):Promise<Tiddler> {
		const TD = await this.loadTiddlerData(path)
		TD.tiddler_classification = TD.tiddler_classification || classification_hint
    const tiddler = this.factory.createTiddlerFromData(TD)
    this.model.integrateTiddler(tiddler)
		this.filePathToGuidMap.set(path,tiddler.guid)
		this.tiddlerGuidToPathMap.set(tiddler.guid,path)
    return tiddler
	}
	async loadMap(path:string):Promise<TiddlyMap> {
		const TD = await this.loadTiddlerData(path)
		TD.tiddler_classification = 'map'


		const tiddler = this.factory.createTiddlerFromData(TD)
		const layoutTiddler = this.factory.createTiddlerFromData(
					await this.loadTiddlerData(
						fspath.join(
							fspath.dirname(path),'map-layout.tid')))
		const edgeFilterTiddler = this.factory.createTiddlerFromData(
					await this.loadTiddlerData(
						fspath.join(
							fspath.dirname(path),'map-edges.tid')))
		const nodeFilterTiddler = this.factory.createTiddlerFromData(
					await this.loadTiddlerData(
						fspath.join(
							fspath.dirname(path),'map-layout.tid')))

		return this.mapFactory.createMapFromDefinitionTiddler({
			definition:tiddler,
			layout:layoutTiddler,
			edges:edgeFilterTiddler,
			nodes:nodeFilterTiddler
			})
	}

	scanDirForTiddlers(base:string,suffix:string=".tid") {
		return klawSync(base,{
			nodir:true,
			traverseAll:true,
			filter: (item) => {
				return item.stats.isFile() && item.path.endsWith(suffix)
			}
		})
	}


	async load():Promise<void> {
		return new Promise<void>(async (resolve,reject) => {
			const nodes = this.scanDirForTiddlers(this.files.paths.nodes,'.tid')
			const metamodel = this.scanDirForTiddlers(this.files.paths.metamodel.base,'wiki.tid')
			const maps = [] as KlawReturn[]
			for(let base of [
				this.files.paths.maps,
				this.files.paths.nodes,
				this.files.paths.metamodel.base])
					maps.concat(this.scanDirForTiddlers(base,'map-definition.tid'))

			const tiddler_promises = [] as Promise<Tiddler|TiddlyMap>[]

			for(let klawReturn of nodes) {
				tiddler_promises.push(this.loadTiddler(klawReturn.path,"node"))
			}
			for(let klawReturn of metamodel) {
				tiddler_promises.push(this.loadTiddler(klawReturn.path,"metamodel"))
			}

			for(let klawReturn of maps) {
				tiddler_promises.push(this.loadMap(klawReturn.path))
				}

			const tiddlersAndMaps = await Promise.all(tiddler_promises)

			resolve()
		})
	}



}
