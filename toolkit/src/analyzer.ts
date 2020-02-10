import { TiddlyModel,
      EdgeTypeTiddler,NodeTypeTiddler,NodeTiddler
} from 'twiki-model'

export class ElementMinortype {
  name:string
  fieldName:string

  constructor(name:string,fieldName:string='element.subtype') {
    this.name = name
    this.fieldName = fieldName
  }
}

export class ElementMajorType {

}
export class ModelAnalysis
{
  nodeMap:Map<string,NodeTiddler>
  edgeTypes:EdgeTypeTiddler[]
  nodeTypes:NodeTypeTiddler[]

  elementMajorTypes:Map<string,ElementMajorType>

  constructor() {
    this.nodeMap = new Map<string,NodeTiddler>()
		this.edgeTypes = []
		this.nodeTypes = []
    this.elementMajorTypes = new Map<string,ElementMajorType>()
  }

  mergeNode(node:NodeTiddler) {
    console.log("Node:" + node.element_type,node.element_subtype,node.title)
  }
  merge(model:TiddlyModel) {
    console.log("DONE:",model.nodeMap)
    for(let id in model.nodeMap) {
      const node = model.nodeMap[id]
      this.mergeNode(node)
    }
    for(let m of model.nodeTypes) {
      console.log("NT:",m)
    }
    for(let m of model.edgeTypes) {
      console.log("ET:",m)
    }
  }
}
export class Analyzer
{
  constructor() {
  }

  merge(model:TiddlyModel) {
    this.dump(model)
  }

  dump(model:TiddlyModel) {
    const analysis = new ModelAnalysis()
    analysis.merge(model)
  }
}
