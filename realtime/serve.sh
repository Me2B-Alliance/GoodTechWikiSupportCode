#!/usr/bin/env bash
docker run -it \
	--restart always \
	-p 8437:8080 \
	-v $PWD/../TiddlyWiki5:/usr/src/app/TiddlyWiki5 \
	-v $PWD/wiki:/usr/src/app/TiddlyWiki5/wiki \
	-v $PWD/../GoodTechWiki:/usr/src/app/TiddlyWiki5/wiki/tiddlers \
	-v $PWD/system:/usr/src/app/TiddlyWiki5/wiki/tiddlers/system \
	-v $PWD/views:/usr/src/app/TiddlyWiki5/wiki/tiddlers/views \
	-d \
	goodtechwiki "$@"
