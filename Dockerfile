FROM node:current-alpine3.14

# Create directory
WORKDIR /usr/src/ipfs-w3auth

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn && yarn build

# Run
ENTRYPOINT yarn start
