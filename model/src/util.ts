import slugify from 'slugify'
import fs from 'fs-extra'
import { subtypeFields } from 'twiki-schema'

export function lowerDottedSlug(x:string) : string {
  const slug=
    slugify(x, {
      replacement: '.',    // replace spaces with replacement
      //remove: null,        // regex to remove characters
      lower: true,         // result in lower case
    })
    return slug || 'undefined'
}
export function lowerDashedSlug(x:string) : string {
  const slug=
    slugify(x, {
      replacement: '-',    // replace spaces with replacement
      //remove: null,        // regex to remove characters
      lower: true,         // result in lower case
    })
  return slug || 'undefined'
}

export function ensureDir(path:string,subdir?:string):string {
  // make sure this exists
  if (subdir)
    path = path + "/" + subdir
  fs.ensureDirSync(path)
  return path
}

export function getSubTypeFieldName(t:string|undefined):string {
	const st = subtypeFields[t || 'unknown'] || "element.subtype"
	return lowerDottedSlug(st)
}

export const peopleFields = [
  "people",
  "key.people",
  "authors.editors"
]
export const taglikeFields = {
  "activities":"Activity",
  "purpose":"Purpose",
  "tags":"Tag",
  "digital.harms.addressed":"Digital Harm"
}
