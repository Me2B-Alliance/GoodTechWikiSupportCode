#!/usr/bin/env bash
docker run -it \
	-p 8439:8080 \
	-v $PWD/../TiddlyWiki5:/usr/src/app/TiddlyWiki5 \
	-v $PWD/wiki:/usr/src/app/TiddlyWiki5/wiki \
	-v $PWD/../GoodTechWiki:/usr/src/app/TiddlyWiki5/wiki/tiddlers \
	-v $PWD/system:/usr/src/app/TiddlyWiki5/wiki/tiddlers/system \
	goodtechwiki /bin/bash
