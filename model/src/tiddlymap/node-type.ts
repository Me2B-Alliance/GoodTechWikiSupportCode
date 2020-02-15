import { TiddlyModel,SimpleTiddler } from '..'
import slugify from 'slugify'
import path from 'path'

const images = [
	"\\xff206",
	"\\xff207",
	"\\xff208",
	"\\xff209",
	"\\xff20a",
	"\\xff20b",
	"\\xff20c",
	"\\xff20d",
	"\\xff20e",
	"\\xff20f",
]
const imageMap = {
	"event": "\\xff417",
	"organization": "\\xff209", //"\\xff50c", // f0c0
	"project-or-product": "\\xff085",
	"publication": "\\xff026", // f518
	"working-group": "\\xff0b1", // f5ae, f6ec
	"person": "\\xff207"
}
let index = 0

export class NodeTypeTiddler extends SimpleTiddler  {
	/*
	created: 20190902112311677
	modified: 20190902112605892
	priority: 1
	scope: [field:element.type[working-group]]
	style: {"color":{"border":"rgba(146,233,110,1)","background":"rgba(252,53,129,1)"}}
	title: $:/plugins/felixhayashi/tiddlymap/graph/nodeTypes/working-group
	type: text/vnd.tiddlywiki
*/
	parts:string[]
	slugchain:string[]
	filepart:string
	dirchain?:string[]

	scope:string
	style:string
	faIcon:string
	twIcon:string

	constructor(parts:string[],base:TiddlyModel,fields:any={}) {
		super({
			created:fields.created,
			modified:fields.modified,
			type:fields.type,
			title:fields.title || "$:/plugins/felixhayashi/tiddlymap/graph/nodeTypes/"+parts.join("/"),
			fields:fields
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

		this.scope=fields.scope || '[field:element.type['+this.filepart+']]'
		this.style=fields.style || '{"color":{"border":"'+this.randomRGBA()+'","background":"'+this.randomRGBA()+'"}}'
		console.log("NODE TYPE:",parts)
		this.faIcon=fields['fa-icon'] || imageMap[parts[0]] || images[index % images.length]
		this.twIcon=fields['tw-icon'] || '' //images[index % images.length]
		index = index + 1
	}

	tiddlerdata():string {
		return super.tiddlerdata() +
		"scope: "+this.scope+"\n"+
		"style: "+this.style+"\n"+
		"fa-icon: "+this.faIcon+"\n"+
		"tw-icon: "+this.twIcon+"\n";
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
			return path.join(this.base.mapNodeTypesPath,this.dirchain.join("/"))
		else
			return this.base.mapNodeTypesPath;
	}

	tiddlerfile():string {
		return path.join(this.tiddlerdir(),this.filepart + ".tid")
	}

}

export class SimpleNodeTypeTiddler extends NodeTypeTiddler  {
}
