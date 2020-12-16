#!/usr/bin/env bash

{
  LIB_ROOT=./lib
  LIB_DIST=$LIB_ROOT/dist
  LIB_PACKAGE=./lib/package.json
  LIB_README=./lib/README.md
  LIB_DIST_PACKAGE=./lib/dist/package.json
  LIB_DIST_README=./lib/dist/README.md

  if [ -d "$LIB_DIST" ]; then
    echo "Remove $LIB_DIST"
    rm "$LIB_DIST" -r;
  fi
    
  echo "Compile $LIB_ROOT to $LIB_DIST"
  tsc -p ./lib

  echo "Copy $LIB_PACKAGE and $LIB_README to $LIB_DIST"
  cp $LIB_PACKAGE $LIB_DIST_PACKAGE
  cp $LIB_README $LIB_DIST_README

  echo "Done!"

} || {
  read -p "Press Enter to finish..."
}