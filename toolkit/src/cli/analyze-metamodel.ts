import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler } from 'twiki-model'
import { Analyzer } from '../analyzer'

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
    field: flags.option({
        char: 'f',               // name of arg to show in help and reference with args[name]
        name: 'field',               // name of arg to show in help and reference with args[name]
        required: true,            // make the arg required with `required: true`
        description: 'field to index', // help description
        hidden: false,               // hide this arg from help
        parse: input => checkTiddlerDir(input),
        default: 'activities:purpose:tech.focus:digital.harms.addressed',           // default value if no arg input
        options: undefined // ['a', 'b'],        // only allow input to be from a discrete set
      })
  }

  static args = []

  async analyzefield(model:TiddlyModel,field:string):Promise<Set<string>> {
    const termset = new Set<string>()
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.element_classification == 'node'
      },
      async (tiddler:Tiddler)=>{
        try {
          const data = tiddler.fields[field]
          if(data) {
            if(data.indexOf(":")>=0) {
              const parts = data.split(":")
              for(let p of parts) {
                termset.add(p.trim().toLowerCase())
              }
            }
            else {
              const match = data.split("[[")
              const terms = [] as string []
              for(let m of match) {
                const s = m.replace("]]","")
                if(s)
                  termset.add(s.trim().toLowerCase())
              }
            }
          }
        }
        catch(E) {
          console.log("Error analyzing",field,E)
        }
      })
    return termset
  }
  async analyze(model:TiddlyModel,fields:string[]):Promise<any> {
    for(let field of fields) {
      const termset = await this.analyzefield(model,field)

      for(let s of termset) {
        const elt = model.metamodel.byTitle.get(s)
        if(!elt)
          console.log("Not found '"+s+"' for field "+field)
      }

    }
  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path && flags.field) {
	    const model = await loadModelFromPath(flags.path)
      const termset = await this.analyze(model,flags.field.split(":"))
      }
  }
}
