import { TiddlyModel,Tiddler,TiddlyFactory, TiddlyMapFactory} from 'twiki-model'
import { taglikeFields } from 'twiki-model'
import { lowerDashedSlug } from 'twiki-model'

function typestr(t:Tiddler) {
  return "(TYPE : "+t.general_type + "/" + t.general_subtype + ") named '"+t.title.substring(0,25)+"'"
}
export class Analyzer
{
  static factory = new TiddlyFactory()
  static updatedNodes = new Map<string,Tiddler>()

  handleTag(model:TiddlyModel,field:string,tag_slug:string,t:Tiddler) {
    function v_in_f() {
      return "value '"+tag_slug+"' in field '"+field+"' of Tiddler "+typestr(t)
    }

    tag_slug = tag_slug.toLowerCase().trim()

    const requested_metamodel_type = lowerDashedSlug(taglikeFields[field])

    let metamodel = model.findAnyTitleMatch(tag_slug)
    if(!metamodel) {
      //console.log("Metamodel Not Found",requested_metamodel_type,field,tag_slug,t.title)
      metamodel = Analyzer.factory.createMetamodel("dimension",requested_metamodel_type,tag_slug)
      model.integrateTiddler(metamodel)
      //person.addEdge(t.guid,field)
    }
    else {
      if(metamodel.tiddler_classification!='metamodel') {
        console.log("NON METAMODEL TAG - we found a",typestr(metamodel),"because of",v_in_f()," but we were expecting a dimension of type",requested_metamodel_type)
        const newtitle = (metamodel.title + " ("+requested_metamodel_type+")").toLowerCase().trim()
        const oldtitle = metamodel.title.toLowerCase().trim()
        t.swapFieldValue(field,oldtitle,newtitle)
        Analyzer.updatedNodes.set(t.guid,t)
        this.handleTag(model,field,newtitle,t)
      }
      else {
        // should also check 'dimension'
        if(metamodel.metamodel_subtype != requested_metamodel_type) {
          console.log("METAMODEL MISMATCH - we found a",typestr(metamodel),"because of",v_in_f()," but we were expecting a dimension of type",requested_metamodel_type)
          const newtitle = (metamodel.title + " ("+requested_metamodel_type+")").toLowerCase().trim()
          const oldtitle = metamodel.title.toLowerCase().trim()
          t.swapFieldValue(field,oldtitle,newtitle)
          Analyzer.updatedNodes.set(t.guid,t)
          this.handleTag(model,field,newtitle,t)
        }
        else {
          //console.log("Metamodel FOUND : "+v_in_f()+" matched",typestr(metamodel))
        }

      }
    }
    if(!metamodel.nodes)
      metamodel.nodes=[]
    metamodel.nodes.push(t)
    metamodel.setField("metamodel.fieldname",field)
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
