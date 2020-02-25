import Command, { flags } from '@oclif/command'
import { TiddlyMapFactory,loadModelFromPath,TiddlyModelWriter,TiddlyModel,Tiddler,TiddlyFactory,TiddlyModelReader } from 'twiki-model'
import { Analyzer } from '../analyzer'
import { taglikeFields } from 'twiki-model'
import { lowerDashedSlug } from 'twiki-model'

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
  static analyzer = new Analyzer()

  async saveMetamodelTiddlers(model:TiddlyModel,writer:TiddlyModelWriter) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel'
      },
      async (tiddler:Tiddler)=>{
        try {
          await writer.saveTiddler(tiddler)
        }
        catch(E) {
          console.log("Error scanning",E,tiddler)
          throw E
        }
      })
  }
  async saveMapTiddlers(model:TiddlyModel,writer:TiddlyModelWriter) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        console.log("TIDDLER",t.title,"is of type",t.tiddler_classification)
        return t.tiddler_classification == 'map'
      },
      async (tiddler:Tiddler)=>{
        try {
          await writer.saveTiddler(tiddler)
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
      const model = reader.model
      await LocalCommand.analyzer.analyze(model)
      const writer = new TiddlyModelWriter(reader.files)
      await this.saveMetamodelTiddlers(model,writer)
      const factory = new TiddlyMapFactory(model)
      await LocalCommand.analyzer.generate_topic_maps(factory)
      await this.saveMapTiddlers(model,writer)
      }
  }
}
