import Command, { flags } from '@oclif/command'
import { TiddlyMapFactory,loadModelFromPath,TiddlyModelWriter,TiddlyModel,Tiddler,TiddlyFactory,TiddlyModelReader } from 'twiki-model'
import { Analyzer } from '../analyzer'
import { FileUtils } from '../fileutils'
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
  static fileutils = new FileUtils()


  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const reader = await loadModelFromPath(flags.path)
      const model = reader.model
      await LocalCommand.analyzer.analyze(model)
      const writer = new TiddlyModelWriter(reader.files)
      await LocalCommand.fileutils.saveMetamodelTiddlers(model,writer)
      const factory = new TiddlyMapFactory(model)
      await LocalCommand.analyzer.generate_topic_maps(factory)
      await LocalCommand.fileutils.saveMapTiddlers(model,writer,'tagmap')
      LocalCommand.fileutils.saveMapOfTiddlers(Analyzer.updatedNodes,writer)
      }
  }
}
