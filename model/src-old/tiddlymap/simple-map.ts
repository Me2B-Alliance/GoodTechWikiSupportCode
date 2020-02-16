import { TiddlyModel } from '..'
import { TiddlyMap } from '.'
import fs from 'fs-extra'
import uuid from 'uuid'
import path from 'path'
import cytoscape from 'cytoscape'

export class SimpleTiddlyMap implements TiddlyMap {
	model:TiddlyModel
	name:string
	description:string
	nodes:Set<string>
	edges:Set<string>
	positions:Map<string,Position>
	edgeFilter:string
	nodeFilter:string
	layoutData:string

	guid:string
	viewbase:string
	tiddlerFile:string
	layoutFile:string
	edgeFilterFile:string
	nodeFilterFile:string


	constructor(name:string,base:TiddlyModel) {
		this.model = base
		this.name = name
		this.nodes = new Set<string>()
		this.edges = new Set<string>()
		this.positions = new Map<string,Position>()
		this.description = ''

		this.guid = uuid.v4()
		this.viewbase = base.ensurePath(base.mapViews,this.name)
		this.tiddlerFile = path.join(this.viewbase,"tiddler.tid")
		this.edgeFilterFile = path.join(this.viewbase,"edges.tid")
		this.nodeFilterFile = path.join(this.viewbase,"nodes.tid")
		this.layoutFile = path.join(this.viewbase,"layout.tid")

		const ld:any = {}
		this.edgeFilter = ''
		this.nodeFilter = ''
		this.layoutData = JSON.stringify(ld,null,3)
	}

	useExplicitNodeFilter() {
		this.nodes.forEach((val:string) => {
			this.nodeFilter += "[field:tmap.id["+val+"]] "
		})
	}

	useExplicitEdgeFilter() {
		for(let e in this.edges) {
			this.edgeFilter += "[field:tmap.id["+e+"]] "
		}
	}

	async layoutGraph() {
		const n2 = [] as any[]
	  for(let x in this.nodes) {
			const node = this.model.nodeMap[x]
	    n2.push({
	      data:node
	    })
			console.log("Process Edgemap",node.edgemap)
	  }
		const e2 = [] as any[]
	  for(let x in this.edges) {
	    e2.push({
	      data:x
	    })
	  }
	  var cy = cytoscape({
	    headless: true,
	    elements: [
	      ...n2,
	      ...e2
	    ]
	  })
	  var layout = cy.elements().layout({
	    name: 'cose'
	  });
	  layout.run();

	  console.log("LAYOUT COMPLETE")
	  for(let x of cy.elements().jsons() ) {
			const elt = JSON.parse(x)
	    console.log("POS:",elt.data.id,elt.position)
	  }
	}

	async save() {

		console.log("Writing View Tiddler File:",this.tiddlerFile)
		await fs.writeFile(this.tiddlerFile,this.tiddlerdata())

		console.log("Writing View Tiddler File:",this.edgeFilterFile)
		await fs.writeFile(this.edgeFilterFile,this.edgedata())

		console.log("Writing View Tiddler File:",this.nodeFilterFile)
		await fs.writeFile(this.nodeFilterFile,this.nodedata())

		console.log("Writing View Tiddler File:",this.layoutFile)
		await fs.writeFile(this.layoutFile,this.layoutdata())

	}

	tiddlerdata():string {
		return ""+
			"id:" + this.guid + "\n" +
			"isview:" + true + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "\n" +
			"\n" + this.description + "\n";
	}
	edgedata():string {
		return ""+
			"filter:" + this.edgeFilter + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/edges\n" +
			"\n";
	}
	nodedata():string {
		return ""+
			"type: text/vnd.tiddlywiki" + "\n" +
			"filter:" + this.nodeFilter + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/nodes\n" +
			"\n";
	}
	layoutdata():string {
		return ""+
			"type: text/vnd.tiddlywiki" + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/map\n" +
			"\n" + this.layoutData + "\n";
	}

}
