#!/bin/bash
rm -rf tsconfig.tsbuildinfo
pushd ../model;
if ./build.sh; then
	popd
	if tsc; then
		#./init.sh
		./bin/run analyze-metamodel
	fi
else
	popd
fi
