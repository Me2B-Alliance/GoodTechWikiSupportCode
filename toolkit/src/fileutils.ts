import { TiddlyModel,Tiddler,TiddlyFactory, TiddlyMapFactory,TiddlyModelReader,TiddlyModelWriter} from 'twiki-model'
import { taglikeFields } from 'twiki-model'
import { lowerDashedSlug } from 'twiki-model'
import fs from 'fs-extra'

export class FileUtils
{
  static factory = new TiddlyFactory()
  static updatedNodes = new Map<string,Tiddler>()

  async saveNodeTiddlers(model:TiddlyModel,writer:TiddlyModelWriter) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'node'
      },
      async (tiddler:Tiddler)=>{
        try {
          await writer.saveTiddler(tiddler)
        }
        catch(E) {
          console.log("Error saving",E,tiddler)
          throw E
        }
      })
  }
  saveMapOfTiddlers(tmap:Map<string,Tiddler>,writer:TiddlyModelWriter) {
    tmap.forEach(async (tiddler:Tiddler,guid:string):Promise<void> => {
        try {
          console.log("Saving Tiddler",tiddler.title)
          await writer.saveTiddler(tiddler)
        }
        catch(E) {
          console.log("Error saving",E,tiddler)
          throw E
        }
      })
  }
  async removeBrokenTiddlers(reader:TiddlyModelReader) {

      const tiddlers = await reader.model.forAllTiddlersMatchingPredicate(
        (t:Tiddler) => {
          return true
        },
        async (tiddler:Tiddler)=>{
          const relpath = reader.files.relativePathFromTiddler(tiddler)
          const abspath = reader.tiddlerGuidToPathMap.get(tiddler.guid)
          try {
            if(relpath != abspath && abspath != undefined) {
              await fs.unlink(abspath)
              console.log("Removing",abspath)
            }
          }
          catch(E) {
            console.log("Error scanning",E)
          }
        })

  }

  async saveMapTiddlers(model:TiddlyModel,writer:TiddlyModelWriter,map_type:string) {
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        //console.log("TIDDLER",t.title,"is of type",t.tiddler_classification)
        return t.tiddler_classification == 'map' && t.map_type == map_type
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


}
