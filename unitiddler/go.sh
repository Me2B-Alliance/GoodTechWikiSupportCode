#!/bin/bash
docker build -t unitiddler .
C=`./serve.sh 2>&1`
echo CONTAINER=$C
docker ps
docker exec -it $C /bin/bash
docker stop $C
docker ps
