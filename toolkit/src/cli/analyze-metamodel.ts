import Command, { flags } from '@oclif/command'
import { TiddlyModelImpl } from 'twiki-model'
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
      })
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path) {
	    const model = new TiddlyModelImpl(flags.path)
	    await model.load()
      console.log("Analyzing")
      const anal = new Analyzer()
      anal.merge(model)
      }
  }
}
