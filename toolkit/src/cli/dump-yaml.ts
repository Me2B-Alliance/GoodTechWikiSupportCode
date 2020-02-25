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

  async dump(model:TiddlyModel):Promise<any> {
    const data = {}
    function ensure(ref:any,element:string):any {
      if(ref[element])
        return ref[element]
      ref[element]={}
      return ref[element]
    }
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'node'
      },
      async (tiddler:Tiddler)=>{
        try {
          data[tiddler.element_type][tiddler.element_subtype][tiddler.title]={
            guid:tiddler.guid,
            title:tiddler.title,
            description:tiddler.wiki_text
          }
        }
        catch(E) {
          console.log("Error scanning",E)
        }
      })
      return data
  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const reader = await loadModelFromPath(flags.path)
      await this.dump(reader.model)
      }
  }
}
