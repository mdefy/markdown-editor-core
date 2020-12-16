#!/usr/bin/env bash

{
  echo "Pack ./lib/dist to ./build"

  mkdir build
  cd ./build
  npm pack ../lib/dist

} || {
  read -p "Press Enter to finish..."
}