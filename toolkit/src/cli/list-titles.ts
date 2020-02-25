import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler } from 'twiki-model'
import { Analyzer } from '../analyzer'
import fs from 'fs-extra'
import path from 'path'

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

  async dump(model:TiddlyModel) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return true
      },
      async (tiddler:Tiddler)=>{
        try {
          console.log(tiddler.tiddler_classification,tiddler.title)
        }
        catch(E) {
          console.log("Error scanning",E)
        }
      })
  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const reader = await loadModelFromPath(flags.path)
      await this.dump(reader.model)
      }
  }
}
