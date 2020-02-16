import { TiddlyFileModel} from './filemap'
import { TiddlyModel,TiddlerFieldMap,TiddlerFieldDatum } from '..'
import { ITiddlyFactory,TiddlyFactory,TiddlerData,mapFields,Tiddler } from '../tiddlers'
import { klawSync } from 'klaw-sync'
import fs from 'fs-extra'

interface KlawReturn {
	path:string,
	stats:fs.Stats
}

export class TiddlyModelReader {

	files:TiddlyFileModel
  model:TiddlyModel
	factory:ITiddlyFactory

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


	async loadTiddler(path:string,type_hint:string):Promise<Tiddler> {
		const TD = await this.loadTiddlerData(path)
    const tiddler = this.factory.createTiddlerFromData(TD)
    this.model.integrateTiddler(tiddler)
    return tiddler
	}

	scanDirForTiddlers(base:string) {
		return klawSync(base,{
			filter: (item) => {
				return item.stats.isFile() && item.path.endsWith(".tid")
			}
		})
	}

	async load(factory:ITiddlyFactory):Promise<void> {
		return new Promise<void>((resolve,reject) => {
			const nodes = this.scanDirForTiddlers(this.files.paths.nodes)
			const maps = this.scanDirForTiddlers(this.files.paths.maps)
			const metamodel = this.scanDirForTiddlers(this.files.paths.metamodel.base)

			resolve()
		})
	}



}
