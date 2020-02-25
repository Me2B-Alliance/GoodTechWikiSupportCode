import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler,TiddlyFactory } from 'twiki-model'
import fs from 'fs-extra'
import path from 'path'
import { peopleFields } from 'twiki-model'

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

  makeAndLinkPeople(model:TiddlyModel,field:string,v:string,t:Tiddler) {
    let person = model.findNodeTitleMatch(v)
    if(!person) {
      person = LocalCommand.factory.createPerson(v)
      model.integrateTiddler(person)
      person.addEdge(t.guid,field)
    }

  }

  async dump(model:TiddlyModel) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        for(let f of peopleFields) {
          const v = t.getField(f)
          if(v)
            return true
          }
        return false
      },
      async (tiddler:Tiddler)=>{
        try {
          for(let f of peopleFields) {
            const v = tiddler.getFieldAsSet(f)
            if(v.size>0) {
              if(v.size==1) {
                const str = Array.from(v)[0]
                if(str.indexOf(";")>=0) {
                  console.log("Likely error in ",tiddler.title,f,"=",str)
                  v.clear()
                  for(let x of str.split(";"))
                    v.add(x)
                }
                else
                  console.log(f,str)
              }
              else {
                console.log(f,v)
              }
              v.forEach((name)=> {
                this.makeAndLinkPeople(model,f,name,tiddler)
              })
            }
          }
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
