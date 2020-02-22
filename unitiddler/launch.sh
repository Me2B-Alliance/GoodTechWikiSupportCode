#!/bin/bash
cd /usr/src/app/TiddlyWiki5
LOG=/tmp/wikilog.txt
DATE=`date`
echo "Starting : $DATE" > $LOG
echo "PWD="$PWD >> $LOG
node -v >> $LOG
ls -al wiki >> $LOG
echo "Executing Node...." >> $LOG
exec node ./tiddlywiki.js ./wiki --listen \
  host=0.0.0.0 \
  debug-level=debug \
  gzip=yes \
  root-tiddler=\$:/core/save/all-external-js \
  >>$LOG 2>&1
