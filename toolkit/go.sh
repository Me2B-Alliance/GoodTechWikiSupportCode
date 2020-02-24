#!/bin/bash
DIRECTORY=$(cd `dirname $0` && pwd)
BASE=$DIRECTORY/..
WEBSITE_POSTS=$BASE/GoodTechWikiWebsite/_posts/
WIKI_DATA=$BASE/GoodTechWiki
WIKI_TAGMAPS=$WIKI_DATA/maps/tagmaps
rm -rf $DIRECTORY/tsconfig.tsbuildinfo 2>/dev/null
cd $BASE/model
if ./build.sh; then
	cd $DIRECTORY
	if tsc; then
		#./bin/run load -p $WIKI_DATA
		#rm -rf $WEBSITE_POSTS
		#mkdir $WEBSITE_POSTS
		#./bin/run nodes-to-github -g $WEBSITE_POSTS -p $WIKI_DATA
		#rm -rf $WIKI_TAGMAPS
		#mkdir $WIKI_TAGMAPS
		#./bin/run list-titles -p $WIKI_DATA | grep metamodel
		./bin/run generate-topic-maps -f activities -g $WIKI_TAGMAPS -p $WIKI_DATA
	fi
fi
