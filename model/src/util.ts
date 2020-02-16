import slugify from 'slugify'
import fs from 'fs-extra'

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
