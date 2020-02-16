import slugify from 'slugify'
import fs from 'fs-extra'
import klaw from 'klaw'
import { schemas } from 'twiki-schema'

import { TiddlyModel,tiddlydate  } from '.'
import { TiddlerData  } from './tiddlers'
import { NodeTiddler, SimpleNodeTiddler } from './node-tiddler'
import { EdgeTypeTiddler,NodeTypeTiddler, SimpleEdgeTypeTiddler, SimpleNodeTypeTiddler, SimpleTiddlyMap, NeighborMap} from './tiddlymap'

export class TiddlerSerializer {
	tiddlerdata(t:Tiddler):string {
		const sorted_keys = [] as string[]
		t.fields.forEach((value,field) => {
			sorted_keys.push(field)
		})
		sorted_keys.sort()

		let field_data = ""
		for (let k of sorted_keys) {
			if(t.fields[k] !== undefined)
				field_data = field_data + k + ":" + this.getFieldData(t,k) + "\n"
			else
				field_data = field_data + k + ":\n"
		}

		return field_data + "\n" + this.wiki_text + "\n";
	}

	getFieldData(t:Tiddler,key:string):string {
		const val = t.fields[key]
		if(typeof(val) == "string")
			return val.trim()
		else {
			const vals = [] as string[]
			val.forEach((v) => { vals.push(v.trim()) })
			return vals.join(" ")
		}
	}

}

export class TiddlyModelWriter {

	files:TiddlyFileModel
  model:TiddlyModel
	serializer:TiddlerSerializer

	constructor(
    files:TiddlyFileModel,
    options:{
      serializer?:TiddlerSerializer,
      model?:TiddlyModel}
    }
  ) {
		this.files = files
    this.serializer = options.serializer || new TiddlerSerializer()
    this.model = options.model || new TiddlyModel()
	}


	saveTiddler(t:Tiddler):Promise<any> {
		return t.save()
		const path = file
		return fs.writeFile(this.tiddlerFile,this.serializer.tiddlerdata(t))

	}

	async save():Promise<void> {
		const self = this
		const promises = [] as Promise<any>[]
		this.model.forAllTiddlers(
			(t:Tiddler) => {
				promises.push(self.saveTiddler(t))
			})

		// these will already be loaded?
		/*
		this.model.forAllTiddlyMaps(
			(m:TiddlyMap) => {
				promises.push(self.saveMap(m))
			})
		await Promise.all(promises)
		*/
	}

	async saveMap(TiddlyMap) {

		console.log("Writing Neighbor View Tiddler File:",this.tiddlerFile)
		await fs.writeFile(this.tiddlerFile,this.tiddlerdata())

		console.log("Writing Neighbor View Tiddler File:",this.edgeFilterFile)
		await fs.writeFile(this.edgeFilterFile,this.edgedata())

		console.log("Writing Neighbor View Tiddler File:",this.nodeFilterFile)
		await fs.writeFile(this.nodeFilterFile,this.nodedata())

		console.log("Writing Neighbor View Tiddler File:",this.layoutFile)
		await fs.writeFile(this.layoutFile,this.layoutdata())

	}

}
