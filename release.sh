#!/bin/bash
set -e
# Super simple release script for pagexray
# Lets use it it for now and make it better over time :)
# You need np for this to work
# npm install --global np
np $*

PACKAGE_VERSION=$(node -e 'console.log(require("./package").version)')