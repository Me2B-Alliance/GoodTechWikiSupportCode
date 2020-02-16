import slugify from 'slugify'
import path from 'path'
import uuid from 'uuid'
import fs from 'fs-extra'
import { TiddlyModel,tiddlydate,TIDDLERTYPE } from '..'

export type TiddlerFieldDatum = string|Set<string>

export type TiddlerFieldMap = Map<string,TiddlerFieldDatum>

export interface TiddlerData {
	created?: tiddlydate
	modified?: tiddlydate
	title?:string
	type?:string
	guid?:string
	fields?:TiddlerFieldMap
	wiki_text?:string
	element_classification?:string
	element_type?:string
	element_subtype?:string
	element_microtype?:string
}

// Tiddler
export interface Tiddler extends TiddlerData  {
	// this field is rendered as 'tmap_id'
	guid:string

	// These are defined as part of the core tiddler standard, they
  // are shadowed in the bsae tiddler
	created: tiddlydate
	modified: tiddlydate
	title:string
	type:string

	// these are the body and fields
	wiki_text:string
	fields:TiddlerFieldMap

	// this is the FileSystem Positioning & Typing System
	element_classification:string //
	element_type?:string
	element_subtype?:string
	element_microtype?:string

	// generic field access
	getField:(field:string) => TiddlerFieldDatum|undefined
	setField:(field:string, value:TiddlerFieldDatum) => void
}

// --------------------------------------------------------------------------
// Impelementation
export class SimpleTiddler implements Tiddler
{
	wiki_text:string
	fields:TiddlerFieldMap

	public get guid(): string {
    return this.fields['tmap.id'];
  }
  public set guid(value: string){
		this.fields['tmap.id'] = value
  }

	public get created(): tiddlydate {
		return this.fields['created'];
  }
  public set created(value: tiddlydate){
		this.fields['created'] = value
  }

	public get modified(): tiddlydate {
		return this.fields['modified'];
  }
  public set modified(value: tiddlydate){
		this.fields['modified'] = value
  }

	public get title(): string {
		return this.fields['title'];
	}
	public set title(value: string){
		this.fields['title'] = value
	}

	public get type(): string {
		return this.fields['type'];
  }
  public set type(value: string){
		this.fields['type'] = value
  }


	public get element_classification(): string {
		return this.fields['element.classification'];
	}
	public set element_classification(value: string){
		this.fields['element.classification'] = value
	}

	public get element_type(): string|undefined {
		return this.fields['element.type']
	}
	public set element_type(value: string|undefined){
		this.fields['element.type'] = value
	}

	public get element_subtype(): string|undefined {
		return this.fields['element.subtype']
	}
	public set element_subtype(value: string|undefined){
		this.fields['element.subtype'] = value
	}

	public get element_microtype(): string|undefined {
		return this.fields['element.microtype']
	}
	public set element_microtype(value: string|undefined){
		this.fields['element_microtype'] = value
	}


	public getField(field:string): TiddlerFieldDatum|undefined {
		return this.fields[field]

	}
	public setField(field:string, value:TiddlerFieldDatum){
		if(!value)
			value=""
		/*
			if(typeof value === "string") {
				const memberRegExp = /(?:^|[^\S\xA0])(?:\[\[(.*?)\]\])(?=[^\S\xA0]|$)|([\S\xA0]+)/mg
				const results = new Set<string>()
				const names = {}
				let match = false
				do {
					match = memberRegExp.exec(value);
					if(match) {
						 var item = match[1] || match[2];
						 if(item)
						 	results.add(item)
					}
				} while(match);
				if(
				if
				*/
		this.fields[field] = "value".trim()
	}

	constructor(data:TiddlerData) {
		this.guid = data.guid || uuid.v4()

		this.title = data.title || "untitled"
		this.created = data.created || Date.now()
		this.modified = data.modified || Date.now()
		this.type = data.type || TIDDLERTYPE

		this.wiki_text = data.wiki_text || 'No body provided'
		this.fields = data.fields || new Map<string,TiddlerFieldDatum>()

		this.element_classification = data.element_classification || 'unknown'
		this.element_type = data.element_type || 'unknown type'
		this.element_subtype = data.element_subtype
		this.element_microtype = data.element_microtype
	}

}

export * from './factory'

export function mapFields(fields:any):Map<string,TiddlerFieldDatum> {
	const result = new Map<string,TiddlerFieldDatum>()
	for(let key in fields) {
		result[key] = fields[key]
	}
	return result
}
