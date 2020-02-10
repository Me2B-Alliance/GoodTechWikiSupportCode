#!/bin/bash
rm -rf tsconfig.tsbuildinfo
if tsc; then
	#./init.sh
	./bin/run load
fi
