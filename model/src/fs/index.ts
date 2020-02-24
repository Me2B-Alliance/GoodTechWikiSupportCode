
import { TiddlyModel } from '..'
import { TiddlyFileModel } from './filemap'
import { TiddlyModelReader } from './reader'
import { TiddlyFactory } from '../tiddlers'

export async function loadModelFromPath(path:string):Promise<TiddlyModelReader>
{
  const model = new TiddlyModel()
  const files = new TiddlyFileModel(path)
  const factory = new TiddlyFactory()
  const reader = new TiddlyModelReader(files,{factory,model})
  await reader.load()
  return reader
}

export * from './reader'
export * from './filemap'
