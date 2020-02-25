import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler,TiddlyFactory } from 'twiki-model'
import fs from 'fs-extra'
import path from 'path'
import { peopleFields,lowerDashedSlug } from 'twiki-model'

function checkTiddlerDir(arg:string) {
  // should check to see if path exists
  return arg
}

export default class LocalCommand extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    //// flag with a value (-i, --input=VALUE)
    path: flags.option({
        char: 'p',               // name of arg to show in help and reference with args[name]
        name: 'path',               // name of arg to show in help and reference with args[name]
        required: true,            // make the arg required with `required: true`
        description: 'tiddler base', // help description
        hidden: false,               // hide this arg from help
        parse: input => checkTiddlerDir(input),
        default: './input',           // default value if no arg input
        options: undefined // ['a', 'b'],        // only allow input to be from a discrete set
      }),
  }

  static args = []
  static factory = new TiddlyFactory()

  async dump_nodes(model:TiddlyModel):Promise<any> {
    const tiddlerDataPromises = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'node'
      },
      async (tiddler:Tiddler)=>{
        try {
          const datum={
            guid:tiddler.guid,
            title:tiddler.title,
            description:tiddler.wiki_text,
            element_type:tiddler.element_type,
            element_subtype:tiddler.element_subtype,
            ...tiddler.fields
          }
          return datum
        }
        catch(E) {
          console.log("Error scanning",E)
          throw E
        }
      })

    const tiddlerData = await Promise.all(tiddlerDataPromises)

    const data = {
      byGuid:{},
      byTitleSlug:{},
      types:{}
    }
    function ensure(ref:any,element:string):any {
      if(!ref[element])
        ref[element]={}
      return ref[element]
    }
    for(let datum of tiddlerData) {
      data.byGuid[datum.guid] = datum
      data.byTitleSlug[datum.guid] = datum
      const elt_type = ensure(data.types,datum.element_type)
      const elt_subtype = ensure(elt_type,datum.element_subtype)
      elt_subtype[datum.title] = datum
    }

    const filename = "/tmp/nodes.json"
    console.log("Writing ",filename)
    await fs.writeFile(filename,JSON.stringify(data,null,2))
  }
  async dump_metamodel(model:TiddlyModel):Promise<any> {
    const tiddlerDataPromises = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel'
      },
      async (tiddler:Tiddler)=>{
        try {
          const datum={
            guid:tiddler.guid,
            title:tiddler.title,
            description:tiddler.wiki_text,
            metamodel_type:tiddler.metamodel_type,
            metamodel_subtype:tiddler.metamodel_subtype,
            ...tiddler.fields
          }
          return datum
        }
        catch(E) {
          console.log("Error scanning",E)
          throw E
        }
      })

    const tiddlerData = await Promise.all(tiddlerDataPromises)

    const data = {
      byGuid:{},
      byTitleSlug:{},
      types:{}
    }
    function ensure(ref:any,element:string):any {
      if(!ref[element])
        ref[element]={}
      return ref[element]
    }
    for(let datum of tiddlerData) {
      data.byGuid[datum.guid] = datum
      data.byTitleSlug[datum.guid] = datum
      const elt_type = ensure(data.types,datum.metamodel_type)
      const elt_subtype = ensure(elt_type,datum.metamodel_subtype)
      elt_subtype[datum.title] = datum
    }

    const filename = "/tmp/metamodel.json"
    console.log("Writing ",filename)
    await fs.writeFile(filename,JSON.stringify(data,null,2))
  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const reader = await loadModelFromPath(flags.path)
      await this.dump_nodes(reader.model)
      await this.dump_metamodel(reader.model)
      }
  }
}
