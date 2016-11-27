#!/bin/bash
set -e
# Super simple release script for pagexray
# Lets use it it for now and make it better over time :)
# You need np for this to work
# npm install --global np
np $*

PACKAGE_VERSION=$(node -e 'console.log(require("./package").version)')

docker build --no-cache -t sitespeedio/pagexray:$PACKAGE_VERSION -t sitespeedio/pagexray:latest .

docker login

docker push sitespeedio/pagexray:$PACKAGE_VERSION
docker push sitespeedio/pagexray:latest