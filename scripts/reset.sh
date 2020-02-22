#!/bin/bash
DIRECTORY=$(cd `dirname $0` && pwd)
export WIKIBASE=$DIRECTORY/..

cd $WIKIBASE/GoodTechWiki
git pull origin master

cd $WIKIBASE/GoodTechWikiWebsite
git pull origin gh-pages

cd $WIKIBASE/schema
npm install
tsc

cd $WIKIBASE/model
npm install
tsc

cd $WIKIBASE/toolkit
npm install
tsc

./bin/run nodes-to-github
