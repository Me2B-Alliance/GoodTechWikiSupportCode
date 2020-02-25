import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import { Tiddler } from '../tiddlers'
import { lowerDottedSlug, lowerDashedSlug, ensureDir } from '../util'

export class TiddlyFileModel  {

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

	constructor(path:string) {
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
	fullPathFromElementInfo(base:string,tiddler:Tiddler,name?:string):string {
		const dir = path.join(
			this.baseDirFromElementInfo(base,tiddler),tiddler.title.trim())
		if(name)
			return path.join(dir,name)
		else
			return dir
	}

	relativePathFromTiddler(tiddler:Tiddler):string {
		switch(tiddler.element_classification) {
			case "map": {
				return path.join(this.paths.maps,
					lowerDashedSlug(tiddler.title),
					tiddler.element_type || 'unknown')
			}
			case "node": {
				return this.fullPathFromElementInfo(this.paths.nodes,tiddler,'wiki.tid')
			}
			case "metamodel": {
				return this.fullPathFromElementInfo(this.paths.metamodel.base,tiddler,'wiki.tid')
			}
		}
		return this.paths.base

	}

}
