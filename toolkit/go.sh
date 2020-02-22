#!/bin/bash
rm -rf tsconfig.tsbuildinfo
pushd ../model;
if ./build.sh; then
	popd
	if tsc; then
		#./init.sh
		./bin/run nodes-to-github
	fi
else
	popd
fi
