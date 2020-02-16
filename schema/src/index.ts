
import { schema as event } from './event'
import { schema as workingGroup } from './working-group'
import { schema as person } from './person'
import { schema as organization } from './organization'
import { schema as projectOrProduct } from './project-or-product'
import { schema as publication } from './publication'

import { schemas as metamodel } from './metamodel'

// These keys are the 'input spreadsheet' keys
export const schemas = {
  event,
  person,
  'working-group':workingGroup,
  workingGroup,
  'project-or-product':projectOrProduct,
  projectOrProduct,
  organization,
  publication,
  metamodel
}

export const subtypeFields = {
  'event':'Category',
  'working-group':"Category",
  'person':undefined,
  'organization':"Org Type",
  'project-or-product':"Category",
  'publication':"Publication Type"

  // map
  //   edge-type
  //   node-type

  // metamodel
}


import { tiddler_schema as organization_ts } from './organization'

// These keys are the 'input spreadsheet' keys
export const tiddler_schemas = {
    organization:organization_ts,
  }
