import slugify from 'slugify'
import path from 'path'
import uuid from 'uuid'
import fs from 'fs-extra'
import { TiddlyModel,tiddlydate,TIDDLERTYPE } from '..'
import { getSubTypeFieldName } from '../util'
import { subtypeFields } from 'twiki-schema'


export type TiddlerFieldDatum = string|Set<string>

export type TiddlerFieldMap = Map<string,TiddlerFieldDatum>

export function extractTiddlerFieldDatum(value:string):TiddlerFieldDatum {
	if(value.startsWith("[[")) {
		const termset = new Set<string>()
		const match = value.split("[[")
		for(let m of match) {
			const s = m.replace("]]","")
			if(s)
				termset.add(s.trim())
		}
		return termset
	}
	else {
		return value
	}
}

export interface TiddlerData {
	created?: tiddlydate
	modified?: tiddlydate
	title?:string
	type?:string
	guid?:string
	fields?:TiddlerFieldMap
	wiki_text?:string
	element_classification?:string

	// these are for subclass "Node Type"
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

	// these are for subclass "Node Type"
	element_type?:string
	element_subtype?:string
	element_microtype?:string

	// generic field access
	getField:(field:string) => TiddlerFieldDatum|undefined
	getFieldAsString:(field:string) => string|undefined
	getFieldAsSet:(field:string) => Set<string>
	setField:(field:string, value:TiddlerFieldDatum) => void

	getEdges:() => any
	addEdge:(to:string,reason:string) => void
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

	_edges:any
	public getEdges(): any {
		if(this._edges)
			return this._edges
		try {
			const result = {}
			const raw = JSON.parse(this.fields['tmap.edges'] || "{}");
			for(let edgeId in raw) {
				const edge = raw[edgeId]
				let links = result[edge.to]
				const why = edge.type
				if(!links) {
					links = {} as any
					result[edge.to] = links
				}
				if(!links[why]) {
					links[why] = edgeId
				}
			}
			this._edges = result
	    return result
		}
		catch(E) {
			console.log(this.fields['tmap.edges'])
			throw E
		}
  }
	public addEdge(to:string,reason:string) {
		this.getEdges()
		let e = this._edges[to]
		if(!e) {
			e={}
			this._edges[to]=e
		}
		if(!e[reason])
			e[reason]=uuid.v4()

		this.fields['tmap.edges']=JSON.stringify(this._edges)
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
		this.error_if_not_used_on_subclass("node")
		return this.fields['element.type'] || 'unknown'
	}
	public set element_type(value: string|undefined){
		this.error_if_not_used_on_subclass("node")
		if(!value)
			delete this.fields['element.type']
		else
			this.fields['element.type'] = value
	}

	public get element_subtype(): string|undefined {
		this.error_if_not_used_on_subclass("node")
		const fieldName = getSubTypeFieldName(this.element_type)
		return this.getFieldAsString(fieldName)
	}
	public set element_subtype(value: string|undefined){
		this.error_if_not_used_on_subclass("node")
		const fieldName = getSubTypeFieldName(this.element_type)
		if(this.element_type != 'person') {
			console.log("SETTING ELEMENT SUBTYPE",this.element_type,fieldName,value)
			if(!value)
				delete this.fields[fieldName]
			else
				this.setField(fieldName,value)
			}
	}

	public get element_microtype(): string|undefined {
		this.error_if_not_used_on_subclass("node")
		return this.fields['element.microtype']
	}
	public set element_microtype(value: string|undefined){
		this.error_if_not_used_on_subclass("node")
		if(!value)
			delete this.fields['element.microtype']
		else
			this.fields['element.emicrotype'] = value
	}


	public getField(field:string): TiddlerFieldDatum|undefined {
		return this.fields[field]
	}
	public getFieldAsString(field:string): string|undefined {
		const val = this.fields[field]
		if(val) {
			if(typeof val === "string") {
				return val
			}
			else {
				let result = ""
				val.forEach((r) => {
					result = "[["+r+"]] "+result
				})
				return result
			}
		}
		else
			return val
	}
	public getFieldAsSet(field:string): Set<string> {
		const result = new Set<string>()
		const val = this.fields[field]
		if(val) {
			if(typeof val === "string") {
				result.add(val)
				return result
			}
			else {
				return val
			}
		}
		return result
	}
	public setField(field:string, value:TiddlerFieldDatum){
		if(!value)
			value=""

		function stringify():string {
			if(typeof value === "string") {
				return value
			}
			else {
				const r = Array.from(value)
				if(r.length == 1)
					return r[0]

				let result = ""
				value.forEach((r) => {
					result = "[["+r+"]] "+result
				})
				return result
			}
		}

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
		this.fields[field] = stringify().trim()
	}

	constructor(data:TiddlerData) {
		this.fields = data.fields || new Map<string,TiddlerFieldDatum>()

		this.guid = data.guid || uuid.v4()

		this.title = data.title || this.fields['title'] || "untitled"
		this.created = data.created || this.fields['created'] ||Date.now()
		this.modified = data.modified || this.fields['modified'] ||Date.now()
		this.type = data.type || this.fields['type'] || TIDDLERTYPE

		this.wiki_text = data.wiki_text || 'No body provided'

		this.element_classification = data.element_classification || 'unknown'

		if(this.element_classification == 'node') {
			this.constructor_node_tiddler(data)
		}

	}

	constructor_node_tiddler(data:TiddlerData):void {
		this.element_type = data.element_type
		this.element_subtype = data.element_subtype || (data.fields || {})[getSubTypeFieldName(data.element_type)]
		this.element_microtype = data.element_microtype
	}

	error_if_not_used_on_subclass(classification:string):void {
		if(this.element_classification != classification)
			throw new Error("Attempt to access node-tiddler fields on non-node tiddler")
	}


}

export * from './factory'

export function mapFields(fields:any):Map<string,TiddlerFieldDatum> {
	const result = new Map<string,TiddlerFieldDatum>()
	for(let key in fields) {
		result[key] = extractTiddlerFieldDatum(fields[key])
	}
	return result
}
