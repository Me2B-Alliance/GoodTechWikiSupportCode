import { TiddlyModel,SimpleTiddler } from '..'
import slugify from 'slugify'
import path from 'path'

export class EdgeTypeTiddler extends SimpleTiddler  {
	parts:string[]
	slugchain:string[]
	filepart:string
	dirchain?:string[]

	style:string
	constructor(parts:string[],base:TiddlyModel) {
		super({
			title:"$:/plugins/felixhayashi/tiddlymap/graph/edgeTypes/"+parts.join("/")
		},base)
		this.parts = parts
		this.slugchain=[]
		const len = this.parts.length
		for(let idx in parts)
			this.slugchain[idx]=slugify(parts[idx])
		if (len == 1) {
			this.filepart = this.slugchain[0]
			this.dirchain = undefined
		}
		else {
			this.filepart = this.slugchain[len-1]
			this.dirchain=this.slugchain.slice(0,len-1)
			}

		//this.style='{"color":{"color":"'+this.randomRGBA()+'"},"width":'+Math.round(1+15*Math.random())+'}'
		this.style='{"color":{"color":"'+this.randomRGBA()+'"},"width":'+Math.round(1+3*Math.random())+'}'

	}

	tiddlerdata():string {
		return super.tiddlerdata() +
		"style: "+this.style+"\n";
	}

	randomRGBA():string {
		return 'rgba('
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+')'
	}

	tiddlerdir():string {
		if(this.dirchain)
			return path.join(this.base.mapEdgeTypesPath,this.dirchain.join("/"))
		else
			return this.base.mapEdgeTypesPath;
	}

	tiddlerfile():string {
		return path.join(this.tiddlerdir(),this.filepart + ".tid")
	}

}

export class SimpleEdgeTypeTiddler extends EdgeTypeTiddler  {
}
