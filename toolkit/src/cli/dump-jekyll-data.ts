import Command, { flags } from '@oclif/command'
import { loadModelFromPath,TiddlyModel,Tiddler,TiddlyFactory } from 'twiki-model'
import fs from 'fs-extra'
import path from 'path'
import { peopleFields,lowerDashedSlug } from 'twiki-model'
import { Analyzer } from '../analyzer'

function checkDir(arg:string) {
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
        parse: input => checkDir(input),
        default: './input',           // default value if no arg input
        options: undefined // ['a', 'b'],        // only allow input to be from a discrete set
      }),
    data: flags.option({
        char: 'd',               // name of arg to show in help and reference with args[name]
        name: 'data',               // name of arg to show in help and reference with args[name]
        required: true,            // make the arg required with `required: true`
        description: 'gh-pages _data base', // help description
        hidden: false,               // hide this arg from help
        parse: input => checkDir(input),
        default: './output',           // default value if no arg input
        options: undefined // ['a', 'b'],        // only allow input to be from a discrete set
      }),
  }

  static args = []
  static factory = new TiddlyFactory()
  static analyzer = new Analyzer()

  async dump_nodes(model:TiddlyModel,base:string):Promise<any> {
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

    const filename = path.join(base,"nodes.json")
    console.log("Writing ",filename)
    await fs.writeFile(filename,JSON.stringify(data,null,2))
  }

  async dump_metamodel(model:TiddlyModel,base:string):Promise<any> {
    const tiddlerDataPromises = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel'
      },
      async (tiddler:Tiddler)=>{
        try {
          const n = [] as any[]
          for(let node of tiddler.nodes||[]) {
            n.push({
              title:node.title,
              description:node.wiki_text
            })
          }
          const datum={
            guid:tiddler.guid,
            title:tiddler.title,
            page:lowerDashedSlug(tiddler.title),
            description:tiddler.wiki_text,
            metamodel_type:tiddler.metamodel_type,
            metamodel_subtype:tiddler.metamodel_subtype,
            nodes:n,
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
      byTitle:{},
      types:{}
    }
    function ensure(ref:any,element:string):any {
      if(!ref[element])
        ref[element]={}
      return ref[element]
    }
    for(let datum of tiddlerData) {
      data.byGuid[datum.guid] = datum
      data.byTitle[datum.title] = datum
      const elt_type = ensure(data.types,datum.metamodel_type)
      const elt_subtype = ensure(elt_type,datum.metamodel_subtype)
      elt_subtype[datum.title] = datum
    }

    const filename = path.join(base,"metamodel.json")
    console.log("Writing ",filename)
    await fs.writeFile(filename,JSON.stringify(data,null,2))
  }

  async dump_topics(model:TiddlyModel,base:string):Promise<any> {
    base = path.join(base,"../_pages/topics/github")
    const tiddlerDataPromises = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel'
      },
      async (tiddler:Tiddler)=>{
        try {
          const filename = path.join(base,lowerDashedSlug(tiddler.title)+".md")
          const data =
            "---\n"+
            "layout: default\n"+
            "---\n"+
            "<style>\n"+
            ".initial-content {\n"+
            "  padding-left:5%;\n"+
            "  padding-right:25px;\n"+
            "}\n"+
            "iframe {\n"+
            "  background: url('/loader.jpg') no-repeat center top;\n"+
            "  background-size: 150px 150px;\n"+
            "  min-height: 350px;\n"+
            "}\n"+
            "</style>\n"+
            "\n"+
            "## <a href='/_pages/embed?t="+tiddler.title+"'>"+tiddler.title+"</a>\n"+
            //"\n"+
            //tiddler.wiki_text+
            "\n"+
            "<iframe style='border:0px;background=white;' width='100%' src='{{site.data.urls.unitiddler}}/#"+tiddler.title+"'></iframe>\n"+
            "\n"+
            "{% for term in site.data.metamodel.byTitle['"+tiddler.title+"'].nodes %}\n"+
            "### <a href='/_pages/embed?t={{ term.title | url_encode }}'>{{ term.title }}</a>\n"+
            "\n"+
            "<a href='{{ term.website | url_encode }}'>{{ term.website }}</a>\n"+
            "<a href='{{ term.url | url_encode }}'>{{ term.url }}</a>\n"+
            "\n"+
            "{{ term.description }}\n"+
            "{% endfor %}\n"

          console.log("Writing ",filename)
          await fs.writeFile(filename,data)

        }
        catch(E) {
          console.log("Error scanning",E)
          throw E
        }
      })

      await Promise.all(tiddlerDataPromises)

  }

  async run() {
    const {args, flags} = this.parse(LocalCommand)

    if (flags.path && flags.data) {
	    const reader = await loadModelFromPath(flags.path)
      const model = reader.model
      await LocalCommand.analyzer.analyze(model)
      await this.dump_nodes(model,flags.data)
      await this.dump_metamodel(model,flags.data)
      await this.dump_topics(model,flags.data)
      }
  }
}
