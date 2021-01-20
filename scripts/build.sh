#!/usr/bin/env bash

{
  LIB_ROOT=./lib
  LIB_DIST=$LIB_ROOT/dist
  LIB_PACKAGE=$LIB_ROOT/package.json
  LIB_README=./README.md
  LIB_LICENSE=./LICENSE
  LIB_DIST_PACKAGE=$LIB_ROOT/dist/package.json
  LIB_DIST_README=$LIB_ROOT/dist/README.md
  LIB_DIST_LICENSE=$LIB_ROOT/dist/LICENSE

  if [ -d "$LIB_DIST" ]; then
    echo "Remove $LIB_DIST"
    rm "$LIB_DIST" -r;
  fi
    
  echo "Compile $LIB_ROOT to $LIB_DIST"
  tsc -p ./lib

  echo "Copy $LIB_PACKAGE and $LIB_README to $LIB_DIST"
  cp $LIB_PACKAGE $LIB_DIST_PACKAGE
  cp $LIB_README $LIB_DIST_README
  cp $LIB_LICENSE $LIB_DIST_LICENSE

  echo "Done!"

} || {
  read -p "Press Enter to finish..."
}