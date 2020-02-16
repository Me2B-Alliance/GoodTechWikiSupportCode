import { TiddlyFileModel } from './filemap'
import { Tiddlymodel } from '..'
import { TiddlerFactory } from '../tiddlers/factory'

export class TiddlyModelReader {

	files:TiddlyFileModel
  model:TiddlyModel

	constructor(
    files:TiddlyFileModel,
    options:{
      factory?:TiddlerFactory,
      model?:TiddlyModel}
    }
  ) {
		this.files = files
    this.factory = options.factory || new TiddlerFactory()
    this.model = options.model || new TiddlyModel()
	}


  readTiddlerFile(path:string):{
    fields:TiddlerFieldMap,
    body:string
  }) {
		const data = fs.readFileSync(path,'utf8')
		const sections = data.split("\n\n")
		const header = (sections.shift() || '').split("\n")
		const body = sections.join("\n\n")
		const fields = new Map<string,TiddlerFieldDatum>()
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

	loadTiddlerData(path:string):TiddlerData {
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
		return {
			created,
			modified,
			title,
			type,
			fields,
			wiki_text:body
		}
	}

	loadTiddler(path:string,type_hint:string,factory:ITiddlyFactory):Tiddler {
		const TD = this.loadTiddlerData(path)
    const tiddler = this.factory.createTiddlerFromData(TD)
    this.model.integrateTiddler(tiddler)
    return tiddler
	}

	async load(factory:ITiddlyFactory):Promise<void> {
		return new Promise<void>((resolve,reject) => {
			klaw(this.paths.base)
				.on('data', item => {
					const p = item.path
					if(fs.statSync(p).isFile() && p.endsWith(".tid"))
						this.loadTiddler(p,"node",factory)
				})
				.on('end', () => {
					console.log("Loaded Tiddly from ",this.path)
					resolve()
				}) // => [ ... array of files]
		})
	}



}
