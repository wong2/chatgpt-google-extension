#!/bin/bash

rm -rf build
npx esbuild src/content-script/index.mjs src/background/index.mjs --bundle --outdir=build
cp src/*.css build/
case $1 in
  firefox)
    cp src/manifest.v2.json build/manifest.json
    ;;
  *)
    cp src/manifest.json build/
    ;;
esac
cp src/*.png build/
