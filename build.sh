#!/bin/bash

rm -rf build
npx esbuild src/content-script/index.mjs src/background/index.mjs --bundle --outdir=build
cp src/*.css build/
cp src/*.json build/
cp src/*.png build/