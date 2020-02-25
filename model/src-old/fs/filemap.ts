import fs from 'fs-extra'
import klaw from 'klaw'
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
		this.paths = {
			base:ensureDir(path),
			nodes:ensureDir(path,"nodes"),
			maps:ensureDir(path,"maps"),
			metamodel:{
				base:ensureDir(path,"metamodel"),
				edgeType:ensureDir(path,"metamodel","edgeTypes"),
				nodeType:ensureDir(path,"metamodel","nodeTypes"),
				definition:ensureDir(path,"metamodel","definition"),
				dimension:ensureDir(path,"metamodel","dimension")
			}
		}
	}

	relativePathFromElementInfo(base:string,tiddler:Tiddler) {
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

	}

	relativePathFromTiddler(tiddler:Tiddler):string {
		switch(tiddler.tiddler_classification) {
			case "map": {
				return path.join(this.paths.maps,
					lowerDashedSlug(tiddler.title),
					tiddler.element_type)
			}
			case "node": {
				return relativePathFromElementInfo(this.paths.nodes,tiddler)
			}
			case "metamodel": {
				return relativePathFromElementInfo(this.paths.metamodel.base,tiddler)
			}
			return this.paths.base
		}

	}

}
