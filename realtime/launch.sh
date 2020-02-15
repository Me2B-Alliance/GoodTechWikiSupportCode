#!/bin/bash
cd /usr/src/app/TiddlyWiki5
exec node ./tiddlywiki.js ./wiki --listen \
  host=0.0.0.0 \
  debug-level=debug \
  gzip=yes \
  root-tiddler=\$:/core/save/all-external-js \
  >/tmp/wikilog.txt 2>&1
