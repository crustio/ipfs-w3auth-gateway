FROM node:20-alpine

# Create directory
WORKDIR /usr/src/ipfs-w3auth

# Move source files to docker image
COPY . .

# Run
ENTRYPOINT yarn start
