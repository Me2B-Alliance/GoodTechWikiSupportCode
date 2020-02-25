import { TiddlyModel,Tiddler,TiddlyFactory, TiddlyMapFactory} from 'twiki-model'
import { taglikeFields } from 'twiki-model'
import { lowerDashedSlug } from 'twiki-model'

export class Analyzer
{
  static factory = new TiddlyFactory()

  handleTag(model:TiddlyModel,field:string,v:string,t:Tiddler) {
    const mmtype = lowerDashedSlug(taglikeFields[field])
    let metamodel = model.findAnyTitleMatch(v)
    if(!metamodel) {
      //console.log("Metamodel Not Found",mmtype,field,v,t.title)
      metamodel = Analyzer.factory.createMetamodel("dimension",mmtype,v)
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

  async generate_topic_maps(factory:TiddlyMapFactory) {
    const model = factory.model
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'metamodel' && t.metamodel_type == 'dimension'
      },
      async (t:Tiddler)=>{
        try {
          console.log("Generate topic map for",t.metamodel_type,t.metamodel_subtype,t.title)
          factory.createTagMap(t)
        }
        catch(E) {
          console.log("Error scanning",E,t)
          throw E
        }
      })

  }
  async generate_neighbor_maps(factory:TiddlyMapFactory) {
    const model = factory.model
    const tiddlers = await model.forAllTiddlersMatchingPredicate(
      (t:Tiddler) => {
        return t.tiddler_classification == 'node'
      },
      async (t:Tiddler)=>{
        try {
          console.log("Generate neighbor map for",t.element_type,t.element_subtype,t.title)
          factory.createNeighborMap(t)
        }
        catch(E) {
          console.log("Error scanning",E,t)
          throw E
        }
      })

  }

}
