#!/bin/bash
rm -rf tsconfig.tsbuildinfo
pushd ../model; tsc; popd
if tsc; then
	#./init.sh
	./bin/run analyze-metamodel
fi
