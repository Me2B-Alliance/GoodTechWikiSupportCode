import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import { TiddlyModel } from '..'
import { Tiddler } from '../tiddlers'
import { lowerDottedSlug, lowerDashedSlug, ensureDir } from '../util'

export class TiddlyFileModel  {

	model:TiddlyModel

	paths:{
		base:string
		nodes:string
		maps:string
		metamodel:{
			base:string,
			definition:string,
			nodeType:string,
			edgeType:string,
			dimension:string
		}
	}

	constructor(path:string,model:TiddlyModel) {
		this.model = model

		const mm_base = ensureDir(path,"metamodel")
		this.paths = {
			base:ensureDir(path),
			nodes:ensureDir(path,"nodes"),
			maps:ensureDir(path,"maps"),
			metamodel:{
				base:mm_base,
				edgeType:ensureDir(mm_base,"edgeTypes"),
				nodeType:ensureDir(mm_base,"nodeTypes"),
				definition:ensureDir(mm_base,"definition"),
				dimension:ensureDir(mm_base,"dimension")
			}
		}
	}

	baseDirFromElementInfo(base:string,tiddler:Tiddler):string {
		if(!tiddler.element_type)
			return base
		else {
			const et = lowerDashedSlug(tiddler.element_type)
			if(!tiddler.element_subtype)
				return path.join(base,et)
			else {
				const st = lowerDashedSlug(tiddler.element_subtype)
				if(!tiddler.element_microtype)
					return path.join(base,et,st)
				else
					return path.join(base,et,st,lowerDashedSlug(tiddler.element_microtype))
				}
			}
	}
	fullPathFromElementInfo(tiddler:Tiddler,name?:string):string {
		const base = this.paths.nodes
		const dir = path.join(
			this.baseDirFromElementInfo(base,tiddler),tiddler.title.trim())
		if(name)
			return path.join(dir,name)
		else
			return dir
	}

	fullPathFromMetamodelInfo(tiddler:Tiddler,suffix:string):string {
		const base = this.paths.metamodel.base
		return path.join(
			base,
			tiddler.metamodel_type,
			tiddler.metamodel_subtype,
			tiddler.title.trim(),
			suffix
		)
	}

	relativePathFromTiddler(tiddler:Tiddler):string {
		switch(tiddler.tiddler_classification) {
			case "map": {
				const baseTiddlerId = tiddler.map_base
				if(baseTiddlerId) {
					const baseTiddler = this.model.tiddlerForGuid(baseTiddlerId)
					if(baseTiddler) {
						console.log("Base",baseTiddlerId,baseTiddler.title)
						const basePath = this.relativePathFromTiddler(baseTiddler)
						if(tiddler.map_type) {
							const baseDir = path.join(path.dirname(basePath),tiddler.map_type)
							console.log("---->",baseDir)
							if(tiddler.map_role) {
								return path.join(baseDir,tiddler.map_role+".tid")
							}
						}
					}
				}
				// this should be an error
				return path.join(this.paths.maps,
					lowerDashedSlug(tiddler.general_type),
					lowerDashedSlug(tiddler.general_subtype),
					lowerDashedSlug(tiddler.title)
				)
			}
			case "node": {
				return this.fullPathFromElementInfo(tiddler,'wiki.tid')
			}
			case "metamodel": {
				return this.fullPathFromMetamodelInfo(tiddler,'wiki.tid')
			}
		}
		return this.paths.base

	}

}
