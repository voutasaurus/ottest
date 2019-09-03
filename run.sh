#!/bin/bash

# setup
set -ex

# build
cd gohello && docker build -t gohello . && cd ..
cd nodehello && docker build -t nodehello . && cd ..
cd nesthello && docker build -t nesthello . && cd ..

# main
docker-compose up

# cleanup
set +ex
