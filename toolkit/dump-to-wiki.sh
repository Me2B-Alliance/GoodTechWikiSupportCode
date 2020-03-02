#!/bin/bash
DIRECTORY=$(cd `dirname $0` && pwd)
BASE=$DIRECTORY/..
WEBSITE_DATA=$BASE/GoodTechWikiWebsite/_data/
WIKI_DATA=$BASE/GoodTechWiki
rm -rf $DIRECTORY/tsconfig.tsbuildinfo 2>/dev/null
cd $BASE/model
if ./build.sh; then
	cd $DIRECTORY
	if tsc; then
		./bin/run update-nodes -p $WIKI_DATA
		./bin/run dump-jekyll-data -p $WIKI_DATA -d $WEBSITE_DATA
	fi
fi
