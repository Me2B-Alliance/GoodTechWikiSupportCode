import { TiddlyModel  } from '.'
import { TiddlerData,NodeTiddler,IEdgeTypeTiddler,INodeTypeTiddler,subtypeFields  } from './tiddlers'

export class ITiddlyFactory {

	isNode:(t:TiddlerData) => boolean
	isMetamodel:(t:TiddlerData) => boolean
	isSystem:(t:TiddlerData) => boolean

	createTiddler:(data:TiddlerData) => Tiddler

	createNodeTiddler:(data:TiddlerData) => NodeTiddler
	createSystemTiddler:(data:TiddlerData) => NodeTiddler

	createMetamodel:{
		edgeTypeTiddler:(data:TiddlerData) => EdgeTypeTiddler
		nodeTypeTiddler:(data:TiddlerData) => NodeTypeTiddler
	}

}

export class TiddlyFactory implements ITiddlyFactory {

	constructor() {
	}


	createNodeTiddler(data:TiddlerData):NodeTiddler {

		function xtract(name:string):any {
			if(!data.fields)
				return undefined

			const x = data.fields[name]
			data.fields[name] = undefined
			return x
		}

		function extractSubtype(fields:any) {
			const t = data.fields['element.type']
			const f = subtypeFields[t] // this.slugify(f)
			//console.log("T,F",t,f)
			if(f) {
				const st = data.fields[f] as string || 'to-be-determined'
				//console.log(slugify(f),st)
				return st
			}
			return undefined
		}

		const et = data.fields['element.type']
		if(!et) {
			console.log("Missing Element Type:",data)
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

	createEdgeTypeTiddler(parts:string[]):IEdgeTypeTiddler {
		throw new Error("not yet implemented")
	}
	createNodeTypeTiddler(parts:string[]):INodeTypeTiddler {
		throw new Error("not yet implemented")
	}

}
