import { TiddlyModel  } from '..'
import { TiddlerData,Tiddler,SimpleTiddler  } from '.'
import { subtypeFields } from 'twiki-schema'
import uuid from 'uuid'

export interface ITiddlyFactory {

	//isNode:(t:TiddlerData) => boolean
	//isMetamodel:(t:TiddlerData) => boolean

	createTiddlerFromData:(data:TiddlerData) => Tiddler


}

export class TiddlyFactory implements ITiddlyFactory {

	constructor() {
	}

	createPerson(name:string):Tiddler {
		return new SimpleTiddler({
			tiddler_classification:"node",
			element_type:"person",
			title:name,
			guid:uuid.v4()
		})
	}
	createMetamodel(type:string,name:string):Tiddler {
		return new SimpleTiddler({
			tiddler_classification:"metamodel",
			element_type:type,
			title:name,
			guid:uuid.v4()
		})
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

		const ec = fields['element.classification'] || data.tiddler_classification
		if(!ec) {
			throw new Error("Missing Element classification:" + JSON.stringify(data))
		}
		data.tiddler_classification = ec


		if(ec == 'node') {
			const et = fields['element.type'] || data.element_type
			if(!et) {
				throw new Error("Missing Element type:" + JSON.stringify(data))
			}
			data.element_type = et

			data.guid = data.guid || fields['tmap.id'] || uuid.v4()

			data.title = data.title || fields['title'] || "untitled "+et+" "+data.guid

			return new SimpleTiddler(data)
		}
		else {
			if(ec == 'metamodel' && data.fields) {
				data.fields['tmap.edges'] = undefined
			}
			return new SimpleTiddler(data)
		}



	}


}
