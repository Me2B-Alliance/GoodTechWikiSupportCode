
import { schema as event } from './event'
import { schema as workingGroup } from './working-group'
import { schema as person } from './person'
import { schema as organization } from './organization'
import { schema as projectOrProduct } from './project-or-product'
import { schema as publication } from './publication'

// These keys are the 'input spreadsheet' keys
export const schemas = {
  event,
  person,
  'working-group':workingGroup,
  'project-or-product':projectOrProduct,
  organization,
  publication
}
