FROM node:current-alpine3.14

# Create directory
WORKDIR /usr/src/ipfs-w3auth

# Move source files to docker image
COPY . .

# Run
ENTRYPOINT yarn start
