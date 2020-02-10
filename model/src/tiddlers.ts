import slugify from 'slugify'
import path from 'path'
import uuid from 'uuid'
import fs from 'fs-extra'
import { TiddlyModel,tiddlydate,TIDDLERTYPE } from '.'

// Tiddly
export interface Tiddler  {
	guid:string
	base:TiddlyModel

	created: tiddlydate
	modified: tiddlydate
	title:string
	type:string

	wiki_text:string
	fields:Map<string,TiddlerFieldDatum>

	tiddlerdir:() => string
	tiddlerfile:() => string
	tiddlerdata:() => string

	writeTiddler:() => void
}

export interface TiddlerData {
	created?: tiddlydate
	modified?: tiddlydate
	title?:string
	type?:string
	guid?:string
	fields?:Map<string,TiddlerFieldDatum>
	text?:string
	element_type?:string
	element_subtype?:string
}

export type TiddlerFieldDatum = string|Set<string>

// --------------------------------------------------------------------------
// Impelementation
export class SimpleTiddler implements Tiddler
{
	guid:string
	base:TiddlyModel

	created: tiddlydate
	modified: tiddlydate
	title:string
	type:string

	wiki_text:string
	fields:Map<string,TiddlerFieldDatum>

	constructor(data:TiddlerData,base:TiddlyModel) {
		this.guid = uuid.v4()
		this.base = base

		this.title = data.title || "untitled"
		this.created = data.created || Date.now()
		this.modified = data.modified || Date.now()
		this.type = data.type || TIDDLERTYPE
		this.guid = data.guid || this.guid

		this.wiki_text = ''
		this.fields = new Map<string,TiddlerFieldDatum>()

	}

	tiddlerdir():string {
		return this.base.path
	}
	tiddlerfile():string {
		const filepart = slugify(this.title) + ".tid"
		return path.join(this.tiddlerdir(),filepart)
	}
	tiddlerdata():string {
		return ""+
			"created:" + this.created + "\n" +
			"modified:" + this.modified + "\n" +
			"title:" + this.title + "\n" +
			"type:" + this.type + "\n";
	}

	getFieldData(key:string):string {
		const val = this.fields[key]
		if(typeof(val) == "string")
			return val.trim()
		else {
			const vals = [] as string[]
			val.forEach((v) => { vals.push(v.trim()) })
			return vals.join(" ")
		}
	}



	async writeTiddler() {
		const dir = this.tiddlerdir()
		const path = this.tiddlerfile()
		const data = this.tiddlerdata()
		this.base.ensurePath(dir)
		console.log("Writing Tiddler:",path)
		await fs.writeFile(path,data)
	}

}
