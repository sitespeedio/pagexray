#!/bin/bash
set -e
# Super simple release script for PageXray
# Lets use it for now and make it better over time :)
# You need np for this to work
# npm install --global np
np $* --any-branch

bin/index.js --version  > ../sitespeed.io/docs/_includes/version/pagexray.txt