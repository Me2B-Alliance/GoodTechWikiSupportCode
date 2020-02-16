

import { schema as definition } from './definition'
import { schema as nodeType } from './nodeType'
import { schema as edgeType } from './edgeType'
import { schema as dimension } from './dimension'

// These keys are the 'input spreadsheet' keys
export const schemas = {
    definition,
    nodeType,
    edgeType,
    dimension
  }


import { tiddler_schema as definition_ts } from './definition'
import { tiddler_schema as nodeType_ts } from './nodeType'
import { tiddler_schema as edgeType_ts } from './edgeType'
import { tiddler_schema as dimension_ts } from './dimension'

// These keys are the 'input spreadsheet' keys
export const tiddler_schemas = {
    definition:definition_ts,
    nodeType:nodeType_ts,
    edgeType:edgeType_ts,
    dimension:dimension_ts
  }
