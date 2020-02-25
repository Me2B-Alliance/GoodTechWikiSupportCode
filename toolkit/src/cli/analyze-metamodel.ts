import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler,TiddlyFactory,TiddlyModelReader } from 'twiki-model'
import { Analyzer } from '../analyzer'
import { taglikeFields } from 'twiki-model'

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
      })
  }

  static args = []
  static factory = new TiddlyFactory()

  handleTag(model:TiddlyModel,field:string,v:string,t:Tiddler) {
    const mmtype = taglikeFields[field]
    let metamodel = model.findNodeTitleMatch(v)
    if(!metamodel) {
      //console.log("Metamodel Not Found",mmtype,field,v,t.title)
      metamodel = LocalCommand.factory.createMetamodel(mmtype,v)
      model.integrateTiddler(metamodel)
      //person.addEdge(t.guid,field)
    }
    else {
      if(metamodel.tiddler_classification!='metamodel')
        console.log("ERROR",metamodel.general_type,metamodel.title,"Value",v,"in field",field,"of",t.title)
      else
        console.log("Metamodel FOUND : '"+field+"'='"+v+"', MMTYPE:",mmtype,"Orig:",metamodel.general_type,metamodel.general_subtype)
    }
  }

  async analyze(model:TiddlyModel) {
    const factory = new TiddlyFactory
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        for(let f in taglikeFields) {
          const v = t.getField(f)
          if(v)
            return true
          }
        return false
      },
      async (tiddler:Tiddler)=>{
        try {
          for(let f in taglikeFields) {
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
                //else
                //  console.log(f,str)
              }
              //else {
              //  console.log(f,v)
              //}
              v.forEach((name)=> {
                this.handleTag(model,f,name,tiddler)
              })
            }
          }
        }
        catch(E) {
          console.log("Error scanning",E)
        }
      })
  }
  async dump(reader:TiddlyModelReader) {
    const model = reader.model
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel'
      },
      async (tiddler:Tiddler)=>{
        try {
          const relpath = reader.files.relativePathFromTiddler(tiddler)
          const abspath = reader.tiddlerGuidToPathMap.get(tiddler.guid)
          if(relpath != abspath)
            console.log("ERROR:\n\tOUGHT:",relpath,"\n\tREAD :",abspath)
        }
        catch(E) {
          console.log("Error scanning",E,tiddler)
          throw E
        }
      })
  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const reader = await loadModelFromPath(flags.path)
      await this.analyze(reader.model)
      await this.dump(reader)
      }
  }
}
