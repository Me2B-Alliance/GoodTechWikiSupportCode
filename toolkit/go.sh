#!/bin/bash
DIRECTORY=$(cd `dirname $0` && pwd)
BASE=$DIRECTORY/..
WEBSITE_POSTS=$BASE/GoodTechWikiWebsite/_posts/
WIKI_DATA=$BASE/GoodTechWiki
rm -rf $DIRECTORY/tsconfig.tsbuildinfo 2>/dev/null
cd $BASE/model
if ./build.sh; then
	cd $DIRECTORY
	if tsc; then
		#./init.sh
		rm -rf $WEBSITE_POSTS
		mkdir $WEBSITE_POSTS
		./bin/run nodes-to-github -g $WEBSITE_POSTS -p $WIKI_DATA
	fi
fi
