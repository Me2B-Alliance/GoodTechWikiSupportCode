import slugify from 'slugify'
import fs from 'fs-extra'
import klaw from 'klaw'


export class TiddlyFilesystemBase  {

	path:string
	nodesPath:string
	nodeMap:Map<string,NodeTiddler>
	mapViews:string
	mapEdgeTypesPath:string
	edgeTypes:EdgeTypeTiddler[]
	mapNodeTypesPath:string
	nodeTypes:NodeTypeTiddler[]
	system:string
	templates:string
	namedMaps:Set<string>
	schemas:any

	constructor(path:string) {
		this.path = this.ensurePath(path)
		this.nodesPath = this.ensurePath(path,"nodes")
		this.system = this.ensurePath(path,"system")
		this.templates = this.ensurePath(path,"templates")
		const mapsDir = this.ensurePath(path,"maps")
		this.mapViews = this.ensurePath(mapsDir,"views")
		this.mapEdgeTypesPath = this.ensurePath(mapsDir,"edgeTypes")
		this.mapNodeTypesPath = this.ensurePath(mapsDir,"nodeTypes")

		this.nodeMap = new Map<string,NodeTiddler>()
		this.edgeTypes = []
		this.nodeTypes = []
		this.namedMaps = new Set<string>()

		this.schemas = schemas
	}

	registerNamedMap(name:string):void {
		this.namedMaps.add(slugify(name,{lower:true}))
	}

	nodes() {
		const n=[] as NodeTiddler[]
		for(let nid in this.nodeMap) {
			const node = this.nodeMap[nid]
			n.push(node)
			}
		return n
	}

	readTiddlerFile(path:string):any {
		const data = fs.readFileSync(path,'utf8')
		const sections = data.split("\n\n")
		const header = (sections.shift() || '').split("\n")
		const body = sections.join("\n\n")
		const fields = new Map<string,string>()
		for(let line of header) {
			const l2=line.trim()
			if(l2) {
				const blocks = line.split(":")
				const key = blocks.shift()
				if(key) {
					const value = blocks.join(":").trim()
					fields[key] = value
				}
			}
		}

		return { fields, body }
	}

  loadNodeTiddler(path:string):void {
		const { fields, body } = this.readTiddlerFile(path)

		function xtract(name:string):any {
			const x = fields[name]
			fields[name] = undefined
			return x
		}
		const created = xtract('created') as tiddlydate
		const modified = xtract('modified') as tiddlydate
		const title = xtract('title') as string
		const type = xtract('type') as string
		const slugify = this.slugify //ctx.me2b.slugify

		function extractSubtype(fields:any) {
			const t = fields['element.type']
			const f = subtypeFields[t]
			//console.log("T,F",t,f)
			if(f) {
				const st = fields[slugify(f)] || 'to-be-determined'
				//console.log(slugify(f),st)
				return st
			}
			return undefined
		}

		const et = fields['element.type']
		if(!et) {
			console.log("Missing Element Type:",path)
		}
		this.createNodeTiddler({
			created: created,
			modified: modified,
			title: title,
			type: type,
			guid: fields['tmap.id'],
			fields: fields,
			text: body,
			element_type: fields['element.type'],
			element_subtype: extractSubtype(fields)
		})
	}
  loadNodeTypeTiddler(path:string):NodeTypeTiddler|undefined {
		const { fields, body } = this.readTiddlerFile(path)

		function xtract(name:string):any {
			const x = fields[name]
			fields[name] = undefined
			return x
		}
		const created = xtract('created') as tiddlydate
		const modified = xtract('modified') as tiddlydate
		const title = xtract('title') as string
		const type = xtract('type') as string
		const slugify = this.slugify //ctx.me2b.slugify

		function extractSubtype(fields:any) {
			const t = fields['element.type']
			const f = subtypeFields[t]
			//console.log("T,F",t,f)
			if(f) {
				const st = fields[slugify(f)] || 'to-be-determined'
				//console.log(slugify(f),st)
				return st
			}
			return undefined
		}

		const et = fields['element.type']
		if(!et) {
			console.log("Missing Element Type:",path)
		}
		const result = new NodeTypeTiddler([
      fields['element.type'],
      extractSubtype(fields)
    ],this,fields)
		this.nodeTypes.push(result)
		return result
	}

	async load():Promise<void> {
		return new Promise<void>((resolve,reject) => {
      klaw(this.nodesPath)
			  .on('data', item => {
					const p = item.path
					if(fs.statSync(p).isFile() && p.endsWith(".tid"))
						this.loadNodeTiddler(p)
				})
			  .on('end', () => {
					console.log("Loaded Tiddly from ",this.path)
					resolve()
				}) // => [ ... array of files]
        klaw(this.mapNodeTypesPath)
  			  .on('data', item => {
  					const p = item.path
  					if(fs.statSync(p).isFile() && p.endsWith(".tid"))
  						this.loadNodeTypeTiddler(p)
  				})
  			  .on('end', () => {
  					console.log("Loaded Tiddly Type from ",this.path)
  					resolve()
  				}) // => [ ... array of files]
			})
	}

	async save():Promise<void> {
		console.log("Writing Nodes");
		for(let node of this.nodes()) {
			const dir = node.tiddlerdir()
			const path = node.tiddlerfile()
			const data = node.tiddlerdata()
			await this.ensurePath(dir)
			//console.log("Writing Tiddler:",path)
			await fs.writeFile(path,data)

			const map = new NeighborMap(node,this)
			await map.save()
		}

		console.log("Writing Edge Types");
		for(let type of this.edgeTypes) {
			const dir = type.tiddlerdir()
			const path = type.tiddlerfile()
			const data = type.tiddlerdata()
			await this.ensurePath(dir)
			console.log("Writing Edge Type:",path)
			await fs.writeFile(path,data)
		}

		console.log("Writing Node Types");
		for(let type of this.nodeTypes) {
			const dir = type.tiddlerdir()
			const path = type.tiddlerfile()
			const data = type.tiddlerdata()
			await this.ensurePath(dir)
			console.log("Writing Node Type:",path)
			await fs.writeFile(path,data)
		}

		console.log("Writing named maps")
		await this.namedMaps.forEach(async (title) => {
			const map = new SimpleTiddlyMap(title,this)
			map.nodeFilter = '[contains:tmap.names['+title+']]'
			map.edgeFilter = '[all[tiddlers]]'
			await map.save()
		})
	}

	slugify(x:string) : string {
		const slug=
			slugify(x, {
				replacement: '.',    // replace spaces with replacement
				//remove: null,        // regex to remove characters
				lower: true,         // result in lower case
			})
		return ''+slug
	}

	ensurePath(base:string,dir?:string):string {
		// make sure this exists
		let path = base;
		if (dir)
			path = base + "/" + dir
		fs.ensureDirSync(path)
		return path
	}

	createNodeTiddler(data:TiddlerData):NodeTiddler {
		const result = new SimpleNodeTiddler(data,this)
		//console.log("Node Tiddler:",result.tiddlerfile())
		this.nodeMap[result.guid] = result
		return result
	}
	createEdgeTypeTiddler(parts:string[]):EdgeTypeTiddler {
		const result = new EdgeTypeTiddler(parts,this)
		this.edgeTypes.push(result)
		return result
	}
	createNodeTypeTiddler(parts:string[]):NodeTypeTiddler {
		const result = new NodeTypeTiddler(parts,this)
		this.nodeTypes.push(result)
		return result
	}

}
