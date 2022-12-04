#!/bin/bash

npx esbuild background/index.mjs --bundle --outfile=background.js

mkdir -p build
cp manifest.json build
cp *.js build
cp *.css build
cp logo.png build
