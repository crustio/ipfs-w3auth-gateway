#!/bin/bash

IMAGEID="crustio/ipfs-w3auth:latest"
echo "Building crustio/ipfs-w3auth:latest ..."
docker build -t $IMAGEID .
