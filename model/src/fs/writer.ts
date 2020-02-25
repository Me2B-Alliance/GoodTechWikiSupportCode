import slugify from 'slugify'
import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import { schemas } from 'twiki-schema'

import { TiddlyFileModel  } from './filemap'
import { TiddlerData,Tiddler  } from '../tiddlers'
import { TiddlyMap  } from '../tiddlymap'

export class TiddlerSerializer {
	tiddlerdata(t:Tiddler):string {
		const sorted_keys = [] as string[]
		t.fields.forEach((value,field) => {
			sorted_keys.push(field)
		})
		for(let field in t.fields) {
			sorted_keys.push(field)
		}
		sorted_keys.sort()

		let field_data = ""
		for (let k of sorted_keys) {
			if(t.fields[k] !== undefined)
				field_data = field_data + k + ":" + this.getFieldData(t,k) + "\n"
			else
				field_data = field_data + k + ":\n"
		}

		return field_data + "\n" + t.wiki_text + "\n";
	}

	getFieldData(t:Tiddler,key:string):string {
		const val = t.fields[key]
		if(!val) {
			return ''
		}
		else {
			switch(typeof(val)) {
				default:
					return (''+val).trim()
					/*
					const vals = [] as string[]
					console.log("VAL:",val)
					return 'no'
					//val.forEach((v) => { vals.push("[["+v.trim()+"]]") })
					//return vals.join(" ")
					*/
			}
		}
	}

}

export class TiddlyModelWriter {

	files:TiddlyFileModel
	serializer:TiddlerSerializer

	constructor(
    files:TiddlyFileModel,
    serializer?:TiddlerSerializer
  ) {
		this.files = files
    this.serializer = serializer || new TiddlerSerializer()
	}


	async saveTiddler(tiddler:Tiddler):Promise<any> {
		const tiddlerpath = this.files.relativePathFromTiddler(tiddler)
		fs.ensureDirSync(path.dirname(tiddlerpath))
		console.log("Writing",tiddlerpath)
		await fs.writeFile(tiddlerpath,this.serializer.tiddlerdata(tiddler))
	}

	async saveMap(map:TiddlyMap) {
		await this.saveTiddler(map.definition)
		await this.saveTiddler(map.nodes)
		await this.saveTiddler(map.edges)
		await this.saveTiddler(map.layout)
	}

}
