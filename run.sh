#!/bin/bash

# setup
set -ex

# build
./build.sh

# main
docker-compose up

# cleanup
set +ex
