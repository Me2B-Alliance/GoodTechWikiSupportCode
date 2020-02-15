#!/usr/bin/env bash
docker run -it \
	--restart always \
	-p 127.0.0.1:8437:8080 \
	-v $PWD/../TiddlyWiki5:/usr/src/app/TiddlyWiki5 \
	-v $PWD/content:/usr/src/app/TiddlyWiki5/wiki \
	-v $PWD/../GoodTechWiki:/usr/src/app/TiddlyWiki5/wiki/tiddlers \
	-d \
	idtechwiki "$@"
