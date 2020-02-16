import { TiddlyModel  } from '..'
import { TiddlerData,Tiddler  } from '.'
import { subtypeFields } from 'twiki-schema'

export interface ITiddlyFactory {

	//isNode:(t:TiddlerData) => boolean
	//isMetamodel:(t:TiddlerData) => boolean

	createTiddlerFromData:(data:TiddlerData) => Tiddler


}

export class TiddlyFactory implements ITiddlyFactory {

	constructor() {
	}


	createTiddlerFromData(data:TiddlerData):Tiddler {
		const fields = data.fields || {}

		function extractSubtype() {
			const t = fields['element.type']
			const f = subtypeFields[t] // this.slugify(f)
			//console.log("T,F",t,f)
			if(f) {
				const st = fields[f] as string || 'to-be-determined'
				//console.log(slugify(f),st)
				return st
			}
			return undefined
		}

		const ec = fields['element.classification']
		if(!ec) {
			throw new Error("Missing Element classification:" + JSON.stringify(data))
		}


		const et = fields['element.type']
		if(!et) {
			throw new Error("Missing Element type:" + JSON.stringify(data))
		}

		/*
		this.createNodeTiddler({
			..data,
			guid: xtract('tmap.id'),
			element_type: data.fields['element.type'],
			element_subtype: extractSubtype(fields)
		})
		*/

		throw new Error("not yet implemented")
	}


}
